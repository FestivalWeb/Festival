package org.zerock.backend.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "media_file")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MediaFile {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "file_id")
    private Long fileId;

    @Column(name = "storage_uri", length = 255, nullable = false)
    private String storageUri;

    @Column(name = "type", length = 120, nullable = false)
    private String type;

    @Column(name = "size_bytes")
    private Long sizeBytes;

    @Column(name = "weight")
    private Long weight;

    @Column(name = "height")
    private Long height;

    @Column(name = "duration_sec")
    private Long durationSec;

    @Column(name = "thumb_uri", length = 255)
    private String thumbUri;
}