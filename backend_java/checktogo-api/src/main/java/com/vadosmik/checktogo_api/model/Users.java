package com.vadosmik.checktogo_api.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class Users {
  @Id
  @GeneratedValue
  private Long id;


}
