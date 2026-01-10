<?php
require_once __DIR__ . '/../Repositories/TripRepository.php';

class TripController
{
  private $tripRepo;
  private $userId;

  public function __construct($db, $userId)
  {
    $this->tripRepo = new TripRepository($db);
    $this->userId = $userId;
  }

  public function processRequest($method, $id, $input)
  {
    switch ($method) {
      case 'GET':
        if ($id) {
          $response = $this->tripRepo->findById($id, $this->userId);
          echo json_encode($response);
        } else {
          $response = $this->tripRepo->findAllByUserId($this->userId);
          echo json_encode($response);
        }
        break;

      case 'POST':
        if (!$this->userId) {
          http_response_code(400);
          echo json_encode(["error" => "User ID required"]);
          return;
        }
        $newId = $this->tripRepo->create($this->userId, $input);
        echo json_encode(["id" => $newId]);
        break;

      case 'PUT':
        $this->tripRepo->update($id, $input);
        echo json_encode(["message" => "Trip updated"]);
        break;

      case 'DELETE':
        $this->tripRepo->delete($id);
        echo json_encode(["message" => "Trip deleted"]);
        break;

      default:
        http_response_code(405);
        break;
    }
  }
}