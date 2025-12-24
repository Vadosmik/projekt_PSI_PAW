package com.vadosmik.checktogo_api.controller;

import com.vadosmik.checktogo_api.model.Items;
import com.vadosmik.checktogo_api.model.Trips;
import com.vadosmik.checktogo_api.repository.ItemsRepository;
import com.vadosmik.checktogo_api.repository.TripsRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ItemsController {
  private final ItemsRepository repository;
  private final TripsRepository tripsRepository;

  ItemsController(ItemsRepository repository, TripsRepository tripsRepository) {
    this.repository = repository;
    this.tripsRepository = tripsRepository;
  }

  private void validateTripOwnership(Long tripId, Long userId) {
    Trips trip = tripsRepository.findById(tripId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Wycieczka nie istnieje"));

    if (!trip.getAuthorId().equals(userId)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Nie masz uprawnień do tej wycieczki!");
    }
  }

  @GetMapping("/items")
  List<Items> getItems(@RequestParam Long tripId, @RequestParam Long userId) {
    validateTripOwnership(tripId, userId);

    return repository.findByTripId(tripId);
  }

  @PostMapping("/item")
  Items saveItem(@RequestBody Items newItem, @RequestParam Long userId) {
    validateTripOwnership(newItem.getTripId(), userId);
    return repository.save(newItem);
  }

  @PutMapping("/item/{id}")
  Items updateItem(@RequestBody Items newItem, @PathVariable Long id, @RequestParam Long userId) {
    return repository.findById(id)
        .map(item -> {
          validateTripOwnership(item.getTripId(), userId);

          if (newItem.getTitle() != null) item.setTitle(newItem.getTitle());
          if (newItem.getIsPacked() != null) item.setIsPacked(newItem.getIsPacked());
          if (newItem.getCategoryId() != null) item.setCategoryId(newItem.getCategoryId());

          return repository.save(item);
        })
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
  }

  @DeleteMapping("/item/{id}")
  ResponseEntity<?> deleteItem(@PathVariable Long id, @RequestParam Long userId) {
    return repository.findById(id)
        .map(item -> {
          validateTripOwnership(item.getTripId(), userId);

          repository.delete(item);
          return ResponseEntity.ok().build();
        })
        .orElse(ResponseEntity.notFound().build());
  }
}