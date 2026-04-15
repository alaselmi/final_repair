<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 2rem; background: #f8f9fa; color: #333; }
        .container { max-width: 700px; margin: 0 auto; background: #fff; padding: 2rem; border-radius: 8px; box-shadow: 0 0 20px rgba(0,0,0,0.05); }
        h1 { margin-top: 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Application Error</h1>
        <p><?= $errorMessage ?></p>
    </div>
</body>
</html>
