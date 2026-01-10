<?php
require_once __DIR__ . '/../Repositories/CategoryRepository.php';

class CategoryController
{
  private $catRepo;
  private $userId;

  public function __construct($db, $userId)
  {
    $this->catRepo = new CategoryRepository($db);
    $this->userId = $userId;
  }

  public function processRequest($method, $id, $input)
  {
    switch ($method) {
      case 'GET':
        $response = $this->catRepo->findAllByUserId($this->userId);
        echo json_encode($response);
        break;

      case 'POST':
        $targetUserId = $this->userId ?? $input['userId'] ?? $input['authorId'];
        if (!$targetUserId) {
          http_response_code(400);
          echo json_encode(["error" => "User ID required"]);
          return;
        }
        $newId = $this->catRepo->create($targetUserId, $input['title']);
        echo json_encode(["id" => $newId]);
        break;

      case 'DELETE':
        $this->catRepo->delete($id);
        echo json_encode(["message" => "Category deleted"]);
        break;
    }
  }
}