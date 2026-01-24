<?php
ob_start();

$allowed_origins = [
    "http://localhost:5173",
    "http://m-air.local:5173"
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

// 1. NAGŁÓWKI CORS
if (in_array($origin, $allowed_origins)) {
  header("Access-Control-Allow-Origin: " . $origin);
}
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

// Obsługa zapytania PREFLIGHT
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

// 2. Raportowanie błędów
error_reporting(E_ALL);
ini_set('display_errors', 1);

// 3. Ładowanie plików
require_once './config/database.php';
require_once './src/Controllers/TripController.php';
require_once './src/Controllers/ItemController.php';
require_once './src/Controllers/PlaceController.php';
require_once './src/Controllers/CategoryController.php';
require_once './src/Controllers/UserController.php';

// 4. Parsowanie URL i Dane
$url = trim($_SERVER['REQUEST_URI'], '/');
$path = parse_url($url, PHP_URL_PATH);
$parts = explode('/', $path);

$resource = $parts[1] ?? ''; // np. 'trips'
$id = $parts[2] ?? null;     // np. '4'
$method = $_SERVER['REQUEST_METHOD'];

// 5. Pobranie danych wejściowych
$userId = $_GET['userId'] ?? null;
$input = json_decode(file_get_contents('php://input'), true);

// 6. Połączenie i Router
$database = new Database();
$db = $database->getConnection();

// 7. Router
switch ($resource) {
  case 'trips':
  case 'trip':
    $controller = new TripController($db, $userId);
    $controller->processRequest($method, $id, $input);
    break;

  case 'items':
  case 'item':
    $controller = new ItemController($db, $userId);
    $controller->processRequest($method, $id, $input);
    break;

  case 'places':
  case 'place':
    $controller = new PlaceController($db, $userId);
    $controller->processRequest($method, $id, $input);
    break;

  case 'categories':
  case 'categorie':
    $controller = new CategoryController($db, $userId);
    $controller->processRequest($method, $id, $input);
    break;

  case 'users':
  case 'user':
  case 'login':
    $controller = new UserController($db);
    $controller->processRequest($method, $resource, $input, $id);
    break;

  default:
    http_response_code(404);
    echo json_encode(["error" => "Resource not found"]);
    break;
}