<?php
// main db connection
require_once('db-conn.php');

$user_name = $_GET['username'];
$pass_word = $_GET['password'];

$res = [];

try {
    // create connection
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);

    // prepare and execute 
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ? AND status = 'active'");
    $stmt->execute([$user_name]);
    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($data && $pass_word == $data['password']) {
        $module = 'User login.';
        $action = "User $user_name logged in.";

        $insertStmt = $pdo->prepare("INSERT INTO `audit_trails`(`module`, `action`, `created_by`) VALUES (?, ?, ?)");
        $insertStmt->execute([$module, $action, $user_name]);

        header('Content-Type: application/json; charset=utf-8');
        $res = $data;
        $res['status'] = true;
        echo json_encode($res);
    } else {
        header('Content-Type: application/json; charset=utf-8');
        $res['msg'] = 'Invalid username or password';
        $res['status'] = false;
        echo json_encode($res);
    }
} catch (PDOException $e) {
    echo json_encode(array("error" => $e->getMessage()));
}
