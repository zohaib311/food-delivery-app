<?php
require_once __DIR__ . '/Env.php';

Env::load(__DIR__ . '/../.env');

class Database {
    private static $instance = null;
    private $conn;
    private $host;
    private $db;
    private $user;
    private $password;
    private $port;

    private function __construct() {
        $this->host = Env::get('DB_HOST', 'localhost');
        $this->db = Env::get('DB_DATABASE', 'foodieshub');
        $this->user = Env::get('DB_USERNAME', 'root');
        $this->password = Env::get('DB_PASSWORD', '');
        $this->port = (int) Env::get('DB_PORT', 3306);
        $this->connect();
    }

    private function connect() {
        try {
            $this->conn = new mysqli(
                $this->host,
                $this->user,
                $this->password,
                $this->db,
                $this->port
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
