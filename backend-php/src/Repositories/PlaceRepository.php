<?php
require_once __DIR__ . '/../Models/Place.php';

class PlaceRepository
{
  private $db;

  public function __construct($db)
  {
    $this->db = $db;
  }

  public function findByTripId($tripId, $userId)
  {
    $query = "SELECT p.* FROM placestovisit p 
                  JOIN trips t ON p.trip_id = t.id 
                  WHERE p.trip_id = :tripId AND t.author_id = :userId";

    $stmt = $this->db->prepare($query);
    $stmt->execute(['tripId' => $tripId, 'userId' => $userId]);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    return array_map(fn($row) => new Place($row), $results);
  }

  public function create($data)
  {
    $stmt = $this->db->prepare("INSERT INTO placestovisit (trip_id, title, description, img, is_visited) 
                                    VALUES (:tid, :title, :desc, :img, :visited) RETURNING id");
    $stmt->execute([
      'tid' => $data['tripId'],
      'title' => $data['title'],
      'desc' => $data['description'] ?? null,
      'img' => $data['img'] ?? null,
      'visited' => isset($data['isVisited']) && $data['isVisited'] ? 1 : 0
    ]);
    return $stmt->fetchColumn();
  }

  public function update($id, $data)
  {
    $stmt = $this->db->prepare("UPDATE placestovisit SET 
            title = :title, 
            description = :desc, 
            is_visited = :visited 
            WHERE id = :id");

    return $stmt->execute([
      'title' => $data['title'],
      'desc' => $data['description'] ?? null,
      'visited' => isset($data['isVisited']) && $data['isVisited'] ? 1 : 0,
      'id' => $id
    ]);
  }

  public function delete($id)
  {
    $stmt = $this->db->prepare("DELETE FROM placestovisit WHERE id = :id");
    return $stmt->execute(['id' => $id]);
  }
}