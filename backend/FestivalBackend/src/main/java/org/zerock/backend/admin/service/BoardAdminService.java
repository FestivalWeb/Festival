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

    /** 로그인 관리자 조회 */
    private AdminUser getLoginAdmin(HttpServletRequest request) {
        Long loginAdminId = (Long) request.getAttribute("loginAdminId");
        if (loginAdminId == null) {
            throw new IllegalStateException("로그인한 관리자만 사용할 수 있는 기능입니다.");
        }

        return adminUserRepository.findById(loginAdminId)
                .orElseThrow(() -> new IllegalStateException("로그인 관리자 정보를 찾을 수 없습니다."));
    }

    /** * 관리자 권한 코드(RoleCode) 조회
     * AdminUser -> AdminRole -> RoleEntity -> roleCode 순서로 접근
     */
    private String getRoleCode(AdminUser adminUser) {
        return adminUser.getRoles().stream()
                .map(ar -> ar.getRole().getRoleCode()) 
                .findFirst()
                .orElse(null);
    }

    /** 전체 게시판 목록 (관리자 화면용) */
    @Transactional(readOnly = true)
    public List<BoardSummaryResponse> getBoardList() {
        // [참고] 데이터가 많아지면 repository에서 @EntityGraph(attributePaths = "createdBy") 사용 권장
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

    /** 게시판 생성 */
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

        validateVisibility(request.getVisibility());
        validateSkin(request.getSkin());

        Board board = new Board();
        board.setName(request.getName());
        board.setVisibility(request.getVisibility());
        board.setStatus(request.isStatus());
        board.setSkin(request.getSkin());
        board.setPostCount(0L);
        
        // [중요] Board 엔티티의 @ManyToOne createdBy 필드에 매핑
        board.setCreatedBy(loginAdmin); 

        Board saved = boardRepository.save(board);

        return BoardSummaryResponse.from(saved);
    }

    /** 게시판 수정 */
    @Transactional
    public BoardSummaryResponse updateBoard(Long boardId, BoardUpdateRequest request, HttpServletRequest httpRequest) {

        AdminUser loginAdmin = getLoginAdmin(httpRequest);
        String loginRoleCode = getRoleCode(loginAdmin);

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

        // PreUpdate에 의해 updatedAt 자동 갱신됨
        return BoardSummaryResponse.from(board);
    }

    /** * 게시판 상태 변경 (소프트 삭제)
     * - 실제 삭제 대신 '중지(status=false)' 처리
     */
    @Transactional
    public void deleteBoard(Long boardId, HttpServletRequest httpRequest) {

        AdminUser loginAdmin = getLoginAdmin(httpRequest);
        String loginRoleCode = getRoleCode(loginAdmin);

        if (!"SUPER".equals(loginRoleCode)) {
            throw new IllegalStateException("게시판 삭제(비활성)는 SUPER 관리자만 가능합니다.");
        }

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("게시판을 찾을 수 없습니다. id=" + boardId));

        board.setStatus(false); // 비활성 처리
    }

    /** * 게시판 물리 삭제 (주의!!)
     * - DB FK Cascade 설정이 되어 있어야 하위 글(Post)도 함께 삭제됨
     */
    @Transactional
    public void hardDeleteBoard(Long boardId, HttpServletRequest httpRequest) {
        AdminUser loginAdmin = getLoginAdmin(httpRequest);
        if (!"SUPER".equals(getRoleCode(loginAdmin))) {
            throw new IllegalStateException("게시판 완전 삭제는 SUPER 관리자만 가능합니다.");
        }
        boardRepository.deleteById(boardId);
    }

    /** 게시판 상태 변경 (활성/비활성 토글 등) */
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

    /** * 게시판 다건 물리 삭제 
     * [주의] 이 메서드는 JPA 엔티티 관계를 무시하고 DB 쿼리를 직접 날립니다.
     * DB 테이블 생성 시 'ON DELETE CASCADE' 옵션을 주었으므로
     * 게시판 삭제 시 소속된 Post들도 DB 레벨에서 자동으로 삭제됩니다.
     */
    @Transactional
    public void deleteBoardsBulk(List<Long> boardIds, HttpServletRequest httpRequest) {

        AdminUser loginAdmin = getLoginAdmin(httpRequest);
        if (!"SUPER".equals(getRoleCode(loginAdmin))) {
            throw new IllegalStateException("게시판 삭제는 SUPER 관리자만 가능합니다.");
        }

        if (boardIds == null || boardIds.isEmpty()) return;

        // DB Cascade 설정에 의존하여 삭제
        boardRepository.deleteAllByIdInBatch(boardIds);
    }
}