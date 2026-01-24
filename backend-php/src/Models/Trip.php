<?php
class Trip {
    public $id;
    public $authorId;
    public $title;
    public $description;
    public $departureDate;
    public $isVisited;

    public function __construct($data) {
        $this->id = $data['id'] ?? null;
        $this->authorId = $data['author_id'] ?? null;
        $this->title = $data['title'] ?? null;
        $this->description = $data['description'] ?? null;
        $this->departureDate = $data['departure_date'] ?? null;

        $this->isVisited = isset($data['is_visited']) ? (bool)$data['is_visited'] : false;
    }
}