<?php

require_once __DIR__ . '/../../headers/Headers.php';
require_once __DIR__ . '/../../config/Database.php';

class OrdersController {
    private $conn;

    public function __construct() {
        $this->conn = Database::getInstance()->getConnection();
    }

    // Create a new order
    public function createOrder($userId, $items, $deliveryFee = 0, $deliveryName = null, $deliveryPhone = null, $deliveryAddress = null, $deliveryCity = null, $deliveryZip = null, $paymentMethod = 'cod', $paymentReference = null, $cardBrand = null, $cardLast4 = null, $paymentMeta = null) {
        try {
            // Calculate total
            $total = 0;
            foreach ($items as $item) {
                $total += $item['price'] * $item['quantity'];
            }
            $total += $deliveryFee;

            // Insert order (including delivery + payment metadata)
            $stmt = $this->conn->prepare("
                INSERT INTO orders (user_id, total_amount, delivery_fee, delivery_name, delivery_phone, delivery_address, delivery_city, delivery_zip, payment_method, payment_reference, card_brand, card_last4, payment_meta, order_status, payment_status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'pending')
            ");
            $stmt->bind_param("iddssssssssss", $userId, $total, $deliveryFee, $deliveryName, $deliveryPhone, $deliveryAddress, $deliveryCity, $deliveryZip, $paymentMethod, $paymentReference, $cardBrand, $cardLast4, $paymentMeta);
            if (!$stmt->execute()) {
                throw new Exception("Failed to create order: " . $stmt->error);
            }
            $orderId = $stmt->insert_id;

            // Insert order items into order_items table
            foreach ($items as $item) {
                $itemStmt = $this->conn->prepare("
                    INSERT INTO order_items (order_id, menu_item_id, quantity, price)
                    VALUES (?, ?, ?, ?)
                ");
                $itemStmt->bind_param("iidi", $orderId, $item['id'], $item['quantity'], $item['price']);
                if (!$itemStmt->execute()) {
                    throw new Exception("Failed to create order item: " . $itemStmt->error);
                }
            }

            return $this->getOrderById($orderId);
        } catch (Exception $e) {
            throw $e;
        }
    }

    // Get order by ID
    public function getOrderById($orderId) {
        $stmt = $this->conn->prepare("
            SELECT o.*, u.name as user_name, u.phone, u.email
            FROM orders o
            JOIN users u ON o.user_id = u.id
            WHERE o.id = ?
        ");
        $stmt->bind_param("i", $orderId);
        $stmt->execute();
        $result = $stmt->get_result();
        $order = $result->fetch_assoc();

        if (!$order) {
            return null;
        }

        // Get order items from order_items table
        $itemsStmt = $this->conn->prepare("
            SELECT oi.menu_item_id, oi.quantity, oi.price, i.name, i.image
            FROM order_items oi
            LEFT JOIN items i ON oi.menu_item_id = i.id
            WHERE oi.order_id = ?
        ");
        $itemsStmt->bind_param("i", $orderId);
        $itemsStmt->execute();
        $itemsResult = $itemsStmt->get_result();
        $order['items'] = [];
        while ($item = $itemsResult->fetch_assoc()) {
            $order['items'][] = $item;
        }

        return $order;
    }

    // Get customer orders
    public function getCustomerOrders($userId) {
        $stmt = $this->conn->prepare("
            SELECT *
            FROM orders
            WHERE user_id = ?
            ORDER BY created_at DESC
        ");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        $orders = [];
        while ($row = $result->fetch_assoc()) {
            // Get order items for each order
            $itemsStmt = $this->conn->prepare("
                SELECT oi.menu_item_id, oi.quantity, oi.price, i.name, i.image
                FROM order_items oi
                LEFT JOIN items i ON oi.menu_item_id = i.id
                WHERE oi.order_id = ?
            ");
            $itemsStmt->bind_param("i", $row['id']);
            $itemsStmt->execute();
            $itemsResult = $itemsStmt->get_result();
            $row['items'] = [];
            while ($item = $itemsResult->fetch_assoc()) {
                $row['items'][] = $item;
            }
            $orders[] = $row;
        }
        return $orders;
    }

    // Update order status
    public function updateOrderStatus($orderId, $status) {
        $validStatuses = ['pending', 'accepted', 'preparing', 'on_the_way', 'delivered', 'cancelled'];
        if (!in_array($status, $validStatuses)) {
            throw new Exception("Invalid status");
        }
        
        $stmt = $this->conn->prepare("UPDATE orders SET order_status = ? WHERE id = ?");
        $stmt->bind_param("si", $status, $orderId);
        return $stmt->execute();
    }

    // Update payment status
    public function updatePaymentStatus($orderId, $status) {
        $validStatuses = ['pending', 'paid', 'failed'];
        if (!in_array($status, $validStatuses)) {
            throw new Exception("Invalid status");
        }
        
        $stmt = $this->conn->prepare("UPDATE orders SET payment_status = ? WHERE id = ?");
        $stmt->bind_param("si", $status, $orderId);
        return $stmt->execute();
    }
}

// Router
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

$controller = new OrdersController();
$action = isset($_GET['action']) ? $_GET['action'] : null;

switch ($action) {
    case 'create':
        $raw = file_get_contents('php://input');
        $payload = json_decode($raw, true);
        
        if (!isset($payload['items']) || !is_array($payload['items']) || empty($payload['items'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Missing or invalid items']);
            break;
        }

        $token = getBearerToken();
        if (!$token) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Unauthorized']);
            break;
        }

        // Verify user exists (simplified - in production use token validation)
        require_once __DIR__ . '/../controller/UsersController.php';
        $userController = new UsersController();
        $user = $userController->findByToken($token);
        if (!$user) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Invalid token']);
            break;
        }

        $deliveryFee = isset($payload['delivery_fee']) ? floatval($payload['delivery_fee']) : 0;
        $deliveryName = isset($payload['delivery_name']) ? $payload['delivery_name'] : null;
        $deliveryPhone = isset($payload['delivery_phone']) ? $payload['delivery_phone'] : null;
        $deliveryAddress = isset($payload['delivery_address']) ? $payload['delivery_address'] : null;
        $deliveryCity = isset($payload['delivery_city']) ? $payload['delivery_city'] : null;
        $deliveryZip = isset($payload['delivery_zip']) ? $payload['delivery_zip'] : null;
        $paymentMethod = isset($payload['payment_method']) ? $payload['payment_method'] : 'cod';
        $paymentReference = isset($payload['payment_reference']) ? $payload['payment_reference'] : null;
        $cardBrand = isset($payload['card_brand']) ? $payload['card_brand'] : null;
        $cardLast4 = isset($payload['card_last4']) ? $payload['card_last4'] : null;
        $paymentMeta = isset($payload['payment_meta']) ? json_encode($payload['payment_meta']) : null;

        try {
            $order = $controller->createOrder($user['id'], $payload['items'], $deliveryFee, $deliveryName, $deliveryPhone, $deliveryAddress, $deliveryCity, $deliveryZip, $paymentMethod, $paymentReference, $cardBrand, $cardLast4, $paymentMeta);
            echo json_encode(['success' => true, 'order' => $order]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        break;

    case 'get':
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Missing order ID']);
            break;
        }
        $order = $controller->getOrderById(intval($_GET['id']));
        if (!$order) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Order not found']);
            break;
        }
        echo json_encode(['success' => true, 'order' => $order]);
        break;

    case 'list':
        $token = getBearerToken();
        if (!$token) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Unauthorized']);
            break;
        }

        require_once __DIR__ . '/../controller/UsersController.php';
        $userController = new UsersController();
        $user = $userController->findByToken($token);
        if (!$user) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Invalid token']);
            break;
        }

        $orders = $controller->getCustomerOrders($user['id']);
        echo json_encode(['success' => true, 'orders' => $orders]);
        break;

    case 'update-status':
        if (!isset($_GET['id']) || !isset($_GET['status'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Missing order ID or status']);
            break;
        }

        try {
            $controller->updateOrderStatus(intval($_GET['id']), $_GET['status']);
            echo json_encode(['success' => true, 'message' => 'Order status updated']);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        break;

    case 'update-payment':
        if (!isset($_GET['id']) || !isset($_GET['status'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Missing order ID or status']);
            break;
        }

        try {
            $controller->updatePaymentStatus(intval($_GET['id']), $_GET['status']);
            echo json_encode(['success' => true, 'message' => 'Payment status updated']);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        break;

    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Unknown action']);
}
?>
