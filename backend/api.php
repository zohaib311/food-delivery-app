<?php
header("Content-Type: application/json");
// app/Http/Middleware/Cors.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");


$data = [
  "message" => "Hello from PHP backend!"
];

echo json_encode($data);
