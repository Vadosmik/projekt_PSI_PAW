<?php
require_once __DIR__ . '/../Repositories/UserRepository.php';

class UserController
{
  private $userRepo;

  public function __construct($db)
  {
    $this->userRepo = new UserRepository($db);
  }

  public function processRequest($method, $resource, $input, $id)
  {

    // LOGOWANIE
    if ($resource === 'login' && $method === 'POST') {
      $userData = $this->userRepo->findRawByUsername($input['username']);

      if ($userData && password_verify($input['password'], $userData['password_hash'])) {
        // Konwertujemy na bezpieczny model (bez hasła)
        $userModel = new User($userData);
        echo json_encode($userModel);
      } else {
        http_response_code(401);
        echo json_encode(["message" => "Unauthorized"]);
      }
      return;
    }

    // REJESTRACJA (/user POST)
    if (($resource === 'user' || $resource === 'users') && $method === 'POST') {
      $newId = $this->userRepo->create($input['username'], $input['email'], $input['password']);
      echo json_encode(["id" => $newId]);
      return;
    }

    // POBIERANIE LISTY UŻYTKOWNIKÓW (/users GET)
    if ($resource === 'users' && $method === 'GET') {
      $users = $this->userRepo->findAll();
      echo json_encode($users);
      return;
    }

    if (($resource === 'user' || $resource === 'users') && $method === 'DELETE') {
      if (!$id) {
        http_response_code(400);
        echo json_encode(["message" => "Missing User ID"]);
        return;
      }

      $success = $this->userRepo->delete($id);
      if ($success) {
        echo json_encode(["message" => "User deleted successfully"]);
      } else {
        http_response_code(500);
        echo json_encode(["message" => "Failed to delete user"]);
      }
      return;
    }
  }
}