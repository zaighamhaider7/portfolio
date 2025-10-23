<?php
error_reporting(0);
ini_set('upload_max_filesize', '90M');
ini_set('post_max_size', '90M');
ini_set('max_execution_time', '300'); // Optional: increase max execution time

header("Access-Control-Allow-Origin: *"); // Or set to http://localhost:3000
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
$debug = [];
    try {
        // ---------- DB Config ----------
            $host = "localhost";
            $username = "root";
            $password = ""; // default in XAMPP
            $dbname = "contentt";

            // Create DB connection
            $conn = new mysqli($host, $username, $password, $dbname);
            if ($conn->connect_error) {
                http_response_code(500);
                echo json_encode(["success" => false, "message" => "DB connection failed"]);
                exit;
            }

            $uploadDir = './uploads/';
            if (!is_dir($uploadDir)) {
                if (!mkdir($uploadDir, 0777, true)) {
                    throw new Exception("Failed to create upload directory");
                }
            }

            if (!is_writable($uploadDir)) {
                throw new Exception("Upload directory is not writable");
            }

            // Add file upload validation
            foreach ($_FILES as $key => $file) {
                if (isset($file['error']) && $file['error'] !== 0) {
                    $debug[$key] = "Upload error code: " . $file['error'];
                }
            }
            // ---------- Upload Helper ----------
            function saveFile($fieldName, $uploadDir = './uploads/') {
                if (!isset($_FILES[$fieldName])) return null;

                $file = $_FILES[$fieldName];
                if ($file['error'] !== 0) return null;

                $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
                $filename = uniqid($fieldName . "_") . "." . $ext;
                $targetPath = $uploadDir . $filename;

                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0777, true);
                }

                return move_uploaded_file($file['tmp_name'], $targetPath) ? $targetPath : null;
            }

            // ---------- Collect Inputs ----------
            // $data = [
            //     'overview'     => $_POST['overview']     ?? '',
            //     'title'        => $_POST['title']        ?? '',
            //     'description'  => $_POST['description']  ?? '',
            //     'heading1'     => $_POST['heading1']     ?? '',
            //     'paragraph1'   => $_POST['paragraph1']   ?? '',
            //     'goal'         => $_POST['goal']         ?? '',
            //     'textSection'  => $_POST['textSection']  ?? '',
            //     'text3'        => $_POST['text3']        ?? '',
            //     'sort_order'   => $_POST['sort_order']        ?? '',

            // ];
            $data = [
                'software_name'     => $_POST['software_name']     ?? '',
                'software_description'        => $_POST['software_description']        ?? '',
                'software_title'  => $_POST['software_title']  ?? '',
                'software_title_description'     => $_POST['software_title_description']     ?? '',
                'project_overview_1'   => $_POST['project_overview_1']   ?? '',
                'project_overview_2'         => $_POST['project_overview_2']         ?? '',
                'project_overview_3'  => $_POST['project_overview_3']  ?? '',
                'goal_1'        => $_POST['goal_1']        ?? '',
                'goal_2'        => $_POST['goal_2']        ?? '',
                'last_description'        => $_POST['last_description']        ?? '',
                'last_heading'        => $_POST['last_heading']        ?? '',
                'sort_order'   => $_POST['sort_order']        ?? '',
            ];

            // $files = [
            //     'heroImage' => saveFile('heroImage'),
            //     'video1'    => saveFile('video1'),
            //     'image1'    => saveFile('image1'),
            //     'image2'    => saveFile('image2'),
            //     'imgSet1'   => saveFile('imgSet1'),
            //     'imgSet2'   => saveFile('imgSet2'),
            //     'video3'    => saveFile('video3'),
            // ];

            $files = [
                'software_banner_image' => saveFile('software_banner_image'),
                'overview_image_1'    => saveFile('overview_image_1'),
                'overview_image_2'    => saveFile('overview_image_2'),
                'goal_image_1'    => saveFile('goal_image_1'),
                'goal_image_2'   => saveFile('goal_image_2'),
                'goal_image_3'   => saveFile('goal_image_3'),
                'software_front_image'    => saveFile('software_front_image'),
            ];

            // ---------- Save to DB ----------
            $stmt = $conn->prepare("
                INSERT INTO sd (
                    software_name, software_description, software_title, software_title_description, software_banner_image, project_overview_1, project_overview_2, project_overview_3,
                    overview_image_1, overview_image_2, goal_1, goal_2, goal_image_1, goal_image_2, goal_image_3, last_description, last_heading, sort_order, software_front_image
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");

            $stmt->bind_param(
                "sssssssssssssssssis",
                $data['software_name'],
                $data['software_description'],
                $data['software_title'],
                $data['software_title_description'],
                $files['software_banner_image'],
                $data['project_overview_1'],
                $data['project_overview_2'],
                $data['project_overview_3'],
                $files['overview_image_1'],
                $files['overview_image_2'],
                $data['goal_1'],
                $data['goal_2'],
                $files['goal_image_1'],
                $files['goal_image_2'],
                $files['goal_image_3'],
                $data['last_description'],
                $data['last_heading'],
                $data['sort_order'],
                $files['software_front_image']
            );

            if ($stmt->execute()) {
                echo json_encode([
                    "success" => true,
                    "message" => "Upload and save successful",
                    "insert_id" => $stmt->insert_id,
                    "debug" => $debug
                ]);
            } else {
                throw new Exception("DB insert failed: " . $stmt->error);
            }
            

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => $e->getMessage(),
            "debug" => $debug
        ]);
    }



$stmt->close();
$conn->close();


?>
