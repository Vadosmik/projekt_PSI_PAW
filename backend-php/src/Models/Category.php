<?php
class Category {
    public $id;
    public $userId;
    public $title;

    public function __construct($data) {
        $this->id = $data['id'] ?? null;
        $this->userId = $data['user_id'] ?? null;
        $this->title = $data['title'] ?? null;
    }
}