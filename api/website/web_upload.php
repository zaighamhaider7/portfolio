<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// DB connection
$host = "localhost";
$username = "root";
$password = "";
$dbname = "contentt"; // Use your actual DB name

$conn = new mysqli($host, $username, $password, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "DB connection failed"]);
    exit();
}

// Helpers
function uploadFile($fieldName, $uploadDir = 'uploads/') {
    if (!isset($_FILES[$fieldName]) || $_FILES[$fieldName]['error'] !== UPLOAD_ERR_OK) {
        return null;
    }

    $ext = pathinfo($_FILES[$fieldName]['name'], PATHINFO_EXTENSION);
    $filename = uniqid("img_", true) . '.' . $ext;

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $path = $uploadDir . $filename;
    if (move_uploaded_file($_FILES[$fieldName]['tmp_name'], $path)) {
        return $path;
    }
    return null;
}

// Get input data
$title = $conn->real_escape_string($_POST['title'] ?? '');
$description = $conn->real_escape_string($_POST['description'] ?? '');
$sort_order = $conn->real_escape_string($_POST['sort_order'] ?? '');
$web_link = $conn->real_escape_string($_POST['web_link'] ?? '');
$imagePath = uploadFile('image');

// Validate
if (empty($title) || empty($description) || !$imagePath) {
    echo json_encode(["success" => false, "message" => "Missing title, description, or image"]);
    exit();
}

// Insert into DB
$sql = "INSERT INTO website (title, description, image,sort_order, web_link) VALUES (?, ?, ?,?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssss", $title, $description, $imagePath,$sort_order, $web_link);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Uploaded successfully", "image" => $imagePath]);
} else {
    echo json_encode(["success" => false, "message" => "Upload failed: " . $stmt->error]);
}

$stmt->close();
$conn->close();
