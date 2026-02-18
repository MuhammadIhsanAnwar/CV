<?php
$host = "localhost";
$user = "neoz6813";
$password = "@Webihsananwar33";
$database = "neoz6813_portofolio";

$koneksi = @mysqli_connect($host, $user, $password, $database);

if (!$koneksi) {
    throw new Exception("Database connection failed: " . mysqli_connect_error());
}

// Set charset UTF-8
mysqli_set_charset($koneksi, "utf8");
