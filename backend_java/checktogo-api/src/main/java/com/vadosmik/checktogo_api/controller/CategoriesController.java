package com.vadosmik.checktogo_api.controller;

import com.vadosmik.checktogo_api.model.Categories;
import com.vadosmik.checktogo_api.repository.CategoriesRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CategoriesController {
  private final CategoriesRepository repository;

  CategoriesController(CategoriesRepository repository) {
    this.repository = repository;
  }

  private void validateOwner(Categories category, Long userId) {
    if (userId == null || !category.getUserId().equals(userId)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Brak dostępu do tej kategorii!");
    }
  }

  @GetMapping("/categories")
  List<Categories> getCategories(@RequestParam(required = false) Long userId) {
    if (userId != null) {
      return repository.findByUserId(userId);
    }
    return List.of();
  }

  @GetMapping("/categorie/{id}")
  Categories getCategorie(@PathVariable Long id, @RequestParam Long userId) {
    Categories category = repository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

    validateOwner(category, userId);
    return category;
  }

  @PostMapping("/categorie")
  Categories saveCategorie(@RequestBody Categories newCategories) {
    return repository.save(newCategories);
  }

  @PutMapping("/categorie/{id}")
  Categories updateCategorie(@RequestBody Categories newCategorie, @PathVariable Long id, @RequestParam Long userId) {
    return repository.findById(id)
        .map(categorie -> {
          validateOwner(categorie, userId);

          if (newCategorie.getTitle() != null) {
            categorie.setTitle(newCategorie.getTitle());
          }
          return repository.save(categorie);
        })
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
  }

  @DeleteMapping("/categorie/{id}")
  ResponseEntity<?> deleteCategorie(@PathVariable Long id, @RequestParam Long userId) {
    return repository.findById(id)
        .map(categorie -> {
          validateOwner(categorie, userId);

          repository.delete(categorie);
          return ResponseEntity.ok().build();
        })
        .orElse(ResponseEntity.notFound().build());
  }
}