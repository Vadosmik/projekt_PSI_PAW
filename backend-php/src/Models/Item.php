<?php
class Item {
    public $id;
    public $tripId;
    public $categoryId;
    public $title;
    public $isPacked;

    public function __construct($data) {
        $this->id = $data['id'] ?? null;
        $this->tripId = $data['trip_id'] ?? null;
        $this->categoryId = $data['category_id'] ?? null;
        $this->title = $data['title'] ?? null;
        $this->isPacked = isset($data['is_packed']) ? (bool)$data['is_packed'] : false;
    }
}