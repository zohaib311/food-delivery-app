<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/controller/UsersController.php';

$controller = new UsersController();

$action = isset($_GET['action']) ? $_GET['action'] : null;

// helper to read bearer token
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

switch ($action) {
    case 'register':
        $raw = file_get_contents('php://input');
        $payload = json_decode($raw, true);
        if (!is_array($payload) || empty($payload['email']) || empty($payload['password']) || empty($payload['name'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Missing fields']);
            break;
        }
        $role = isset($payload['role']) ? $payload['role'] : 'customer';
        $phone = isset($payload['phone']) ? $payload['phone'] : null;
        $user = $controller->addUser($payload['name'], $payload['email'], $payload['password'], $phone, $role);
        if ($user === null) {
            http_response_code(409);
            echo json_encode(['success' => false, 'message' => 'Email already exists']);
            break;
        }
        unset($user['password']);
        echo json_encode(['success' => true, 'user' => $user]);
        break;

    case 'login':
        $raw = file_get_contents('php://input');
        $payload = json_decode($raw, true);
        if (!is_array($payload) || empty($payload['email']) || empty($payload['password'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Missing fields']);
            break;
        }
        $user = $controller->verifyPassword($payload['email'], $payload['password']);
        if (!$user) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
            break;
        }
        $token = bin2hex(random_bytes(16));
        $controller->setToken($user['id'], $token);
        $user = $controller->getById($user['id']);
        unset($user['password']);
        echo json_encode(['success' => true, 'user' => $user, 'token' => $token]);
        break;

    case 'me':
        $token = getBearerToken();
        $user = $controller->findByToken($token);
        if (!$user) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Unauthorized']);
            break;
        }
        unset($user['password']);
        echo json_encode(['success' => true, 'user' => $user]);
        break;

    case 'logout':
        $token = getBearerToken();
        $user = $controller->findByToken($token);
        if ($user) {
            $controller->clearToken($user['id']);
        }
        echo json_encode(['success' => true]);
        break;

    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Unknown action']);
}
