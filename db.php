<?php
$host = "localhost";
$dbname = "agustusan";     // ganti dengan nama database kamu
$username = "root";      // ganti sesuai server lokal kamu
$password = "";          // kalau pakai XAMPP biasanya kosong

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    // Aktifkan error mode agar mudah debug
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Koneksi database gagal: " . $e->getMessage());
}
