<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$targetDir = "../images/";
if (!file_exists($targetDir)) {
    mkdir($targetDir, 0775, true);
}

$response = ["success" => false, "files" => []];

if (!empty($_FILES['imagenes']['name'][0])) {
    foreach ($_FILES['imagenes']['name'] as $key => $name) {
        $tmpName = $_FILES['imagenes']['tmp_name'][$key];
        $extension = pathinfo($name, PATHINFO_EXTENSION);
        $fileName = uniqid("img_") . "." . strtolower($extension);
        $targetFile = $targetDir . $fileName;

        if (move_uploaded_file($tmpName, $targetFile)) {
            $response["files"][] = $fileName;
        }
    }

    $response["success"] = true;
}

echo json_encode($response);
