<?php
require_once __DIR__ . '/../Models/Category.php';

class CategoryRepository
{
  private $db;

  public function __construct($db)
  {
    $this->db = $db;
  }

  public function findAllByUserId($userId)
  {
    $stmt = $this->db->prepare("SELECT * FROM categories WHERE user_id = :userId");
    $stmt->execute(['userId' => $userId]);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    return array_map(fn($row) => new Category($row), $results);
  }

  public function create($userId, $title)
  {
    $stmt = $this->db->prepare("INSERT INTO categories (user_id, title) VALUES (:uid, :title) RETURNING id");
    $stmt->execute(['uid' => $userId, 'title' => $title]);
    return $stmt->fetchColumn();
  }

  public function delete($id)
  {
    $stmt = $this->db->prepare("DELETE FROM categories WHERE id = :id");
    return $stmt->execute(['id' => $id]);
  }
}