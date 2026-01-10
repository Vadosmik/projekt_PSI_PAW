<?php
class User {
    public $id;
    public $username;
    public $email;
    public $createdAt;

    public function __construct($data) {
        $this->id = $data['id'] ?? null;
        $this->username = $data['username'] ?? null;
        $this->email = $data['email'] ?? null;
        $this->createdAt = $data['created_at'] ?? null;
    }
}