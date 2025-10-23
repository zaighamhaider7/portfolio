<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ---------- DB CONNECTION ----------
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

// ---------- FUNCTIONS ----------
function saveFile($fieldName, $uploadDir = 'uploads/') {
    if (!isset($_FILES[$fieldName]) || $_FILES[$fieldName]['error'] !== 0) {
        return null;
    }

    $ext = pathinfo($_FILES[$fieldName]['name'], PATHINFO_EXTENSION);
    $filename = uniqid($fieldName . "_") . "." . $ext;

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $targetPath = $uploadDir . $filename;
    if (move_uploaded_file($_FILES[$fieldName]['tmp_name'], $targetPath)) {
        return $targetPath;
    }

    return null;
}

// ---------- GET INPUT ----------
$id = intval($_POST['id'] ?? 0);
$title = $conn->real_escape_string($_POST['title'] ?? '');
$description = $conn->real_escape_string($_POST['description'] ?? '');
$sort_order = $conn->real_escape_string($_POST['sort_order'] ?? '');

// ---------- FILE CHECK ----------
$imagePath = saveFile('image');

// ---------- BUILD QUERY ----------
$updates = [];
$updates[] = "title = '$title'";
$updates[] = "description = '$description'";
$updates[] = "sort_order = '$sort_order'";

if ($imagePath !== null) {
    $safeImage = $conn->real_escape_string($imagePath);
    $updates[] = "image = '$safeImage'";
}

$sql = "UPDATE casestudy SET " . implode(", ", $updates) . " WHERE id = $id";

// ---------- EXECUTE ----------
if ($conn->query($sql) === TRUE) {
    $result = $conn->query("SELECT * FROM casestudy WHERE id = $id");
    $row = $result ? $result->fetch_assoc() : [];

    echo json_encode([
        "success" => true,
        "message" => "Case study updated successfully",
        "data" => $row
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Update failed: " . $conn->error
    ]);
}

$conn->close();
?>
