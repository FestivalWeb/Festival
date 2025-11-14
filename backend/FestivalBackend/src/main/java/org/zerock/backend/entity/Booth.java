package org.zerock.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "booth") 
public class Booth {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booth_id")
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(name = "context", nullable = false, length = 500)
    private String context;

    @Column(name = "img", length = 500)
    private String img;

    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    @Column(nullable = false)
    private Long price;

    @Column(name = "max_person", nullable = false)
    private Long maxPerson;

    @Column(nullable = false, length = 200)
    private String location;

    @ManyToMany
    @JoinTable(
        name = "booth_img_mapping",
        joinColumns = @JoinColumn(name = "booth_id"),
        inverseJoinColumns = @JoinColumn(name = "file_id")
    )
    private Set<MediaFile> images = new LinkedHashSet<>();

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContext() { return context; }
    public void setContext(String context) { this.context = context; }
    public String getImg() { return img; }
    public void setImg(String img) { this.img = img; }
    public LocalDate getEventDate() { return eventDate; }
    public void setEventDate(LocalDate eventDate) { this.eventDate = eventDate; }
    public Long getPrice() { return price; }
    public void setPrice(Long price) { this.price = price; }
    public Long getMaxPerson() { return maxPerson; }
    public void setMaxPerson(Long maxPerson) { this.maxPerson = maxPerson; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public Set<MediaFile> getImages() { return images; }
    public void setImages(Set<MediaFile> images) { this.images = images; }
}
