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

    // 게시판용 visibility / skin 허용 값
    private static final Set<String> ALLOWED_VISIBILITY = Set.of(
            "PUBLIC", "MEMBER", "STAFF", "MANAGER", "SUPER"
    );

    private static final Set<String> ALLOWED_SKIN = Set.of(
            "basic", "gallery", "event"
    );

    /** visibility 값 검증 */
    private void validateVisibility(String visibility) {
        if (!ALLOWED_VISIBILITY.contains(visibility)) {
            throw new IllegalArgumentException("허용되지 않는 visibility 값입니다: " + visibility);
        }
    }

    /** skin 값 검증 */
    private void validateSkin(String skin) {
        if (!ALLOWED_SKIN.contains(skin)) {
            throw new IllegalArgumentException("허용되지 않는 skin 값입니다: " + skin);
        }
    }

    /** 로그인 관리자 조회 + roleCode 얻기 */
    private AdminUser getLoginAdmin(HttpServletRequest request) {
        Long loginAdminId = (Long) request.getAttribute("loginAdminId");
        if (loginAdminId == null) {
            throw new IllegalStateException("로그인한 관리자만 사용할 수 있는 기능입니다.");
        }

        return adminUserRepository.findById(loginAdminId)
                .orElseThrow(() -> new IllegalStateException("로그인 관리자 정보를 찾을 수 없습니다."));
    }

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

    /** 단일 게시판 상세 (수정 진입 시) */
    @Transactional(readOnly = true)
    public BoardSummaryResponse getBoard(Long boardId) {

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("게시판을 찾을 수 없습니다. id=" + boardId));

        return BoardSummaryResponse.from(board);
    }

    /** 게시판 생성 (게시판명, 권한, 상태, 스킨) */
    @Transactional
    public BoardSummaryResponse createBoard(BoardCreateRequest request, HttpServletRequest httpRequest) {

        AdminUser loginAdmin = getLoginAdmin(httpRequest);
        String loginRoleCode = getRoleCode(loginAdmin);

        if (loginRoleCode == null) {
            throw new IllegalStateException("로그인 관리자에게 권한(Role)이 설정되어 있지 않습니다.");
        }

        // 권한 규칙: SUPER, MANAGER만 게시판 생성 가능 (원하면 STAFF도 열어줄 수 있음)
        if (!"SUPER".equals(loginRoleCode) && !"MANAGER".equals(loginRoleCode)) {
            throw new IllegalStateException("게시판 생성은 SUPER 또는 MANAGER만 가능합니다.");
        }

        validateVisibility(request.getVisibility());
        validateSkin(request.getSkin());

        Board board = new Board();
        board.setName(request.getName());
        board.setVisibility(request.getVisibility());
        board.setStatus(request.isStatus());
        board.setSkin(request.getSkin());
        board.setPostCount(0L);
        board.setCreatedBy(loginAdmin);

        Board saved = boardRepository.save(board);

        return BoardSummaryResponse.from(saved);
    }

    /** 게시판 수정 (게시판명, 권한, 상태, 스킨) */
    @Transactional
    public BoardSummaryResponse updateBoard(Long boardId, BoardUpdateRequest request, HttpServletRequest httpRequest) {

        AdminUser loginAdmin = getLoginAdmin(httpRequest);
        String loginRoleCode = getRoleCode(loginAdmin);

        if (loginRoleCode == null) {
            throw new IllegalStateException("로그인 관리자에게 권한(Role)이 설정되어 있지 않습니다.");
        }

        // 권한 규칙: SUPER, MANAGER만 수정 가능
        if (!"SUPER".equals(loginRoleCode) && !"MANAGER".equals(loginRoleCode)) {
            throw new IllegalStateException("게시판 수정은 SUPER 또는 MANAGER만 가능합니다.");
        }

        validateVisibility(request.getVisibility());
        validateSkin(request.getSkin());

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("게시판을 찾을 수 없습니다. id=" + boardId));

        board.setName(request.getName());
        board.setVisibility(request.getVisibility());
        board.setStatus(request.isStatus());
        board.setSkin(request.getSkin());

        // PreUpdate 에서 updatedAt 처리됨
        return BoardSummaryResponse.from(board);
    }

    /** 게시판 삭제
     *
     *  여기서는 안전하게:
     *   - SUPER만 삭제 가능
     *   - 실제로는 status=false 로 "비활성" 처리
     *  (진짜 DB에서 지우고 싶으면 hardDeleteBoard 사용)
     */
    @Transactional
    public void deleteBoard(Long boardId, HttpServletRequest httpRequest) {

        AdminUser loginAdmin = getLoginAdmin(httpRequest);
        String loginRoleCode = getRoleCode(loginAdmin);

        if (!"SUPER".equals(loginRoleCode)) {
            throw new IllegalStateException("게시판 삭제는 SUPER 관리자만 가능합니다.");
        }

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("게시판을 찾을 수 없습니다. id=" + boardId));

        // 소프트 삭제: 사용 여부 false
        board.setStatus(false);
    }

    /** 정말 물리 삭제가 필요하면 별도로 */
    @Transactional
    public void hardDeleteBoard(Long boardId, HttpServletRequest httpRequest) {

        AdminUser loginAdmin = getLoginAdmin(httpRequest);
        String loginRoleCode = getRoleCode(loginAdmin);

        if (!"SUPER".equals(loginRoleCode)) {
            throw new IllegalStateException("게시판 삭제는 SUPER 관리자만 가능합니다.");
        }

        boardRepository.deleteById(boardId);
    }

    /** 게시판 상태 변경 (1건씩) */
    @Transactional
    public void changeBoardStatus(Long boardId, boolean active, HttpServletRequest httpRequest) {

        AdminUser loginAdmin = getLoginAdmin(httpRequest);
        String loginRoleCode = getRoleCode(loginAdmin);

        if (loginRoleCode == null) {
            throw new IllegalStateException("로그인 관리자에게 권한(Role)이 설정되어 있지 않습니다.");
        }

        // 권한 규칙: SUPER, MANAGER만 상태 변경 가능
        if (!"SUPER".equals(loginRoleCode) && !"MANAGER".equals(loginRoleCode)) {
            throw new IllegalStateException("게시판 상태 변경은 SUPER 또는 MANAGER만 가능합니다.");
        }

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("게시판을 찾을 수 없습니다. id=" + boardId));

        board.setStatus(active);
        // @Transactional 이라 save 안 해도 flush 시점에 반영됨
    }

    /** 게시판 여러 개 한 번에 삭제 (다건) */
    @Transactional
    public void deleteBoardsBulk(List<Long> boardIds, HttpServletRequest httpRequest) {

        AdminUser loginAdmin = getLoginAdmin(httpRequest);
        String loginRoleCode = getRoleCode(loginAdmin);

        if (!"SUPER".equals(loginRoleCode)) {
            throw new IllegalStateException("게시판 삭제는 SUPER 관리자만 가능합니다.");
        }

        if (boardIds == null || boardIds.isEmpty()) {
            return; // 지울 게 없으면 그냥 통과
        }

        // 필요하면 여기서 "존재하지 않는 id" 체크도 가능
        // 예: boardRepository.findAllById(boardIds) 크기 비교 등

        // ⚠ 여기서는 **물리 삭제** (DB에서 실제 삭제)
        // 게시글(Post)와 FK 관계가 있다면 제약조건 맞춰줘야 함
        boardRepository.deleteAllByIdInBatch(boardIds);
    }
}