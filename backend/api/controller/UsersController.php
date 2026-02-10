<?php
require_once __DIR__ . '/../../config/Database.php';

class UsersController {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
        $this->ensureTokenColumn();
    }

    private function ensureTokenColumn() {
        $result = $this->db->query("SHOW COLUMNS FROM users LIKE 'token'");
        if ($result->num_rows === 0) {
            $this->db->query("ALTER TABLE users ADD COLUMN token VARCHAR(255) DEFAULT NULL");
        }
    }

    public function findByEmail($email) {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        $stmt->close();
        return $user;
    }

    public function getById($id) {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        $stmt->close();
        return $user;
    }

    public function addUser($name, $email, $password, $phone = null, $role = 'customer') {
        // Check if email exists
        if ($this->findByEmail($email)) {
            return null;
        }

        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $this->db->prepare("INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $name, $email, $phone, $passwordHash, $role);
        
        if ($stmt->execute()) {
            $userId = $this->db->insert_id;
            $stmt->close();
            return $this->getById($userId);
        }
        $stmt->close();
        return null;
    }

    public function verifyPassword($email, $password) {
        $user = $this->findByEmail($email);
        if (!$user) return null;
        if (password_verify($password, $user['password'])) return $user;
        return null;
    }

    public function setToken($userId, $token) {
        $stmt = $this->db->prepare("UPDATE users SET token = ? WHERE id = ?");
        $stmt->bind_param("si", $token, $userId);
        $result = $stmt->execute();
        $stmt->close();
        return $result;
    }

    public function findByToken($token) {
        if (!$token) return null;
        $stmt = $this->db->prepare("SELECT * FROM users WHERE token = ?");
        $stmt->bind_param("s", $token);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        $stmt->close();
        return $user;
    }

    public function clearToken($userId) {
        return $this->setToken($userId, null);
    }
}
