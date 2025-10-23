<?php
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Headers: Content-Type");
// header("Access-Control-Allow-Methods: GET, POST");
// header("Content-Type: application/json");



// $host = "localhost";
// $username = "root";
// $password = ""; 
// $dbname = "contentt"; 

// $conn = new mysqli($host, $username, $password, $dbname);
// if ($conn->connect_error) {
//     http_response_code(500);
//     echo json_encode(["error" => "Database connection failed"]);
//     exit;
// }

// $sql = "SELECT
//  *
//  FROM app_uploads";
// $result = $conn->query($sql);

// $data = [];

// if ($result && $result->num_rows > 0) {
//     while ($row = $result->fetch_assoc()) {
//         $data[] = $row;
//     }
// }

// echo json_encode($data);
// $conn->close();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST");
header("Content-Type: application/json");

$conn = mysqli_connect("localhost", "root", "", "contentt");

if (!$conn) {
    echo json_encode(['error' => 'Connection failed']);
    exit;
}

$query = "SELECT * FROM app_uploads ORDER BY sort_order ASC, id DESC";
$result = mysqli_query($conn, $query);

$apps = [];

while ($row = mysqli_fetch_assoc($result)) {
    $apps[] = $row;
}

echo json_encode($apps);
?>


