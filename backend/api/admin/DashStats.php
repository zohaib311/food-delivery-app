<?php
require_once __DIR__ . '/../../headers/Headers.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../controller/UsersController.php';


try {

$db = Database::getInstance()->getConnection();

    // Total Users
    $usersQuery = $db->query("SELECT COUNT(*) as total_users FROM users");
    $totalUsers = $usersQuery->fetch_assoc()['total_users'];

    // Total Items
    $itemsQuery = $db->query("SELECT COUNT(*) as total_items FROM items");
    $totalItems = $itemsQuery->fetch_assoc()['total_items'];

    echo json_encode([
        "success" => true,
        "data" => [
            "total_users" => (int)$totalUsers,
            "total_items" => (int)$totalItems
        ]
    ]);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Server Error"
    ]);
}
