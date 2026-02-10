<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

require_once __DIR__ . '/api/controller/ItemsController.php';

$controller = new ItemsController();

$action = isset($_GET['action']) ? $_GET['action'] : 'list';

switch ($action) {
  case 'list':
    $items = $controller->list();
    echo json_encode(['success' => true, 'items' => $items]);
    break;

  case 'get':
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    if (!$id) {
      http_response_code(400);
      echo json_encode(['success' => false, 'message' => 'Missing id']);
      break;
    }
    $item = $controller->get($id);
    if ($item === null) {
      http_response_code(404);
      echo json_encode(['success' => false, 'message' => 'Item not found']);
      break;
    }
    echo json_encode(['success' => true, 'item' => $item]);
    break;

  case 'add':
    $raw = file_get_contents('php://input');
    $payload = json_decode($raw, true);
    if (!is_array($payload) || empty($payload['name'])) {
      http_response_code(400);
      echo json_encode(['success' => false, 'message' => 'Invalid payload']);
      break;
    }
    $new = $controller->add($payload);
    http_response_code(201);
    echo json_encode(['success' => true, 'item' => $new]);
    break;

  default:
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Unknown action']);
}

