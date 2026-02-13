<?php
require_once __DIR__ . '/../../headers/Headers.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../controller/UsersController.php';

function getBearerToken() {
    if (isset($_GET['token']) && !empty($_GET['token'])) return $_GET['token'];

    $possible = [];
    if (!empty($_SERVER['HTTP_AUTHORIZATION'])) $possible[] = $_SERVER['HTTP_AUTHORIZATION'];
    if (!empty($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) $possible[] = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    if (!empty($_SERVER['HTTP_X_AUTHORIZATION'])) $possible[] = $_SERVER['HTTP_X_AUTHORIZATION'];

    if (function_exists('apache_request_headers')) {
        $requestHeaders = apache_request_headers();
        if (!empty($requestHeaders['Authorization'])) $possible[] = $requestHeaders['Authorization'];
        if (!empty($requestHeaders['authorization'])) $possible[] = $requestHeaders['authorization'];
    }

    foreach ($possible as $h) {
        if (preg_match('/Bearer\s+(\S+)/', trim($h), $m)) return $m[1];
        if (preg_match('/^[A-Za-z0-9]{16,}$/', trim($h))) return trim($h);
    }
    return null;
}

$token = getBearerToken();
if (!$token) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$users = new UsersController();
$user = $users->findByToken($token);
if (!$user || ($user['role'] ?? '') !== 'admin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Forbidden']);
    exit;
}

$db = Database::getInstance()->getConnection();
$action = isset($_GET['action']) ? $_GET['action'] : 'list';

switch ($action) {
    case 'list':
        $status = isset($_GET['status']) ? $_GET['status'] : null;
        if ($status) {
            $stmt = $db->prepare("SELECT * FROM orders WHERE order_status = ? ORDER BY created_at DESC");
            $stmt->bind_param('s', $status);
        } else {
            $stmt = $db->prepare("SELECT * FROM orders ORDER BY created_at DESC");
        }
        $stmt->execute();
        $res = $stmt->get_result();
        $orders = [];
        while ($row = $res->fetch_assoc()) {
            // fetch items
            $itemsStmt = $db->prepare("SELECT oi.menu_item_id, oi.quantity, oi.price, i.name, i.image FROM order_items oi LEFT JOIN items i ON oi.menu_item_id = i.id WHERE oi.order_id = ?");
            $itemsStmt->bind_param('i', $row['id']);
            $itemsStmt->execute();
            $itemsRes = $itemsStmt->get_result();
            $row['items'] = [];
            while ($it = $itemsRes->fetch_assoc()) {
                $row['items'][] = $it;
            }
            $orders[] = $row;
        }
        echo json_encode(['success' => true, 'orders' => $orders]);
        break;

    case 'get':
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Missing order id']);
            break;
        }
        $id = intval($_GET['id']);
        $stmt = $db->prepare("SELECT * FROM orders WHERE id = ?");
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $res = $stmt->get_result();
        $order = $res->fetch_assoc();
        if (!$order) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Order not found']);
            break;
        }
        $itemsStmt = $db->prepare("SELECT oi.menu_item_id, oi.quantity, oi.price, i.name, i.image FROM order_items oi LEFT JOIN items i ON oi.menu_item_id = i.id WHERE oi.order_id = ?");
        $itemsStmt->bind_param('i', $id);
        $itemsStmt->execute();
        $itemsRes = $itemsStmt->get_result();
        $order['items'] = [];
        while ($it = $itemsRes->fetch_assoc()) {
            $order['items'][] = $it;
        }
        echo json_encode(['success' => true, 'order' => $order]);
        break;

    case 'update-status':
        if (!isset($_GET['id']) || !isset($_GET['status'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Missing id or status']);
            break;
        }
        $id = intval($_GET['id']);
        $status = $_GET['status'];
        $valid = ['pending','accepted','preparing','on_the_way','delivered','cancelled'];
        if (!in_array($status, $valid)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid status']);
            break;
        }
        $stmt = $db->prepare("UPDATE orders SET order_status = ? WHERE id = ?");
        $stmt->bind_param('si', $status, $id);
        if ($stmt->execute()) echo json_encode(['success' => true]); else { http_response_code(500); echo json_encode(['success' => false, 'message' => $stmt->error]); }
        break;

    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Unknown action']);
}

?>
