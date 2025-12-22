package com.vadosmik.checktogo_api.controller;

import com.vadosmik.checktogo_api.model.Categories;
import com.vadosmik.checktogo_api.model.Users;
import com.vadosmik.checktogo_api.repository.UsersRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UsersController {
  private final UsersRepository repository;

  UsersController(UsersRepository repository) {
    this.repository = repository;
  }

  @GetMapping("/users")
  List<Users> getUsers() {
    return repository.findAll();
  }

  @GetMapping("/user/{id}")
  Users getUser(@PathVariable Long id) {
    return repository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
  }

  @PostMapping("/user")
  Users saveUser(@RequestBody Users newUser) {
    return repository.save(newUser);
  }

  @PutMapping("/user/{id}")
  Users updateUser(@RequestBody Users newUser, @PathVariable Long id) {
    return repository.findById(id)
        .map(user -> {
          if (newUser.getUsername() != null) { user.setUsername(newUser.getUsername()); }
          if (newUser.getEmail() != null) { user.setEmail(newUser.getEmail()); }
          if (newUser.getPassword() != null) { user.setPassword(newUser.getPassword()); }

          return repository.save(user);
        })
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
  }

  @DeleteMapping("/user/{id}")
  ResponseEntity<?> deleteUser(@PathVariable Long id) {
    if (!repository.existsById(id)) {
      return ResponseEntity.notFound().build();
    }
    repository.deleteById(id);
    return ResponseEntity.ok().build();
  }
}
