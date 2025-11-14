package org.zerock.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "media_file")
public class MediaFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "file_id")
    private Long id;

    @Column(name = "storage_uri", nullable = false, length = 255)
    private String storageUri;

    @Column(name = "type", nullable = false, length = 120)
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

    // getters/setters
    public Long getId() { return id; }
    public String getStorageUri() { return storageUri; }
    public void setStorageUri(String storageUri) { this.storageUri = storageUri; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Long getSizeBytes() { return sizeBytes; }
    public void setSizeBytes(Long sizeBytes) { this.sizeBytes = sizeBytes; }
    public Long getWeight() { return weight; }
    public void setWeight(Long weight) { this.weight = weight; }
    public Long getHeight() { return height; }
    public void setHeight(Long height) { this.height = height; }
    public Long getDurationSec() { return durationSec; }
    public void setDurationSec(Long durationSec) { this.durationSec = durationSec; }
    public String getThumbUri() { return thumbUri; }
    public void setThumbUri(String thumbUri) { this.thumbUri = thumbUri; }
}
