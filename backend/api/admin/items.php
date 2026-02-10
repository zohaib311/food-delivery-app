<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../controller/UsersController.php';

// Helper to read bearer token
function getBearerToken() {
    $headers = null;
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $headers = trim($_SERVER['HTTP_AUTHORIZATION']);
    } elseif (function_exists('apache_request_headers')) {
        $requestHeaders = apache_request_headers();
        if (isset($requestHeaders['Authorization'])) {
            $headers = trim($requestHeaders['Authorization']);
        }
    }
    if ($headers && preg_match('/Bearer\s+(\S+)/', $headers, $matches)) {
        return $matches[1];
    }
    return null;
}

$usersController = new UsersController();

// Verify admin access
$token = getBearerToken();
$user = $usersController->findByToken($token);
if (!$user || $user['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$action = isset($_GET['action']) ? $_GET['action'] : null;
$db = Database::getInstance()->getConnection();

switch ($action) {
    case 'list':
        $stmt = $db->prepare("SELECT * FROM items WHERE status = 1 ORDER BY created_at DESC");
        $stmt->execute();
        $result = $stmt->get_result();
        $items = [];
        while ($row = $result->fetch_assoc()) {
            $items[] = $row;
        }
        $stmt->close();
        echo json_encode(['success' => true, 'items' => $items]);
        break;

    case 'delete':
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid item ID']);
            break;
        }
        $stmt = $db->prepare("DELETE FROM items WHERE id = ?");
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Item deleted']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to delete item']);
        }
        $stmt->close();
        break;

    case 'update':
        $raw = file_get_contents('php://input');
        $payload = json_decode($raw, true);
        if (!is_array($payload) || empty($payload['id']) || empty($payload['name'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Missing required fields']);
            break;
        }
        $id = intval($payload['id']);
        $name = $payload['name'];
        $description = isset($payload['description']) ? $payload['description'] : '';
        $price = isset($payload['price']) ? floatval($payload['price']) : 0;
        $category = isset($payload['category']) ? $payload['category'] : 'uncategorized';
        $image = isset($payload['image']) ? $payload['image'] : null;

        $stmt = $db->prepare("UPDATE items SET name = ?, description = ?, price = ?, category = ?, image = ? WHERE id = ?");
        $stmt->bind_param("ssdssi", $name, $description, $price, $category, $image, $id);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Item updated']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to update item']);
        }
        $stmt->close();
        break;

    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Unknown action']);
}
