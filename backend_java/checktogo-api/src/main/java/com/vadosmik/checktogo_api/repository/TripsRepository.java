package com.vadosmik.checktogo_api.repository;

import com.vadosmik.checktogo_api.model.Trips;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TripsRepository extends JpaRepository<Trips, Long> {
  List<Trips> findByAuthorId(Long authorId);
}