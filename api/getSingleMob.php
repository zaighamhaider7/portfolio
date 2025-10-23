<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Methods: GET, POST");
    header("Content-Type: application/json");

    $conn = mysqli_connect("localhost", "root", "", "contentt");

    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    if ($id <= 0) {
        echo json_encode(['error' => 'Invalid ID']);
        exit;
    }

    $stmt = $conn->prepare("SELECT * FROM app_uploads WHERE id = ? ORDER BY sort_order ASC, id DESC;");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(['error' => 'App not found']);
    } else {
        echo json_encode($result->fetch_assoc());
    }
?>
