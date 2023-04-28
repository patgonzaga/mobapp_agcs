<?php
require_once('db-conn.php');

$id = $_GET['id'] ?? '';
$rfid = $_GET['rfid'] ?? '';
$action = $_GET['action'] ?? '';
$created_by = $_GET['created_by'] ?? '';
$created_at = date('Y-m-d H:i:s');

$res = [];

if (empty($rfid) || empty($action)) {
    // http_response_code(400);
    $res['msg'] = 'Invalid input parameters';
    $res['status'] = false;
    echo json_encode($res);
    exit;
}


try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


    if ($action == 'add') {
        // Check if plate number already exists
        $stmt = $pdo->prepare("SELECT * FROM rfid_list WHERE rfid = :rfid");
        $stmt->execute([':rfid' => $rfid]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($data) {
            // http_response_code(409);
            $res['msg'] = 'RFID already exists!';
            $res['status'] = false;
            echo json_encode($res);
            exit;
        }
        // Insert rfid details
        $stmt = $pdo->prepare("INSERT INTO rfid_list (created_by,created_at,rfid,updated_at) VALUES (:created_by, :created_at, :rfid, :updated_at)");
        $stmt->execute([':created_by' => $created_by, ':created_at' => $created_at, ':rfid' => $rfid, ':updated_at' => $created_at]);

        // Insert audit trail
        $stmt = $pdo->prepare("INSERT INTO audit_trails (module, action, created_by,created_at) 
                                    VALUES (:module, :action, :created_by,:created_at)");
        $stmt->execute([':module' => 'RFID Added', ':action' => "Added RFID No. $rfid", ':created_by' => $created_by, ':created_at' => $created_at]);
        $res['msg'] = 'Record successfully Added!';
    }

    if ($action == 'update') {
        // Check if plate number already exists
        $stmt = $pdo->prepare("SELECT * FROM rfid_list WHERE rfid = :rfid AND id != :id");
        $stmt->execute([':rfid' => $rfid, ':id' => $id]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($data) {
            // http_response_code(409);
            $res['msg'] = 'RFID already exists!';
            $res['status'] = false;
            echo json_encode($res);
            exit;
        }
        $stmt = $pdo->prepare("SELECT rfid FROM rfid_list WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        $oldrfid = $data['rfid'];

        $stmt = $pdo->prepare("UPDATE rfid_list SET rfid = :rfid,
                        created_by = :created_by,
                        updated_at = :updated_at,
                        rfid = :rfid
                    WHERE id = :id");
        $stmt->execute([':id' => $id, ':created_by' => $created_by, ':updated_at' => $created_at, ':rfid' => $rfid]);

        $stmt = $pdo->prepare("UPDATE registered_plates SET rfid = :rfid
                    WHERE rfid = :oldrfid");
        $stmt->execute([':oldrfid' => $oldrfid, ':rfid' => $rfid]);

        // Insert audit trail
        $stmt = $pdo->prepare("INSERT INTO audit_trails (module, action, created_by,created_at) 
            VALUES (:module, :action, :created_by,:created_at)");
        $stmt->execute([':module' => 'Plate registration', ':action' => "Updated RFID No. $rfid", ':created_by' => $created_by, ':created_at' => $created_at]);

        $res['msg'] = 'Record successfully Updated!';
    }


    // http_response_code(201);

    $res['status'] = true;
    echo json_encode($res);
} catch (PDOException $e) {
    // http_response_code(500);
    error_log($e->getMessage());
    $res['msg'] = $e->getMessage();
    echo json_encode($res);
}
