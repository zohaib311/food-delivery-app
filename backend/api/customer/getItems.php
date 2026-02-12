<?php
require_once __DIR__ . '/../../headers/Headers.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../controller/UsersController.php';


// $action = isset($_GET['action']) ? $_GET['action'] : null;
// database Connection
$db = Database::getInstance()->getConnection();


 $stmt = $db->prepare("SELECT * FROM items  ORDER BY created_at DESC");
        $stmt->execute();
        $result = $stmt->get_result();
        $items = [];
        while ($row = $result->fetch_assoc()) {
            $items[] = $row;
        }
        $stmt->close();
        echo json_encode(['success' => true, 'items' => $items]);