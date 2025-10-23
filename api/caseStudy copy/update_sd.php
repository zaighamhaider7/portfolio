<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
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
    echo json_encode(["success" => false, "message" => "DB connection failed"]);
    exit;
}

// ---------- FILE UPLOAD FUNCTION ----------
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

// ---------- GET INPUTS ----------
$id = intval($_POST['id'] ?? 0);
if (!$id) {
    echo json_encode(["success" => false, "message" => "Missing ID"]);
    exit;
}

$software_name    = $conn->real_escape_string($_POST['software_name'] ?? '');
$software_description       = $conn->real_escape_string($_POST['software_description'] ?? '');
$software_title = $conn->real_escape_string($_POST['software_title'] ?? '');
$software_title_description    = $conn->real_escape_string($_POST['software_title_description']);
$project_overview_1  = $conn->real_escape_string($_POST['project_overview_1']);
$project_overview_2 = $conn->real_escape_string($_POST['project_overview_2'] ?? '');
$project_overview_3 = $conn->real_escape_string($_POST['project_overview_3'] ?? '');
$goal_1       = $conn->real_escape_string($_POST['goal_1'] ?? '');
$goal_2       = $conn->real_escape_string($_POST['goal_1'] ?? '');
$last_description       = $conn->real_escape_string($_POST['last_description'] ?? '');
$last_heading       = $conn->real_escape_string($_POST['last_heading'] ?? '');
$sort_order  = $conn->real_escape_string($_POST['sort_order'] ?? '0');
// ---------- CHECK FILE UPLOADS ----------
$files = [
    'software_banner_image' => saveFile('software_banner_image'),
    'overview_image_1'    => saveFile('overview_image_1'),
    'overview_image_2'    => saveFile('overview_image_2'),
    'goal_image_1'    => saveFile('goal_image_1'),
    'goal_image_2'   => saveFile('goal_image_2'),
    'goal_image_3'   => saveFile('goal_image_3'),
    'software_front_image'    => saveFile('software_front_image'),
];

// ---------- BUILD UPDATE QUERY ----------
$updates = [];
$updates[] = "software_name = '$software_name'";
$updates[] = "software_description = '$software_description'";
$updates[] = "software_title = '$software_title'";
$updates[] = "software_title_description = '$software_title_description'";
$updates[] = "project_overview_1 = '$project_overview_1'";
$updates[] = "project_overview_2 = '$project_overview_2'";
$updates[] = "project_overview_3 = '$project_overview_3'";
$updates[] = "goal_1 = '$goal_1'";
$updates[] = "goal_2 = '$goal_2'";
$updates[] = "last_description = '$last_description'";
$updates[] = "last_heading = '$last_heading'";
$updates[] = "sort_order = '$sort_order'";

foreach ($files as $key => $val) {
    if ($val !== null) {
        $safe = $conn->real_escape_string($val);
        $updates[] = "$key = '$safe'";
    }
}

$sql = "UPDATE sd SET " . implode(', ', $updates) . " WHERE id = $id";

// ---------- EXECUTE ----------
if ($conn->query($sql) === TRUE) {
    // Get updated row to send full final paths
    $result = $conn->query("SELECT
  *
FROM sd
 WHERE id = $id");
    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();

        echo json_encode([
            "success" => true,
            "message" => "Updated successfully",
            "data" => $row
        ]);
    } else {
        echo json_encode([
            "success" => true,
            "message" => "Updated, but failed to fetch updated row",
            "data" => []
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => "Update failed: " . $conn->error
    ]);
}

$conn->close();
?>
