package com.vadosmik.checktogo_api.repository;

import com.vadosmik.checktogo_api.model.Categories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriesRepository extends JpaRepository<Categories, Long> {
}