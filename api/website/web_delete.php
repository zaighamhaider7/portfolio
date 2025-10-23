<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ---------- DB CONFIG ----------
$host = "localhost";
$username = "root";
$password = "";
$dbname = "contentt";

$conn = new mysqli($host, $username, $password, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

// ---------- GET ID ----------
$id = intval($_GET['id'] ?? 0);
if (!$id) {
    echo json_encode(["success" => false, "message" => "Missing ID"]);
    exit;
}

// ---------- DELETE ----------
$sql = "DELETE FROM website WHERE id = $id";
if ($conn->query($sql) === TRUE) {
    echo json_encode(["success" => true, "message" => "Case study deleted successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Delete failed: " . $conn->error]);
}

$conn->close();
?>
