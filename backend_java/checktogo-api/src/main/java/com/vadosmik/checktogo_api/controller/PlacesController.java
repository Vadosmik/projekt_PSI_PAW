package com.vadosmik.checktogo_api.controller;

import com.vadosmik.checktogo_api.model.Places;
import com.vadosmik.checktogo_api.repository.PlacesRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PlacesController {
  private final PlacesRepository repository;

  PlacesController(PlacesRepository repository) {
    this.repository = repository;
  }

  @GetMapping("/places")
  List<Places> getPlaces() {
    return repository.findAll();
  }

  @GetMapping("/place/{id}")
  Places getPlace(@PathVariable Long id) {
    return repository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
  }

  @PostMapping("/place")
  Places savePlace(@RequestBody Places newPlace) {
    return repository.save(newPlace);
  }

  @PutMapping("/place/{id}")
  Places updatePlace(@RequestBody Places newPlace, @PathVariable Long id) {
    return repository.findById(id)
        .map(place -> {
          if (newPlace.getTitle() != null) { place.setTitle(newPlace.getTitle()); }
          if (newPlace.getTripId() != null) { place.setTripId(newPlace.getTripId()); }
          if (newPlace.getImg() != null) { place.setImg(newPlace.getImg()); }
          if (newPlace.getDescription() != null) { place.setDescription(newPlace.getDescription()); }
          if (newPlace.getIsVisited() != null) { place.setIsVisited(newPlace.getIsVisited()); }

          return repository.save(place);
        })
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
  }

  @DeleteMapping("/place/{id}")
  ResponseEntity<?> deletePlace(@PathVariable Long id) {
    if (!repository.existsById(id)) {
      return ResponseEntity.notFound().build();
    }
    repository.deleteById(id);
    return ResponseEntity.ok().build();
  }
}
