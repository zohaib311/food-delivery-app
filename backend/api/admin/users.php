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

    case 'update':
        $data = json_decode(file_get_contents('php://input'), true);
        $id = isset($data['id']) ? intval($data['id']) : 0;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid user ID']);
            break;
        }

        // Prepare update fields
        $name = $data['name'] ?? null;
        $email = $data['email'] ?? null;
        $phone = $data['phone'] ?? null;
        $password = $data['password'] ?? null;
        $role = $data['role'] ?? null;
        $status = $data['status'] ?? null;

        // Build dynamic update query
        $updates = [];
        $types = '';
        $params = [];

        if ($name !== null) {
            $updates[] = "name = ?";
            $types .= 's';
            $params[] = $name;
        }
        if ($email !== null) {
            $updates[] = "email = ?";
            $types .= 's';
            $params[] = $email;
        }
        if ($phone !== null) {
            $updates[] = "phone = ?";
            $types .= 's';
            $params[] = $phone;
        }
        if ($password !== null && !empty($password)) {
            $passwordHash = password_hash($password, PASSWORD_DEFAULT);
            $updates[] = "password = ?";
            $types .= 's';
            $params[] = $passwordHash;
        }
        if ($role !== null) {
            $updates[] = "role = ?";
            $types .= 's';
            $params[] = $role;
        }
        if ($status !== null) {
            $updates[] = "status = ?";
            $types .= 'i';
            $params[] = intval($status);
        }

        if (empty($updates)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'No fields to update']);
            break;
        }

        $params[] = $id;
        $types .= 'i';

        $db = Database::getInstance()->getConnection();
        $query = "UPDATE users SET " . implode(', ', $updates) . " WHERE id = ?";
        $stmt = $db->prepare($query);
        
        if (!$stmt) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Database error']);
            break;
        }

        $stmt->bind_param($types, ...$params);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'User updated successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to update user']);
        }
        $stmt->close();
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
