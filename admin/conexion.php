<?php
$host = "localhost";
$dbname = "mar174_goautos_repuestos";
$username = "TU_USUARIO_BD";
$password = "TU_PASSWORD_BD";

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}
?>
