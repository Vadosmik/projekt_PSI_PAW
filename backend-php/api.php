<?php

require './config/database.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

$url = trim($_SERVER['REQUEST_URI'], '/');
$path = parse_url($url, PHP_URL_PATH);
$parts = explode('/', $path);

$method = $_SERVER['REQUEST_METHOD'];
$resource = $parts[1] ?? '';
$id = $parts[2] ?? null;

$userId = $_GET['userId'] ?? null;
$tripId = $_GET['tripId'] ?? null;

$input = json_decode(file_get_contents('php://input'), true);

// Funkcja pomocnicza do mapowania pól z snake_case na camelCase (pod front Javy)
function mapToJavaFormat($data)
{
  if (empty($data))
    return $data;
  $mapRow = function ($row) {
    $mapping = [
      'created_at' => 'createdAt',
      'author_id' => 'authorId',
      'departure_date' => 'departureDate',
      'is_visited' => 'isVisited',
      'is_packed' => 'isPacked',
      'trip_id' => 'tripId',
      'category_id' => 'categoryId'
    ];
    foreach ($mapping as $dbKey => $javaKey) {
      if (isset($row[$dbKey])) {
        $row[$javaKey] = $row[$dbKey];
        unset($row[$dbKey]);
      }
    }
    unset($row['password_hash']);
    return $row;
  };
  return (isset($data[0]) && is_array($data[0])) ? array_map($mapRow, $data) : $mapRow($data);
}

switch ($resource) {

  case 'trips':
    if ($method === 'GET') {
      $trips = fetchData('trips', ['author_id' => $userId]);
      echo json_encode(mapToJavaFormat($trips));
    }
    break;

  case 'trip':
    switch ($method) {

      case 'GET':
        $trip = fetchData('trips', ['author_id' => $userId, 'id' => $id]);
        echo json_encode(mapToJavaFormat($trip[0] ?? null));
        break;

      case 'POST':
        $isVisited = isset($input['isVisited']) ? (bool) $input['isVisited'] : false;
        $data = [
          'author_id' => $userId,
          'title' => $input['title'],
          'description' => $input['description'] ?? null,
          'departure_date' => $input['departureDate'] ?? null,
          'is_visited' => $isVisited
        ];
        $newId = insertData('trips', $data);
        echo json_encode(["id" => $newId]);
        break;

      case 'PUT':
        $updateData = [
          'title' => $input['title'],
          'description' => $input['description'] ?? null,
          'departure_date' => $input['departureDate'] ?? null,
          'is_visited' => isset($input['isVisited']) ? (bool) $input['isVisited'] : false
        ];
        updateData('trips', $updateData, ['id' => $id]);
        echo json_encode(["message" => "Trip updated"]);
        break;

      case 'DELETE':
        deleteData('trips', ['id' => $id]);
        echo json_encode(["message" => "Deleted"]);
        break;
    }
    break;

  case 'categories':
  case 'categorie':
    if ($method === 'GET') {
      $categories = fetchData('categories', ['user_id' => $userId]);
      echo json_encode($categories);
    } elseif ($method === 'POST') {
      $finalUserId = $userId ?? $input['userId'] ?? $input['authorId'];
      $newId = insertData('categories', ['user_id' => $finalUserId, 'title' => $input['title']]);
      echo json_encode(["id" => $newId]);
    }
    break;

  case 'items':
  case 'item':
    if ($method === 'GET') {
      $checkTrip = fetchData('trips', [
        'id' => $tripId,
        'author_id' => $userId
      ]);

      if (empty($checkTrip)) {
        http_response_code(403);
        echo json_encode(["error" => "Brak dostępu do tej wycieczki"]);
        break;
      }

      $items = fetchData('items', ['trip_id' => $tripId]);

      echo json_encode(mapToJavaFormat($items));
    } elseif ($method === 'POST') {
      $newId = insertData('items', [
        'trip_id' => $input['tripId'] ?? $input['trip_id'],
        'category_id' => $input['categoryId'] ?? $input['category_id'],
        'title' => $input['title'],
        'is_packed' => false
      ]);
      echo json_encode(["id" => $newId]);
    } elseif ($method === 'PUT') {
      $updateData = [
        'title' => $input['title'],
        'is_packed' => isset($input['isPacked']) ? (bool) $input['isPacked'] : false
      ];
      updateData('items', $updateData, ['id' => $id]);
      echo json_encode(["message" => "Item updated"]);
    } elseif ($method === 'DELETE') {
      deleteData('items', ['id' => $id]);
      echo json_encode(["message" => "Item deleted"]);
      break;
    }
    break;

  case 'places':
    if ($method === 'GET') {
      $targetTripId = $id ?? $tripId;

      if (!$targetTripId || !$userId) {
        echo json_encode([]);
        break;
      }

      $db = (new Database())->getConnection();
      $query = "SELECT p.* FROM placestovisit p 
                JOIN trips t ON p.trip_id = t.id 
                WHERE p.trip_id = :tripId AND t.author_id = :userId";

      $stmt = $db->prepare($query);
      $stmt->bindValue(':tripId', $targetTripId);
      $stmt->bindValue(':userId', $userId);
      $stmt->execute();
      $places = $stmt->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode(mapToJavaFormat($places));
    }
    break;
  case 'place':
    switch ($method) {
      case 'POST':
        $isVisited = isset($input['isVisited']) ? (bool) $input['isVisited'] : false;

        $newId = insertData('placestovisit', [
          'trip_id' => $input['tripId'],
          'title' => $input['title'],
          'description' => $input['description'] ?? null,
          'img' => $input['img'] ?? null,
          'is_visited' => $isVisited
        ]);
        echo json_encode(["id" => $newId]);
        break;

      case 'PUT':
        $updateData = [
          'title' => $input['title'],
          'description' => $input['description'] ?? null,
          'is_visited' => isset($input['isVisited']) ? (bool) $input['isVisited'] : false
        ];
        updateData('placestovisit', $updateData, ['id' => $id]);
        echo json_encode(["message" => "Place updated"]);
        break;

      case 'DELETE':
        deleteData('placestovisit', ['id' => $id]);
        echo json_encode(["message" => "Place deleted"]);
        break;
    }
    break;

  case 'users':
    if ($method === 'GET') {
      $users = fetchData('users');
      echo json_encode(mapToJavaFormat($users));
    }
    break;

  case 'user':
    if ($method === 'POST') {
      $data = [
        'username' => $input['username'],
        'email' => $input['email'],
        'password_hash' => password_hash($input['password'], PASSWORD_DEFAULT),
        'created_at' => date('Y-m-d H:i:s')
      ];
      $newId = insertData('users', $data);
      echo json_encode(["id" => $newId]);
    }
    break;

  case 'login':
    if ($method === 'POST') {
      $userResult = fetchData('users', ['username' => $input['username']]);
      if ($userResult && password_verify($input['password'], $userResult[0]['password_hash'])) {
        echo json_encode(mapToJavaFormat($userResult[0]));
      } else {
        http_response_code(401);
        echo json_encode(["message" => "Unauthorized"]);
      }
    }
    break;

  default:
    http_response_code(404);
    break;
}