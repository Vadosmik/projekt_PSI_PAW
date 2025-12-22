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

  @GetMapping("/categories")
  List<Categories> getCategories() {
    return repository.findAll();
  }

  @GetMapping("/categorie/{id}")
  Categories getCategorie(@PathVariable Long id) {
    return repository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
  }

  @PostMapping("/categorie")
  Categories saveCategorie(@RequestBody Categories newCategories) {
    return repository.save(newCategories);
  }

  @PutMapping("/categorie/{id}")
  Categories updateCategorie(@RequestBody Categories newCategorie, @PathVariable Long id) {
    return repository.findById(id)
        .map(categorie -> {
          if (newCategorie.getTitle() != null) { categorie.setTitle(newCategorie.getTitle()); }
          if (newCategorie.getUserId() != null) { categorie.setUserId(newCategorie.getUserId()); }

          return repository.save(categorie);
        })
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
  }

  @DeleteMapping("/categorie/{id}")
  ResponseEntity<?> deleteCategorie(@PathVariable Long id) {
    if (!repository.existsById(id)) {
      return ResponseEntity.notFound().build();
    }
    repository.deleteById(id);
    return ResponseEntity.ok().build();
  }
}
