package com.vadosmik.checktogo_api.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users", schema = "project_java")
public class Users {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
}
