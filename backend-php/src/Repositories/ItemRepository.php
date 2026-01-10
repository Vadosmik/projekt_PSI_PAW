<?php
require_once __DIR__ . '/../Models/Item.php';

class ItemRepository
{
  private $db;

  public function __construct($db)
  {
    $this->db = $db;
  }

  public function findByTripId($tripId, $userId)
  {
    $query = "SELECT i.* FROM items i 
                  JOIN trips t ON i.trip_id = t.id 
                  WHERE i.trip_id = :tripId AND t.author_id = :userId ORDER BY i.id ASC";

    $stmt = $this->db->prepare($query);
    $stmt->execute(['tripId' => $tripId, 'userId' => $userId]);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    return array_map(fn($row) => new Item($row), $results);
  }

  public function create($data)
  {
    $stmt = $this->db->prepare("INSERT INTO items (trip_id, category_id, title, is_packed) 
                                    VALUES (:tid, :cid, :title, :packed) RETURNING id");
    $stmt->execute([
      'tid' => $data['tripId'] ?? $data['trip_id'],
      'cid' => $data['categoryId'] ?? $data['category_id'],
      'title' => $data['title'],
      'packed' => isset($data['isPacked']) && $data['isPacked'] ? 1 : 0
    ]);
    return $stmt->fetchColumn();
  }

  public function update($id, $data)
  {
    $stmt = $this->db->prepare("UPDATE items SET 
            title = :title, 
            is_packed = :packed 
            WHERE id = :id");

    return $stmt->execute([
      'title' => $data['title'],
      'packed' => isset($data['isPacked']) && $data['isPacked'] ? 1 : 0,
      'id' => $id
    ]);
  }

  public function delete($id)
  {
    $stmt = $this->db->prepare("DELETE FROM items WHERE id = :id");
    return $stmt->execute(['id' => $id]);
  }
}