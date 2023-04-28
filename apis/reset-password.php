<?php
require_once('db-conn.php');

$email = $_GET['email'] ?? '';
$otp = $_GET['otp'] ?? '';
$password_ = $_GET['password'] ?? '';
$created_at = date('Y-m-d H:i:s');
$token = null;
$res = [];

if (empty($otp) || empty($password_)) {
    // http_response_code(400);
    $res['msg'] = 'Invalid input parameters';
    $res['status'] = false;
    echo json_encode($res);
    exit;
}


try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email AND password_token = :otp");
    $stmt->execute([':email' => $email, ':otp' => $otp]);
    $data = $stmt->fetch(PDO::FETCH_ASSOC);
    // printf($data);
    if ($data) {
        // http_response_code(409);

        $user = $data['username'];
        $stmt = $pdo->prepare("UPDATE users SET password = :password,
                   updated_at = :updated_at,
                   password_token = :token
               WHERE email = :email");
        $stmt->execute([':email' => $email, ':updated_at' => $created_at, ':password' => $password_, ':token' => $token]);

        // Insert audit trail
        $stmt = $pdo->prepare("INSERT INTO audit_trails (module, action, created_by,created_at) 
       VALUES (:module, :action, :created_by,:created_at)");
        $stmt->execute([':module' => 'Password reset', ':action' => "Password reset", ':created_by' => $user, ':created_at' => $created_at]);

        $res['msg'] = 'Password changed successfully!';
        $res['status'] = true;
        echo json_encode($res);
    } else {

        $res['msg'] = 'Incorrect Code';
        $res['status'] = false;
        echo json_encode($res);
        exit;
    }
} catch (PDOException $e) {
    // http_response_code(500);
    error_log($e->getMessage());
    $res['msg'] = $e->getMessage();
    echo json_encode($res);
}
