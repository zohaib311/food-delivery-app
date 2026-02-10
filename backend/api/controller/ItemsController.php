<?php
require_once __DIR__ . '/../../config/Database.php';

class ItemsController {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function list() {
        $stmt = $this->db->prepare("SELECT * FROM items WHERE status = 1 ORDER BY created_at DESC");
        $stmt->execute();
        $result = $stmt->get_result();
        $items = [];
        while ($row = $result->fetch_assoc()) {
            $items[] = $row;
        }
        $stmt->close();
        return $items;
    }

    public function get($id) {
        $stmt = $this->db->prepare("SELECT * FROM items WHERE id = ? AND status = 1");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $item = $result->fetch_assoc();
        $stmt->close();
        return $item;
    }

    public function add($payload) {
        $name = isset($payload['name']) ? $payload['name'] : '';
        $description = isset($payload['description']) ? $payload['description'] : '';
        $price = isset($payload['price']) ? floatval($payload['price']) : 0.0;
        $category = isset($payload['category']) ? $payload['category'] : 'uncategorized';
        $image = isset($payload['image']) ? $payload['image'] : null;

        $stmt = $this->db->prepare("INSERT INTO items (name, description, price, category, image) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("ssdss", $name, $description, $price, $category, $image);
        
        if ($stmt->execute()) {
            $itemId = $this->db->insert_id;
            $stmt->close();
            return $this->get($itemId);
        }
        $stmt->close();
        return null;
    }
}
