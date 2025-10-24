<?php
// ========================================
// CONFIGURACIÓN DE CONEXIÓN
// ========================================
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once "../admin/conexion.php";


try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error de conexión: " . $e->getMessage()]);
    exit;
}

// ========================================
// MÉTODOS CRUD
// ========================================
$method = $_SERVER['REQUEST_METHOD'];

// 🔹 GET: Listar todos los productos
if ($method === 'GET') {
    $stmt = $conn->query("SELECT * FROM productos WHERE estado = 1 ORDER BY id DESC");
    $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Convertir el campo de imágenes a array
    foreach ($productos as &$p) {
        $p['imagenes'] = $p['imagenes'] ? explode(',', $p['imagenes']) : [];
    }

    echo json_encode($productos);
    exit;
}

// 🔹 POST: Crear nuevo producto
if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data || empty($data['nombre'])) {
        http_response_code(400);
        echo json_encode(["error" => "Datos incompletos"]);
        exit;
    }

    $imagenes = isset($data['imagenes']) ? implode(',', $data['imagenes']) : '';

    $sql = "INSERT INTO productos 
            (categoria, clasificacion, carroceria, proveedor, uso, nombre, codigo, precio, stock, descripcion, imagenes)
            VALUES 
            (:categoria, :clasificacion, :carroceria, :proveedor, :uso, :nombre, :codigo, :precio, :stock, :descripcion, :imagenes)";

    $stmt = $conn->prepare($sql);
    $stmt->execute([
        ":categoria" => $data['categoria'],
        ":clasificacion" => $data['clasificacion'],
        ":carroceria" => $data['carroceria'],
        ":proveedor" => $data['proveedor'],
        ":uso" => $data['uso'],
        ":nombre" => $data['nombre'],
        ":codigo" => $data['codigo'],
        ":precio" => $data['precio'],
        ":stock" => $data['stock'],
        ":descripcion" => $data['descripcion'],
        ":imagenes" => $imagenes
    ]);

    echo json_encode(["success" => true, "id" => $conn->lastInsertId()]);
    exit;
}

// 🔹 PUT: Actualizar producto existente
if ($method === 'PUT') {
    parse_str($_SERVER['QUERY_STRING'], $params);
    $id = $params['id'] ?? null;

    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "ID no especificado"]);
        exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);
    $imagenes = isset($data['imagenes']) ? implode(',', $data['imagenes']) : '';

    $sql = "UPDATE productos SET 
            categoria=:categoria, clasificacion=:clasificacion, carroceria=:carroceria, proveedor=:proveedor,
            uso=:uso, nombre=:nombre, codigo=:codigo, precio=:precio, stock=:stock, descripcion=:descripcion, imagenes=:imagenes
            WHERE id=:id";

    $stmt = $conn->prepare($sql);
    $stmt->execute([
        ":categoria" => $data['categoria'],
        ":clasificacion" => $data['clasificacion'],
        ":carroceria" => $data['carroceria'],
        ":proveedor" => $data['proveedor'],
        ":uso" => $data['uso'],
        ":nombre" => $data['nombre'],
        ":codigo" => $data['codigo'],
        ":precio" => $data['precio'],
        ":stock" => $data['stock'],
        ":descripcion" => $data['descripcion'],
        ":imagenes" => $imagenes,
        ":id" => $id
    ]);

    echo json_encode(["success" => true]);
    exit;
}

// 🔹 DELETE: Eliminar producto
if ($method === 'DELETE') {
    parse_str($_SERVER['QUERY_STRING'], $params);
    $id = $params['id'] ?? null;

    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "ID no especificado"]);
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM productos WHERE id=:id");
    $stmt->execute([":id" => $id]);

    echo json_encode(["success" => true]);
    exit;
}

// Si el método no es soportado
http_response_code(405);
echo json_encode(["error" => "Método no permitido"]);
