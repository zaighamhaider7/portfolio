<?php
// Show PHP errors (for debugging — remove in production)

// CORS headers
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");


// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// DB connection
$host = "localhost";
$username = "root";
$password = "";
$dbname = "contentt";

$conn = new mysqli($host, $username, $password, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "DB connection failed"]);
    exit;
}

// Get ID
if (!isset($_GET['id'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing ID"]);
    exit;
}

$id = intval($_GET['id']); // Always sanitize inputs

// Delete
$sql = "DELETE FROM app_uploads WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Deleted successfully"]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $conn->error]);
}
?>
