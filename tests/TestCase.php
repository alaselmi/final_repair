<?php

abstract class TestCase
{
    protected int $assertions = 0;
    protected array $errors = [];

    public function run(): void
    {
        foreach (get_class_methods($this) as $method) {
            if (str_starts_with($method, 'test')) {
                try {
                    $this->{$method}();
                    echo "[PASS] {$method}\n";
                } catch (\Throwable $exception) {
                    $this->errors[] = "{$method}: {$exception->getMessage()}";
                    echo "[FAIL] {$method} - {$exception->getMessage()}\n";
                }
            }
        }

        if (!empty($this->errors)) {
            throw new \RuntimeException('Test suite failed.');
        }
    }

    protected function assertTrue(bool $condition, string $message = 'Assertion failed.'): void
    {
        $this->assertions++;
        if (!$condition) {
            throw new \RuntimeException($message);
        }
    }

    protected function assertEquals($expected, $actual, string $message = ''): void
    {
        $this->assertions++;
        if ($expected !== $actual) {
            throw new \RuntimeException($message ?: "Expected " . var_export($expected, true) . " but got " . var_export($actual, true) . ".");
        }
    }
}
