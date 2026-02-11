<?php
require_once __DIR__ . '/../../headers/Headers.php';
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
    case 'add':
    $raw = file_get_contents('php://input');
    $payload = json_decode($raw, true);

    if (!is_array($payload)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid JSON',
            'received_raw' => $raw
        ]);
        break;
    }

    $name = trim($payload['name'] ?? '');
    $description = $payload['description'] ?? '';
    $price = floatval($payload['price'] ?? 0);
    $category = $payload['category'] ?? '';
    $image = $payload['image'] ?? '';

    if (empty($name)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Name is required']);
        break;
    }

    $stmt = $db->prepare("INSERT INTO items (name, description, price, category, image) VALUES (?, ?, ?, ?, ?)");

    if (!$stmt) {
        echo json_encode(['success' => false, 'db_prepare_error' => $db->error]);
        break;
    }

    $stmt->bind_param("ssdss", $name, $description, $price, $category, $image);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Item added']);
    } else {
        echo json_encode(['success' => false, 'db_error' => $stmt->error]);
    }

    $stmt->close();
    break;

    case 'list':
        $stmt = $db->prepare("SELECT * FROM items  ORDER BY created_at DESC");
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
        if (!is_array($payload) || empty(intval($payload['id'] ?? 0)) || empty(trim($payload['name'] ?? ''))) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Missing required fields',
                'received_raw' => $raw,
                'content_type' => isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : null
            ]);
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
            echo json_encode(['success' => false, 'message' => 'Failed to update item', 'db_error' => $stmt->error]);
        }
        $stmt->close();
        break;

    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Unknown action']);
}
