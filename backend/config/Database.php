<?php
class Database {
    private static $instance = null;
    private $conn;
    private $host = 'localhost';
    private $db = 'foodieshub';
    private $user = 'root';
    private $password = '';

    private function __construct() {
        $this->connect();
    }

    private function connect() {
        try {
            $this->conn = new mysqli(
                $this->host,
                $this->user,
                $this->password,
                $this->db
            );
            if ($this->conn->connect_error) {
                throw new Exception("Connection failed: " . $this->conn->connect_error);
            }
            $this->conn->set_charset("utf8");
        } catch (Exception $e) {
            die(json_encode(['success' => false, 'message' => 'Database connection error: ' . $e->getMessage()]));
        }
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getConnection() {
        return $this->conn;
    }
}
