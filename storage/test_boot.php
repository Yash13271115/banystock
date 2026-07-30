<?php

$_SERVER['FRANKENPHP_WORKER'] = 1;
if (!function_exists('frankenphp_handle_request')) {
    function frankenphp_handle_request($callback) {
        return false;
    }
}

try {
    require __DIR__ . '/../public/frankenphp-worker.php';
    echo "BOOT SUCCESSFUL!\n";
} catch (\Throwable $e) {
    echo "BOOT ERROR: " . $e->getMessage() . "\n" . $e->getTraceAsString() . "\n";
}
