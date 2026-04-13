<?php
http_response_code(410);
header('Content-Type: application/json');
echo json_encode(['message' => 'This cart API endpoint is deprecated. The repair-only website no longer supports accessory checkout.']);
exit;
