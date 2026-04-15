<?php

namespace Core;

use App\Providers\AppServiceProvider;
use Core\Database;
use Core\Migrator;
use Core\RouteCache;
use PDO;

class Console
{
    public static function run(array $arguments): void
    {
        $command = $arguments[1] ?? 'help';
        $params = array_slice($arguments, 2);

        switch ($command) {
            case 'make:controller':
                self::makeController($params[0] ?? '');
                break;
            case 'make:model':
                self::makeModel($params[0] ?? '');
                break;
            case 'cache:routes':
                self::cacheRoutes();
                break;
            case 'serve':
                self::serve($params[0] ?? '127.0.0.1:8000');
                break;
            case 'migrate':
                self::migrate($params[0] ?? 'up', (int) ($params[1] ?? 0));
                break;
            case 'test':
                self::runTests();
                break;
            case 'help':
            default:
                self::displayHelp();
                break;
        }
    }

    private static function makeController(string $name): void
    {
        if ($name === '') {
            self::error('Controller name is required.');
            return;
        }

        $className = ucfirst($name) . 'Controller';
        $path = __DIR__ . '/../app/Controllers/' . $className . '.php';

        if (file_exists($path)) {
            self::error("Controller {$className} already exists.");
            return;
        }

        $content = <<<PHP
<?php

namespace App\Controllers;

use Core\Controller;

class {$className} extends Controller
{
    public function index(): void
    {
        // TODO: Implement controller action.
    }
}
PHP;

        file_put_contents($path, $content);
        self::info("Created controller: {$path}");
    }

    private static function makeModel(string $name): void
    {
        if ($name === '') {
            self::error('Model name is required.');
            return;
        }

        $className = ucfirst($name) . 'Model';
        $path = __DIR__ . '/../app/Models/' . $className . '.php';

        if (file_exists($path)) {
            self::error("Model {$className} already exists.");
            return;
        }

        $content = <<<PHP
<?php

namespace App\Models;

use Core\Database;
use PDO;

class {$className}
{
    private PDO \\$db;

    public function __construct()
    {
        \\$this->db = Database::getInstance();
    }
}
PHP;

        file_put_contents($path, $content);
        self::info("Created model: {$path}");
    }

    private static function cacheRoutes(): void
    {
        $routes = RouteCache::load(__DIR__ . '/../routes.php', __DIR__ . '/../cache/routes.php', true);
        self::info('Route cache generated with ' . count($routes) . ' route groups.');
        self::info('Cache written to cache/routes.php');
    }

    private static function serve(string $address): void
    {
        self::info("Starting PHP development server at http://{$address}");
        $command = sprintf(
            'php -S %s -t public public/index.php',
            escapeshellarg($address)
        );

        passthru($command);
    }

    private static function migrate(string $direction, int $steps): void
    {
        $pdo = Database::getInstance();
        $migrator = new Migrator($pdo);

        if ($direction === 'down') {
            $rolledBack = $migrator->migrateDown($steps > 0 ? $steps : 1);
            self::info('Rolled back migrations: ' . implode(', ', $rolledBack));
            return;
        }

        $applied = $migrator->migrateUp($steps);
        self::info('Applied migrations: ' . implode(', ', $applied));
    }

    private static function runTests(): void
    {
        $files = glob(__DIR__ . '/../tests/*.php') ?: [];
        foreach ($files as $file) {
            require_once $file;
        }

        $classes = array_filter(get_declared_classes(), static fn($class) => str_ends_with($class, 'Test'));
        foreach ($classes as $class) {
            if (is_subclass_of($class, 'TestCase')) {
                $test = new $class();
                $test->run();
            }
        }

        self::info('All tests completed.');
    }

    private static function displayHelp(): void
    {
        echo "Usage:\n";
        echo "  php cli.php make:controller <name>   Create a new controller.\n";
        echo "  php cli.php make:model <name>        Create a new model.\n";
        echo "  php cli.php cache:routes            Compile and cache route metadata.\n";
        echo "  php cli.php serve [host:port]       Run PHP built-in server.\n";
        echo "  php cli.php migrate [up|down] [n]   Run migration actions.\n";
        echo "  php cli.php test                    Run the application unit tests.\n";
        echo "  php cli.php help                    Show this help screen.\n";
    }

    private static function info(string $message): void
    {
        echo "[INFO] {$message}\n";
    }

    private static function error(string $message): void
    {
        echo "[ERROR] {$message}\n";
    }
}
