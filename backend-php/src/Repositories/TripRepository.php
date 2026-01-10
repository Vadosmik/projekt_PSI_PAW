<?php
require_once __DIR__ . '/../Models/Trip.php';

class TripRepository {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function findAllByUserId($userId) {
        $stmt = $this->db->prepare("SELECT * FROM trips WHERE author_id = :userId ORDER BY departure_date ASC");
        $stmt->execute(['userId' => $userId]);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return array_map(fn($row) => new Trip($row), $results);
    }

    public function findById($id, $userId) {
        $stmt = $this->db->prepare("SELECT * FROM trips WHERE id = :id AND author_id = :userId");
        $stmt->execute(['id' => $id, 'userId' => $userId]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        
        return $data ? new Trip($data) : null;
    }

    // Tworzenie
    public function create($authorId, $data) {
        $stmt = $this->db->prepare("INSERT INTO trips (author_id, title, description, departure_date, is_visited) 
                                    VALUES (:aid, :title, :desc, :date, :visited) RETURNING id");
        $stmt->execute([
            'aid'     => $authorId,
            'title'   => $data['title'],
            'desc'    => $data['description'] ?? null,
            'date'    => $data['departureDate'] ?? null,
            'visited' => isset($data['isVisited']) && $data['isVisited'] ? 1 : 0
        ]);
        return $stmt->fetchColumn();
    }

    // Update
    public function update($id, $data) {
        $stmt = $this->db->prepare("UPDATE trips SET 
            title = :title, 
            description = :desc, 
            departure_date = :date, 
            is_visited = :visited 
            WHERE id = :id");
        
        return $stmt->execute([
            'title'   => $data['title'],
            'desc'    => $data['description'] ?? null,
            'date'    => $data['departureDate'] ?? null,
            'visited' => isset($data['isVisited']) && $data['isVisited'] ? 1 : 0,
            'id'      => $id
        ]);
    }

    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM trips WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }
}