<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$host = "localhost";
$dbname = "mar174_goautos_db"; // 👈 base principal donde están los usuarios
$username = "mar174_goautos_respuestos";
$password = "Bills1416.";

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => "Error de conexión"]);
    exit;
}

// Leer datos enviados desde el modal
$data = json_decode(file_get_contents("php://input"), true);
$email = $data["usuario"] ?? "";
$clave = $data["password"] ?? "";

// Buscar usuario
$stmt = $conn->prepare("SELECT * FROM usuarios WHERE email = :email OR usuario = :email LIMIT 1");
$stmt->execute([":email" => $email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user && password_verify($clave, $user["password"])) {
    echo json_encode([
        "success" => true,
        "nombre" => $user["nombre"],
        "rol" => $user["rol"] ?? "user"
    ]);
} else {
    echo json_encode(["success" => false, "error" => "Usuario o contraseña incorrectos"]);
}
?>
