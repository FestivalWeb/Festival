package org.zerock.backend.admin.service;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.backend.admin.dto.board.BoardCreateRequest;
import org.zerock.backend.admin.dto.board.BoardSummaryResponse;
import org.zerock.backend.admin.dto.board.BoardUpdateRequest;
import org.zerock.backend.entity.AdminUser;
import org.zerock.backend.entity.Board;
import org.zerock.backend.repository.AdminUserRepository;
import org.zerock.backend.repository.BoardRepository;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BoardAdminService {

    private final BoardRepository boardRepository;
    private final AdminUserRepository adminUserRepository;

    // [수정 1] "Visibility" 대신 "Role" 허용 값 정의 (읽기/쓰기 공통 사용)
    private static final Set<String> ALLOWED_ROLES = Set.of(
            "PUBLIC", "MEMBER", "STAFF", "MANAGER", "SUPER"
    );

    private static final Set<String> ALLOWED_SKIN = Set.of(
            "basic", "gallery", "event"
    );

    /** [수정 2] 권한 값 검증 (readRole, writeRole 공용) */
    private void validateRole(String role, String fieldName) {
        if (!ALLOWED_ROLES.contains(role)) {
            throw new IllegalArgumentException(fieldName + " 값이 올바르지 않습니다: " + role);
        }
    }

    /** skin 값 검증 */
    private void validateSkin(String skin) {
        if (!ALLOWED_SKIN.contains(skin)) {
            throw new IllegalArgumentException("허용되지 않는 skin 값입니다: " + skin);
        }
    }

    /** 로그인 관리자 조회 */
    private AdminUser getLoginAdmin(HttpServletRequest request) {
        Long loginAdminId = (Long) request.getAttribute("loginAdminId");
        if (loginAdminId == null) {
            throw new IllegalStateException("로그인한 관리자만 사용할 수 있는 기능입니다.");
        }

        return adminUserRepository.findById(loginAdminId)
                .orElseThrow(() -> new IllegalStateException("로그인 관리자 정보를 찾을 수 없습니다."));
    }

    /** 관리자 권한 코드(RoleCode) 조회 */
    private String getRoleCode(AdminUser adminUser) {
        return adminUser.getRoles().stream()
                .map(ar -> ar.getRole().getRoleCode())
                .findFirst()
                .orElse(null);
    }

    /** 전체 게시판 목록 (관리자 화면용) */
    @Transactional(readOnly = true)
    public List<BoardSummaryResponse> getBoardList() {
        List<Board> boards = boardRepository.findAllByOrderByBoardIdAsc();

        return boards.stream()
                .map(BoardSummaryResponse::from)
                .collect(Collectors.toList());
    }

    /** 단일 게시판 상세 */
    @Transactional(readOnly = true)
    public BoardSummaryResponse getBoard(Long boardId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("게시판을 찾을 수 없습니다. id=" + boardId));

        return BoardSummaryResponse.from(board);
    }

    /** [수정 3] 게시판 생성 (읽기/쓰기 권한 분리 저장) */
    @Transactional
    public BoardSummaryResponse createBoard(BoardCreateRequest request, HttpServletRequest httpRequest) {

        AdminUser loginAdmin = getLoginAdmin(httpRequest);
        String loginRoleCode = getRoleCode(loginAdmin);

        if (loginRoleCode == null) {
            throw new IllegalStateException("권한이 설정되지 않은 관리자입니다.");
        }

        // 권한 체크: SUPER, MANAGER만 생성 가능
        if (!"SUPER".equals(loginRoleCode) && !"MANAGER".equals(loginRoleCode)) {
            throw new IllegalStateException("게시판 생성은 SUPER 또는 MANAGER만 가능합니다.");
        }

        // [변경] visibility 대신 readRole, writeRole 각각 검증
        validateRole(request.getReadRole(), "읽기 권한");
        validateRole(request.getWriteRole(), "쓰기 권한");
        validateSkin(request.getSkin());

        Board board = new Board();
        board.setName(request.getName());
        
        // [변경] 엔티티에 각각 저장
        board.setReadRole(request.getReadRole());
        board.setWriteRole(request.getWriteRole());
        
        board.setStatus(request.isStatus());
        board.setSkin(request.getSkin());
        board.setPostCount(0L);
        board.setCreatedBy(loginAdmin);

        Board saved = boardRepository.save(board);

        return BoardSummaryResponse.from(saved);
    }

    /** [수정 4] 게시판 수정 (읽기/쓰기 권한 분리 수정) */
    @Transactional
    public BoardSummaryResponse updateBoard(Long boardId, BoardUpdateRequest request, HttpServletRequest httpRequest) {

        AdminUser loginAdmin = getLoginAdmin(httpRequest);
        String loginRoleCode = getRoleCode(loginAdmin);

        if (!"SUPER".equals(loginRoleCode) && !"MANAGER".equals(loginRoleCode)) {
            throw new IllegalStateException("게시판 수정은 SUPER 또는 MANAGER만 가능합니다.");
        }

        // [변경] 검증 로직 분리
        validateRole(request.getReadRole(), "읽기 권한");
        validateRole(request.getWriteRole(), "쓰기 권한");
        validateSkin(request.getSkin());

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("게시판을 찾을 수 없습니다. id=" + boardId));

        board.setName(request.getName());
        
        // [변경] 각각 업데이트
        board.setReadRole(request.getReadRole());
        board.setWriteRole(request.getWriteRole());
        
        board.setStatus(request.isStatus());
        board.setSkin(request.getSkin());

        return BoardSummaryResponse.from(board);
    }

    /** 게시판 삭제 (소프트 삭제) */
    @Transactional
    public void deleteBoard(Long boardId, HttpServletRequest httpRequest) {
        AdminUser loginAdmin = getLoginAdmin(httpRequest);
        String loginRoleCode = getRoleCode(loginAdmin);

        if (!"SUPER".equals(loginRoleCode)) {
            throw new IllegalStateException("게시판 삭제(비활성)는 SUPER 관리자만 가능합니다.");
        }

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("게시판을 찾을 수 없습니다. id=" + boardId));

        board.setStatus(false); 
    }

    /** 게시판 물리 삭제 */
    @Transactional
    public void hardDeleteBoard(Long boardId, HttpServletRequest httpRequest) {
        AdminUser loginAdmin = getLoginAdmin(httpRequest);
        if (!"SUPER".equals(getRoleCode(loginAdmin))) {
            throw new IllegalStateException("게시판 완전 삭제는 SUPER 관리자만 가능합니다.");
        }
        boardRepository.deleteById(boardId);
    }

    /** 게시판 상태 변경 */
    @Transactional
    public void changeBoardStatus(Long boardId, boolean active, HttpServletRequest httpRequest) {
        AdminUser loginAdmin = getLoginAdmin(httpRequest);
        String loginRoleCode = getRoleCode(loginAdmin);

        if (!"SUPER".equals(loginRoleCode) && !"MANAGER".equals(loginRoleCode)) {
            throw new IllegalStateException("게시판 상태 변경 권한이 없습니다.");
        }

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("게시판을 찾을 수 없습니다. id=" + boardId));

        board.setStatus(active);
    }

    /** 게시판 다건 물리 삭제 */
    @Transactional
    public void deleteBoardsBulk(List<Long> boardIds, HttpServletRequest httpRequest) {
        AdminUser loginAdmin = getLoginAdmin(httpRequest);
        if (!"SUPER".equals(getRoleCode(loginAdmin))) {
            throw new IllegalStateException("게시판 삭제는 SUPER 관리자만 가능합니다.");
        }

        if (boardIds == null || boardIds.isEmpty()) return;

        boardRepository.deleteAllByIdInBatch(boardIds);
    }
}