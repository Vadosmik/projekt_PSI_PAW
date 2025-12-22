package com.vadosmik.checktogo_api.model;

import jakarta.persistence.*;

@Entity
@Table(name = "placestovisit", schema = "project_java")
public class Places {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "trip_id", nullable = false)
  private Long tripId;

  @Column(nullable = false, length = 255)
  private String title;

  @Column(length = 255)
  private String img;

  @Column(columnDefinition = "TEXT")
  private String description;

  @Column(name = "is_visited")
  private Boolean isVisited = false;

  public Places() {}

  // Gettery i Settery
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public Long getTripId() { return tripId; }
  public void setTripId(Long tripId) { this.tripId = tripId; }
  public String getTitle() { return title; }
  public void setTitle(String title) { this.title = title; }
  public String getImg() { return img; }
  public void setImg(String img) { this.img = img; }
  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }
  public Boolean getIsVisited() { return isVisited; }
  public void setIsVisited(Boolean isVisited) { this.isVisited = isVisited; }
}
