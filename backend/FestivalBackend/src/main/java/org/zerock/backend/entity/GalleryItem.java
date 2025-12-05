package org.zerock.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "gallery_item")
public class GalleryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "album_id")
    private GalleryAlbum album;

    @Column(length = 200)
    private String title;

    @Column(length = 1000)
    private String caption;

    @Column(length = 200)
    private String location;

    @Column(name = "status", nullable = false)
    private boolean status = true;

    @Column(name = "admin_id", nullable = false)
    private Long adminId;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

   @OneToMany(mappedBy = "item",
               cascade = CascadeType.ALL,
               orphanRemoval = true)
    private Set<ItemMedia> mediaMappings = new LinkedHashSet<>();

    public Long getId() { return id; }
    public GalleryAlbum getAlbum() { return album; }
    public void setAlbum(GalleryAlbum album) { this.album = album; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getCaption() { return caption; }
    public void setCaption(String caption) { this.caption = caption; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public boolean isStatus() { return status; }
    public void setStatus(boolean status) { this.status = status; }
    public Long getAdminId() { return adminId; }
    public void setAdminId(Long adminId) { this.adminId = adminId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public Set<ItemMedia> getMediaMappings() { return mediaMappings; }
    public void setMediaMappings(Set<ItemMedia> mediaMappings) {
        this.mediaMappings = mediaMappings;
    }
}
