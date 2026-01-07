<?php

require './config/database.php';

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Content-Type: application/json; charset=UTF-8");

// Pobieramy URI i czyścimy go ze zbędnych ukośników
$url = trim($_SERVER['REQUEST_URI'], '/');
$path = parse_url($url, PHP_URL_PATH);
$parts = explode('/', $path);

$method = $_SERVER['REQUEST_METHOD'];
$resource = $parts[1] ?? '';
$id = $parts[2] ?? null;

// $userId = $_GET['userId'] ?? null;
// $tripId = $_GET['tripId'] ?? null;

$userId = 1; //userId dla testów
$tripId = 1; //tripId dla testów

// if (!$userId) {
//    http_response_code(400);
// }

switch ($resource) {
  // GET /api/trips?userId=X
  case 'trips':
    if ($method === 'GET') {
      $trips = fetchData('trips', ['author_id' => $userId]);

      echo json_encode([
        "status" => "success",
        "userId" => $userId,
        "count" => count($trips),
        "data" => $trips
      ]);
    }
    break;
  case 'trip':
    switch ($method) {
      // GET /api/trip/{id}?userId=X
      case 'GET':
        $trip = fetchData('trips', ['author_id' => $userId, 'id' => $id]);
        echo json_encode([
          "status" => "success",
          "userId" => $userId,
          "data" => $trip
        ]);
        break;
      // POST /api/trip
      case 'POST':
        echo json_encode(["action" => "Dodawanie nowej wycieczki"]);
        break;

      // PUT /api/trip/{id}?userId=X
      case 'PUT':
        echo json_encode([
          "action" => "Aktualizacja wycieczki: $id",
          "authorized_by" => $userId
        ]);
        break;

      // DELETE /api/trip/{id}?userId=X
      case 'DELETE':
        echo json_encode([
          "action" => "Usuwanie wycieczki: $id",
          "authorized_by" => $userId
        ]);
        break;

      default:
        http_response_code(405);
        break;
    }
    break;

  case 'login':
    if ($method === 'POST') {
      echo json_encode(["message" => "Logowanie..."]);
    }
    break;

  default:
    http_response_code(404);
    echo json_encode(["message" => "Not Found: " . $resource]);
    break;
}

?>