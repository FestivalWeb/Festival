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
import org.zerock.backend.repository.NoticeRepository;
import org.zerock.backend.repository.AdminUserRepository;
import org.zerock.backend.repository.BoardRepository;
import org.zerock.backend.repository.PostRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BoardAdminService {

    private final BoardRepository boardRepository;
    private final PostRepository postRepository;
    private final NoticeRepository noticeRepository;
    private final AdminUserRepository adminUserRepository;

    // [기존 코드 유지] 권한/스킨 설정
    private static final Set<String> ALLOWED_ROLES = Set.of(
            "PUBLIC", "MEMBER", "STAFF", "MANAGER", "SUPER"
    );

    private static final Set<String> ALLOWED_SKIN = Set.of(
            "basic", "gallery", "event"
    );

    // [기존 코드 유지] 권한 값 검증
    private void validateRole(String role, String fieldName) {
        if (!ALLOWED_ROLES.contains(role)) {
            throw new IllegalArgumentException(fieldName + " 값이 올바르지 않습니다: " + role);
        }
    }

    // [기존 코드 유지] skin 값 검증
    private void validateSkin(String skin) {
        if (!ALLOWED_SKIN.contains(skin)) {
            throw new IllegalArgumentException("허용되지 않는 skin 값입니다: " + skin);
        }
    }

    // [기존 코드 유지] 로그인 관리자 조회
    private AdminUser getLoginAdmin(HttpServletRequest request) {
        Long loginAdminId = (Long) request.getAttribute("loginAdminId");
        if (loginAdminId == null) {
            throw new IllegalStateException("로그인한 관리자만 사용할 수 있는 기능입니다.");
        }

        return adminUserRepository.findById(loginAdminId)
                .orElseThrow(() -> new IllegalStateException("로그인 관리자 정보를 찾을 수 없습니다."));
    }

    // [기존 코드 유지] 권한 코드 조회
    private String getRoleCode(AdminUser adminUser) {
        return adminUser.getRoles().stream()
                .map(ar -> ar.getRole().getRoleCode())
                .findFirst()
                .orElse(null);
    }

    /** * 전체 게시판 목록 (관리자 화면용) */
    @Transactional(readOnly = true)
    public List<BoardSummaryResponse> getBoardList() {
        // 1. DB의 board 테이블에서 모든 게시판을 가져옵니다.
        List<Board> boards = boardRepository.findAllByOrderByBoardIdAsc();

        // 2. 각 게시판을 돌면서 스킨 종류에 따라 알맞은 게시물 수를 셉니다.
        return boards.stream().map(board -> {
            long count;
            
            // [핵심] 스킨이 'notice'라면 Notice 테이블의 숫자를 가져옴
            if ("notice".equals(board.getSkin())) {
                count = noticeRepository.count();
            } else {
                // 그 외(basic 등)는 Post 테이블의 숫자를 가져옴
                count = postRepository.countByBoard(board);
            }
            
            return BoardSummaryResponse.from(board, count);
        }).collect(Collectors.toList());
    }

    /** * 단일 게시판 상세 조회 */
    @Transactional(readOnly = true)
    public BoardSummaryResponse getBoard(Long boardId) {
        // [삭제됨] if (boardId == -1L) { ... } 로직 제거

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("게시판을 찾을 수 없습니다. id=" + boardId));

        long count;
        // 상세 조회 시에도 스킨이 notice면 Notice 테이블 카운트
        if ("notice".equals(board.getSkin())) {
            count = noticeRepository.count();
        } else {
            count = postRepository.countByBoard(board);
        }
        
        return BoardSummaryResponse.from(board, count);
    }

    /** 게시판 생성 - [수정됨: count(0) 추가] */
    @Transactional
    public BoardSummaryResponse createBoard(BoardCreateRequest request, HttpServletRequest httpRequest) {

        AdminUser loginAdmin = getLoginAdmin(httpRequest);
        String loginRoleCode = getRoleCode(loginAdmin);

        if (loginRoleCode == null) {
            throw new IllegalStateException("권한이 설정되지 않은 관리자입니다.");
        }

        if (!"SUPER".equals(loginRoleCode) && !"MANAGER".equals(loginRoleCode)) {
            throw new IllegalStateException("게시판 생성은 SUPER 또는 MANAGER만 가능합니다.");
        }

        validateRole(request.getReadRole(), "읽기 권한");
        validateRole(request.getWriteRole(), "쓰기 권한");
        validateSkin(request.getSkin());

        Board board = new Board();
        board.setName(request.getName());
        board.setReadRole(request.getReadRole());
        board.setWriteRole(request.getWriteRole());
        board.setStatus(request.isStatus());
        board.setSkin(request.getSkin());
        board.setPostCount(0L);
        board.setCreatedBy(loginAdmin);

        Board saved = boardRepository.save(board);

        // [수정] 새 게시판이므로 게시글 수는 0
        return BoardSummaryResponse.from(saved, 0L);
    }

    /** 게시판 수정 */
    @Transactional
    public BoardSummaryResponse updateBoard(Long boardId, BoardUpdateRequest request, HttpServletRequest httpRequest) {

        // [삭제됨] if (boardId == -1L) { ... } 로직 제거
        
        AdminUser loginAdmin = getLoginAdmin(httpRequest);
        String loginRoleCode = getRoleCode(loginAdmin);

        if (!"SUPER".equals(loginRoleCode) && !"MANAGER".equals(loginRoleCode)) {
            throw new IllegalStateException("게시판 수정은 SUPER 또는 MANAGER만 가능합니다.");
        }

        validateRole(request.getReadRole(), "읽기 권한");
        validateRole(request.getWriteRole(), "쓰기 권한");
        validateSkin(request.getSkin());

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("게시판을 찾을 수 없습니다. id=" + boardId));

        board.setName(request.getName());
        board.setReadRole(request.getReadRole());
        board.setWriteRole(request.getWriteRole());
        board.setStatus(request.isStatus());
        board.setSkin(request.getSkin());

        // 수정 후 응답에도 정확한 카운트 적용
        long count;
        if ("notice".equals(board.getSkin())) {
            count = noticeRepository.count();
        } else {
            count = postRepository.countByBoard(board);
        }
        
        return BoardSummaryResponse.from(board, count);
    }

    // [아래부터는 기존 코드와 동일]
    
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