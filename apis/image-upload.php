<?php
require_once('db-conn.php');

$userId = $_POST['userId'] ?? '';
$username_ = $_POST['username'] ?? '';
$email = $_POST['email'] ?? '';
$created_by = $_POST['username'] ?? '';
$updated_at = date('Y-m-d H:i:s');
$img = null;
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

  $stmt = $pdo->prepare("SELECT * FROM users WHERE username = :username AND id != :id");
  $stmt->execute([':username' => $username_, ':id' => $userId]);
  $data = $stmt->fetch(PDO::FETCH_ASSOC);

  if ($data) {
    $res['msg'] = 'Username already exist!';
    $res['status'] = false;
    echo json_encode($res);
    exit;
  }

  $stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email AND id != :id");
  $stmt->execute([':email' => $email, ':id' => $userId]);
  $data = $stmt->fetch(PDO::FETCH_ASSOC);

  if ($data) {
    $res['msg'] = 'Email already exist!';
    $res['status'] = false;
    echo json_encode($res);
    exit;
  }

  if (isset($_FILES['image'])) {
    $file = $_FILES['image'];

    $fileName = $file['name'];
    $fileTmpName = $file['tmp_name'];
    $fileType = $file['type'];
    $fileSize = $file['size'];



    // Set the maximum file size in bytes
    $maxFileSize = 1000000; // 1 MB

    // Check if the file size is within the limit
    if ($fileSize > $maxFileSize) {
      $res['msg'] = 'File size is too large!';
      $res['status'] = false;
      echo json_encode($res);
      exit();
    }

    // Load the image
    $image = imagecreatefromstring(file_get_contents($fileTmpName));

    // Resize the image to a maximum width and height of 500 pixels
    $width = imagesx($image);
    $height = imagesy($image);
    $maxWidth = 500;
    $maxHeight = 500;
    $newWidth = $width;
    $newHeight = $height;

    if ($width > $maxWidth) {
      $newWidth = $maxWidth;
      $newHeight = $height * ($maxWidth / $width);
    }

    if ($newHeight > $maxHeight) {
      $newWidth = $newWidth * ($maxHeight / $newHeight);
      $newHeight = $maxHeight;
    }

    $resizedImage = imagecreatetruecolor($newWidth, $newHeight);
    imagecopyresampled($resizedImage, $image, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);


    $uploadDir = 'uploads/';
    $uploadPath = $uploadDir . $userId . basename($fileName);

    $img = 'https://agcsweb.online/uploads/' . $userId . basename($fileName);

    if (move_uploaded_file($fileTmpName, $uploadPath)) {



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
    } else {
      $res['msg'] = 'User information failed to update!';
      $res['status'] = false;
      echo json_encode($res);
    }
  } else {
    $stmt = $pdo->prepare("UPDATE users SET username = :username, email = :email,
    updated_at = :updated_at WHERE id = :id");
    $stmt->execute([':id' => $userId, ':updated_at' => $updated_at, ':username' => $username_, ':email' => $email]);

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
  }
} catch (PDOException $e) {
  // http_response_code(500);
  error_log($e->getMessage());
  $res['msg'] = $e->getMessage();
  echo json_encode($res);
}
