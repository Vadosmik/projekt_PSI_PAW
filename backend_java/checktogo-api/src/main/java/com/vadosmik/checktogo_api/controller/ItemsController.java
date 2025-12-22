package com.vadosmik.checktogo_api.controller;

import com.vadosmik.checktogo_api.model.Items;
import com.vadosmik.checktogo_api.repository.ItemsRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ItemsController {
  private final ItemsRepository repository;

  ItemsController(ItemsRepository repository) {
    this.repository = repository;
  }

  @GetMapping("/items")
  List<Items> getItems() {
    return repository.findAll();
  }

  @GetMapping("/item/{id}")
  Items getItem(@PathVariable Long id) {
    return repository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
  }

  @PostMapping("/item")
  Items saveItem(@RequestBody Items newItem) {
    return repository.save(newItem);
  }

  @PutMapping("/item/{id}")
  Items updateItem(@RequestBody Items newItem, @PathVariable Long id) {
    return repository.findById(id)
        .map(item -> {
          if (newItem.getTitle() != null) { item.setTitle(newItem.getTitle()); }
          if (newItem.getTripId() != null) { item.setTripId(newItem.getTripId()); }
          if (newItem.getCategoryId() != null) { item.setCategoryId(newItem.getCategoryId()); }
          if (newItem.getIsPacked() != null) { item.setIsPacked(newItem.getIsPacked()); }

          return repository.save(item);
        })
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
  }

  @DeleteMapping("/item/{id}")
  ResponseEntity<?> deleteItem(@PathVariable Long id) {
    if (!repository.existsById(id)) {
      return ResponseEntity.notFound().build();
    }
    repository.deleteById(id);
    return ResponseEntity.ok().build();
  }
}
