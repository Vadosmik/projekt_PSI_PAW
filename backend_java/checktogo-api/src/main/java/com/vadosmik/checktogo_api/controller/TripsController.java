package com.vadosmik.checktogo_api.controller;

import com.vadosmik.checktogo_api.model.Trips;
import com.vadosmik.checktogo_api.repository.TripsRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api")
public class TripsController {
  private final TripsRepository reposity;

  TripsController(TripsRepository reposity) {
    this.reposity = reposity;
  }

  private void validateOwner(Trips trip, Long userId) {
    if (userId == null || !trip.getAuthorId().equals(userId)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Brak dostępu do tej wycieczki!");
    }
  }

  @GetMapping("/trips")
  List<Trips> getTrips(@RequestParam(required = false) Long userId) {
    if (userId != null) {
      return reposity.findByAuthorId(userId);
    }
    return List.of();
  }

  @GetMapping("/trip/{id}")
  Trips getTrip(@PathVariable Long id, @RequestParam Long userId) {
    Trips trip = reposity.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

    validateOwner(trip, userId);
    return trip;
  }

  @PostMapping("/trip")
  Trips saveTrip(@RequestBody Trips newTrip) {
    return reposity.save(newTrip);
  }

  @PutMapping("/trip/{id}")
  Trips updateTrip(@RequestBody Trips newTrip, @PathVariable Long id, @RequestParam Long userId) {
    return reposity.findById(id)
        .map(trip -> {
          validateOwner(trip, userId);

          if (newTrip.getTitle() != null) trip.setTitle(newTrip.getTitle());
          if (newTrip.getDescription() != null) trip.setDescription(newTrip.getDescription());
          if (newTrip.getDepartureDate() != null) trip.setDepartureDate(newTrip.getDepartureDate());
          if (newTrip.getIsVisited() != null) trip.setIsVisited(newTrip.getIsVisited());

          return reposity.save(trip);
        })
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
  }

  @DeleteMapping("/trip/{id}")
  ResponseEntity<?> deleteTrip(@PathVariable Long id, @RequestParam Long userId) {
    return reposity.findById(id)
        .map(trip -> {
          validateOwner(trip, userId);

          reposity.delete(trip);
          return ResponseEntity.ok().build();
        })
        .orElse(ResponseEntity.notFound().build());
  }
}