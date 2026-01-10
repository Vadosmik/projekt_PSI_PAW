<?php
require_once __DIR__ . '/../Repositories/ItemRepository.php';
require_once __DIR__ . '/../Repositories/TripRepository.php';

class ItemController
{
  private $itemRepo;
  private $userId;

  public function __construct($db, $userId)
  {
    $this->itemRepo = new ItemRepository($db);
    $this->userId = $userId;
  }

  public function processRequest($method, $id, $input)
  {
    $tripId = $_GET['tripId'] ?? $input['tripId'] ?? null;

    switch ($method) {
      case 'GET':
        if (!$tripId || !$this->userId) {
          echo json_encode([]);
          return;
        }
        $response = $this->itemRepo->findByTripId($tripId, $this->userId);
        echo json_encode($response);
        break;

      case 'POST':
        $newId = $this->itemRepo->create($input);
        echo json_encode(["id" => $newId]);
        break;

      case 'PUT':
        $this->itemRepo->update($id, $input);
        echo json_encode(["message" => "Item updated"]);
        break;

      case 'DELETE':
        $this->itemRepo->delete($id);
        echo json_encode(["message" => "Item deleted"]);
        break;
    }
  }
}