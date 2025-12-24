package com.vadosmik.checktogo_api.model;

import jakarta.persistence.*;

@Entity
@Table(name = "items", schema = "project_java")
public class Items {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "trip_id", nullable = false)
  private Long tripId;

  @Column(name = "category_id", nullable = false)
  private Long categoryId;

  @Column(nullable = false, length = 255)
  private String title;

  @Column(name = "is_packed")
  private Boolean isPacked = false;

  public Items() {
  }

  // Gettery i Settery
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getTripId() {
    return tripId;
  }

  public void setTripId(Long tripId) {
    this.tripId = tripId;
  }

  public Long getCategoryId() {
    return categoryId;
  }

  public void setCategoryId(Long categoryId) {
    this.categoryId = categoryId;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public Boolean getIsPacked() {
    return isPacked;
  }

  public void setIsPacked(Boolean isPacked) {
    this.isPacked = isPacked;
  }
}
