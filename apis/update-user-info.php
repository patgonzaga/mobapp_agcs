<?php
require_once('db-conn.php');

$userId = $_POST['userId'] ?? '';
$username_ = $_POST['username'] ?? '';
$email = $_POST['email'] ?? '';
$created_by = $_POST['username'] ?? '';
$updated_at = date('Y-m-d H:i:s');
$res = [];

if (empty($username_) || empty($email) || empty($userId)) {
    // http_response_code(400);
    $res['msg'] = 'Invalid input parameters';
    echo "false";
    exit;
}
try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->prepare("UPDATE users SET img = :img, username = :username, email = :email,
      updated_at = :updated_at WHERE id = :id");
    $stmt->execute([':id' => $userId, ':updated_at' => $updated_at, ':username' => $username_, ':email' => $email, ':img' => $img]);

    // Insert audit trail
    $stmt = $pdo->prepare("INSERT INTO audit_trails (module, action, created_by,created_at) 
VALUES (:module, :action, :created_by,:created_at)");
    $stmt->execute([':module' => 'User Information Updated', ':action' => "User Information Updated", ':created_by' => $created_by, ':created_at' => $updated_at]);

    $stmt = $pdo->prepare("SELECT * FROM users WHERE id = :id");
    $stmt->execute([':id' => $userId]);
    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    $res = $data;
    $res['msg'] = 'User information successfully updated!';
    $res['status'] = true;
    echo json_encode($res);
} catch (PDOException $e) {
    // http_response_code(500);
    error_log($e->getMessage());
    $res['msg'] = $e->getMessage();
    echo json_encode($res);
}
