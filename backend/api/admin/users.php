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
require_once __DIR__ . '/UsersController.php';

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

$controller = new UsersController();

// Verify admin access
$token = getBearerToken();
$user = $controller->findByToken($token);
if (!$user || $user['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$action = isset($_GET['action']) ? $_GET['action'] : null;

switch ($action) {
    case 'list':
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("SELECT id, name, email, phone, role, status, created_at FROM users ORDER BY created_at DESC");
        $stmt->execute();
        $result = $stmt->get_result();
        $users = [];
        while ($row = $result->fetch_assoc()) {
            $users[] = $row;
        }
        $stmt->close();
        echo json_encode(['success' => true, 'users' => $users]);
        break;

    case 'delete':
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        if (!$id || $id === $user['id']) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid action']);
            break;
        }
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("DELETE FROM users WHERE id = ?");
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'User deleted']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to delete user']);
        }
        $stmt->close();
        break;

    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Unknown action']);
}
