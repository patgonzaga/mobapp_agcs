<?php
require_once('db-conn.php');

$userId = $_GET['userId'] ?? '';
$currentPassword = $_GET['currentPassword'] ?? '';
$newPassword = $_GET['newPassword'] ?? '';
$created_by = $_GET['created_by'] ?? '';
$created_at = date('Y-m-d H:i:s');

$res = [];

if (empty($currentPassword) || empty($newPassword)) {
    // http_response_code(400);
    $res['msg'] = 'Invalid input parameters';
    $res['status'] = false;
    echo json_encode($res);
    exit;
}


try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Check if plate number already exists
    $stmt = $pdo->prepare("SELECT * FROM users WHERE id = :id");
    $stmt->execute([':id' => $userId]);
    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($data['password'] != $currentPassword) {
        // http_response_code(409);
        $res['msg'] = 'Current Password is incorrect';
        $res['status'] = false;
        echo json_encode($res);
        exit;
    }


    $stmt = $pdo->prepare("UPDATE users SET password = :newPassword,
                   updated_at = :updated_at
               WHERE id = :id");
    $stmt->execute([':id' => $userId, ':updated_at' => $created_at, ':newPassword' => $newPassword]);

    // Insert audit trail
    $stmt = $pdo->prepare("INSERT INTO audit_trails (module, action, created_by,created_at) 
       VALUES (:module, :action, :created_by,:created_at)");
    $stmt->execute([':module' => 'Password changed', ':action' => "Password change", ':created_by' => $created_by, ':created_at' => $created_at]);

    $res['msg'] = 'Password changed successfully!';
    $res['status'] = true;
    echo json_encode($res);
} catch (PDOException $e) {
    // http_response_code(500);
    error_log($e->getMessage());
    $res['msg'] = $e->getMessage();
    echo json_encode($res);
}
