package com.vadosmik.checktogo_api.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users", schema = "project_java")
public class Users {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String username;

  @Column(name = "password_hash", nullable = false)
  private String password;

  @Column(nullable = false, unique = true)
  private String email;

  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  public Users() {}

  @PrePersist
  protected void onCreate() {
    createdAt = LocalDateTime.now();
  }

  // Gettery i Settery
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public String getUsername() { return username; }
  public void setUsername(String username) { this.username = username; }
  public String getPassword() { return password; }
  public void setPassword(String password) { this.password = password; }
  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }
  public LocalDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

//  id SERIAL PRIMARY KEY,
//  username VARCHAR(255) NOT NULL,
//  email VARCHAR(255) NOT NULL UNIQUE,
//  password_hash VARCHAR(255) NOT NULL,
//  created_at TIMESTAMP NOT NULL DEFAULT NOW()
