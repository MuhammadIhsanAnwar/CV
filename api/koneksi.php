<?php
$host = "localhost";
$user = "neoz6813_";
$password = "@webihsananwar3";
$database = "neoz6813_portofolio";

$koneksi = mysqli_connect($host, $user, $password, $database);

if (!$koneksi) {
    die("Koneksi gagal: " . mysqli_connect_error());
}

// Set charset UTF-8
mysqli_set_charset($koneksi, "utf8");
?>