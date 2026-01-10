<?php
require_once __DIR__ . '/../Models/User.php';

class UserRepository {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    // Potrzebne do logowania - zwraca surową tablicę z hasłem (hash)
    public function findRawByUsername($username) {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE username = :username");
        $stmt->execute(['username' => $username]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Rejestracja
    public function create($username, $email, $password) {
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $this->db->prepare("INSERT INTO users (username, email, password_hash, created_at) VALUES (:u, :e, :p, NOW()) RETURNING id");
        $stmt->execute([
            'u' => $username,
            'e' => $email,
            'p' => $hash
        ]);
        return $stmt->fetchColumn();
    }
    
    public function findAll() {
        $stmt = $this->db->query("SELECT * FROM users");
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return array_map(fn($row) => new User($row), $results);
    }
}