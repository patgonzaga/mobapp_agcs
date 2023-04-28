<?php
require_once('db-conn.php');

// Function to generate OTP code
function generateOTP()
{
    $otp = rand(100000, 999999);
    return $otp;
}

// Function to send OTP code via email
function sendOTP($email, $otp)
{
    $subject = 'Password Reset Code';
    $message = 'Your Password Reset code is: ' . $otp;
    $headers = 'From: agcs.email@gmail.com' . "\r\n" .
        'Reply-To: agcs.email@gmail.com' . "\r\n" .
        'X-Mailer: PHP/' . phpversion();

    return mail($email, $subject, $message, $headers);
}

// Check if email is provided in the API request
if (isset($_GET['email'])) {
    $email = $_GET['email'];

    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email");
    $stmt->execute([':email' => $email]);
    $data = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($data) {

        // Generate OTP code
        $otp = generateOTP();

        // Send OTP code via email
        if (sendOTP($email, $otp)) {

            $stmt = $pdo->prepare("UPDATE users SET password_token = :otp WHERE email = :email");
            $stmt->execute([':otp' => $otp, ':email' => $email]);


            $res['msg'] = 'Password reset code sent to email';
            $res['status'] = true;
            echo json_encode($res);
        } else {

            $res['msg'] = 'Failed to send Password reset code to email';
            $res['status'] = false;
            echo json_encode($res);
        }
    } else {
        $res['msg'] = 'Invalid Email';
        $res['status'] = false;
        echo json_encode($res);
    }
} else {
    // Return error response if email is not provided in the API request

    $res['msg'] = 'Email is required';
    $res['status'] = false;
    echo json_encode($res);
}
