<?php
require_once __DIR__ . '/../Repositories/PlaceRepository.php';

class PlaceController
{
  private $placeRepo;
  private $userId;

  public function __construct($db, $userId)
  {
    $this->placeRepo = new PlaceRepository($db);
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
        $response = $this->placeRepo->findByTripId($tripId, $this->userId);
        echo json_encode($response);
        break;

      case 'POST':
        $newId = $this->placeRepo->create($input);
        echo json_encode(["id" => $newId]);
        break;

      case 'PUT':
        $this->placeRepo->update($id, $input);
        echo json_encode(["message" => "Place updated"]);
        break;

      case 'DELETE':
        $this->placeRepo->delete($id);
        echo json_encode(["message" => "Place deleted"]);
        break;
    }
  }
}