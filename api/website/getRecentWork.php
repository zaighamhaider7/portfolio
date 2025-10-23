<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST");
header("Content-Type: application/json");

$conn = mysqli_connect("localhost", "root", "", "contentt");

if (!$conn) {
    echo json_encode(['error' => 'Connection failed']);
    exit;
}

$query = "SELECT * FROM website ORDER BY sort_order ASC, id DESC";
$result = mysqli_query($conn, $query);

$apps = [];

while ($row = mysqli_fetch_assoc($result)) {
    $apps[] = $row;
}

echo json_encode($apps);
?>
