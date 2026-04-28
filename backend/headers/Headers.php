<?php
require_once __DIR__ . '/../config/Env.php';

Env::load(__DIR__ . '/../.env');

$allowedOrigin = Env::get('CORS_ALLOWED_ORIGIN', '*');

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: " . $allowedOrigin);
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
