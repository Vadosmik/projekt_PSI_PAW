package com.vadosmik.checktogo_api.repository;

import com.vadosmik.checktogo_api.model.Items;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemsRepository extends JpaRepository<Items, Long> {
}