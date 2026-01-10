<?php
class Place {
    public $id;
    public $tripId;
    public $title;
    public $description;
    public $img;
    public $isVisited;

    public function __construct($data) {
        $this->id = $data['id'] ?? null;
        $this->tripId = $data['trip_id'] ?? null;
        $this->title = $data['title'] ?? null;
        $this->description = $data['description'] ?? null;
        $this->img = $data['img'] ?? null;
        $this->isVisited = isset($data['is_visited']) ? (bool)$data['is_visited'] : false;
    }
}