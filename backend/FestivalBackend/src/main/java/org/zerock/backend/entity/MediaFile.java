package org.zerock.backend.entity;
import jakarta.persistence.*;
import lombok.*;

/*
 * media_file 테이블 매핑 엔티티.
 *
 * 업로드된 이미지/영상/파일의 메타데이터를 저장하는 테이블이며,
 * 여러 기능(공지, 게시물, 갤러리 등)에서 공통으로 참조될 수 있는 구조.
 *
 * ItemMedia, NoticeImageMapping, BoothImageMapping 등
 * 다양한 조인 엔티티의 FK 대상이 되는 핵심 엔티티이다.
 *
 * 파일 자체를 DB에 저장하는 것이 아니라,
 * 파일 경로/타입/크기/썸네일 경로 등의 메타 정보만 저장한다.
 */

@Entity
@Table(name = "media_file")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MediaFile {
     /*
     * 파일 ID (PK, auto_increment)
     */
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "file_id")
    private Long fileId;

    /*
     * 실제 파일이 저장된 경로(URI).
     */
    @Column(name = "storage_uri", length = 255, nullable = false)
    private String storageUri;

    /*
     * 파일 타입 (image/png, image/jpeg, video/mp4 등)
     */
    @Column(name = "type", length = 120, nullable = false)
    private String type;

    /**
     * 파일 크기 (bytes)
     */
    @Column(name = "size_bytes")
    private Long sizeBytes;

    /**
     * 이미지/영상 파일의 가로 길이(px)
     */
    @Column(name = "weight")
    private Long weight;

    /**
     * 이미지/영상 파일의 세로 길이(px)
     */
    @Column(name = "height")
    private Long height;

    /**
     * 영상 파일일 경우 재생 시간(초)
     * 이미지일 경우 null
     */
    @Column(name = "duration_sec")
    private Long durationSec;

    /**
     * 이미지/영상 썸네일 경로(URI)
     */
    @Column(name = "thumb_uri", length = 255)
    private String thumbUri;
}