package com.vadosmik.checktogo_api.controller;

import com.vadosmik.checktogo_api.model.Places;
import com.vadosmik.checktogo_api.model.Trips;
import com.vadosmik.checktogo_api.repository.PlacesRepository;
import com.vadosmik.checktogo_api.repository.TripsRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PlacesController {
  private final PlacesRepository repository;
  private final TripsRepository tripsRepository;

  PlacesController(PlacesRepository repository, TripsRepository tripsRepository) {
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

  @GetMapping("/places")
  List<Places> getPlaces(@RequestParam Long tripId, @RequestParam Long userId) {
    validateTripOwnership(tripId, userId);
    return repository.findByTripId(tripId);
  }

  @GetMapping("/place/{id}")
  Places getPlace(@PathVariable Long id, @RequestParam Long userId) {
    Places place = repository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

    validateTripOwnership(place.getTripId(), userId);
    return place;
  }

  @PostMapping("/place")
  Places savePlace(@RequestBody Places newPlace, @RequestParam Long userId) {
    validateTripOwnership(newPlace.getTripId(), userId);
    return repository.save(newPlace);
  }

  @PutMapping("/place/{id}")
  Places updatePlace(@RequestBody Places newPlace, @PathVariable Long id, @RequestParam Long userId) {
    return repository.findById(id)
        .map(place -> {
          validateTripOwnership(place.getTripId(), userId);

          if (newPlace.getTitle() != null) place.setTitle(newPlace.getTitle());
          if (newPlace.getImg() != null) place.setImg(newPlace.getImg());
          if (newPlace.getDescription() != null) place.setDescription(newPlace.getDescription());
          if (newPlace.getIsVisited() != null) place.setIsVisited(newPlace.getIsVisited());

          return repository.save(place);
        })
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
  }

  @DeleteMapping("/place/{id}")
  ResponseEntity<?> deletePlace(@PathVariable Long id, @RequestParam Long userId) {
    return repository.findById(id)
        .map(place -> {
          validateTripOwnership(place.getTripId(), userId);
          repository.delete(place);
          return ResponseEntity.ok().build();
        })
        .orElse(ResponseEntity.notFound().build());
  }
}