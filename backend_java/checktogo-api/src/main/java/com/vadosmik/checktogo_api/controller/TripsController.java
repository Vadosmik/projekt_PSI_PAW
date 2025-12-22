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

  @GetMapping("/trips")
  List<Trips> getTrips() {
    return reposity.findAll();
  }

  @GetMapping("/trip/{id}")
  Trips getTrip(@PathVariable Long id) {
    return reposity.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
  }

  @PostMapping("/trip")
  Trips saveTrip(@RequestBody Trips newTrip) {
    return reposity.save(newTrip);
  }

  @PutMapping("/trip/{id}")
  Trips updateTrip(@RequestBody Trips newTrip, @PathVariable Long id) {
    return reposity.findById(id)
        .map(trip -> {
          if (newTrip.getTitle() != null) trip.setTitle(newTrip.getTitle());
          if (newTrip.getDescription() != null) trip.setDescription(newTrip.getDescription());
          if (newTrip.getDepartureDate() != null) trip.setDepartureDate(newTrip.getDepartureDate());
          if (newTrip.getIsVisited() != null) trip.setIsVisited(newTrip.getIsVisited());

          return reposity.save(trip);
        })
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
  }

  @DeleteMapping("/trip/{id}")
  ResponseEntity<?> deleteTrip(@PathVariable Long id) {
    if (!reposity.existsById(id)) {
      return ResponseEntity.notFound().build();
    }
    reposity.deleteById(id);
    return ResponseEntity.ok().build();
  }
}
