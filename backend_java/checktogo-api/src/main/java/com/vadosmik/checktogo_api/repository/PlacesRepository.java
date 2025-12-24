package com.vadosmik.checktogo_api.repository;

import com.vadosmik.checktogo_api.model.Places;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlacesRepository extends JpaRepository<Places, Long> {
  List<Places> findByTripId(Long tripId);
}