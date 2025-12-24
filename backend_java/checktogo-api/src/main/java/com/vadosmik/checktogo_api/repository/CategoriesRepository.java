package com.vadosmik.checktogo_api.repository;

import com.vadosmik.checktogo_api.model.Categories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoriesRepository extends JpaRepository<Categories, Long> {
  List<Categories> findByUserId(Long userId);
}