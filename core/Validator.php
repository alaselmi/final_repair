<?php

namespace Core;

class Validator
{
    private array $data;
    private array $errors = [];

    public function __construct(array $data = [])
    {
        $this->data = $data;
    }

    public function required(array $fields): bool
    {
        foreach ($fields as $field) {
            $value = trim((string) ($this->data[$field] ?? ''));
            if ($value === '') {
                $this->errors[$field] = ucfirst($field) . ' is required.';
            }
        }

        return empty($this->errors);
    }

    public function email(string $field): bool
    {
        $value = trim((string) ($this->data[$field] ?? ''));

        if ($value === '' || !filter_var($value, FILTER_VALIDATE_EMAIL)) {
            $this->errors[$field] = 'Please enter a valid email address.';
            return false;
        }

        return true;
    }

    public function string(string $field): bool
    {
        if (!isset($this->data[$field]) || !is_string($this->data[$field])) {
            $this->errors[$field] = ucfirst($field) . ' must be a string.';
            return false;
        }

        return true;
    }

    public function numeric(string $field): bool
    {
        if (!isset($this->data[$field]) || !is_numeric($this->data[$field])) {
            $this->errors[$field] = ucfirst($field) . ' must be a number.';
            return false;
        }

        return true;
    }

    public function min(string $field, int $limit): bool
    {
        $value = $this->data[$field] ?? null;
        if ($value === null || mb_strlen((string) $value) < $limit) {
            $this->errors[$field] = ucfirst($field) . " must be at least {$limit} characters.";
            return false;
        }

        return true;
    }

    public function max(string $field, int $limit): bool
    {
        $value = $this->data[$field] ?? null;
        if ($value !== null && mb_strlen((string) $value) > $limit) {
            $this->errors[$field] = ucfirst($field) . " may not exceed {$limit} characters.";
            return false;
        }

        return true;
    }

    public function in(string $field, array $values): bool
    {
        if (!isset($this->data[$field]) || !in_array($this->data[$field], $values, true)) {
            $this->errors[$field] = ucfirst($field) . ' has an invalid value.';
            return false;
        }

        return true;
    }

    public function sanitize(string $field): string
    {
        return htmlspecialchars(trim((string) ($this->data[$field] ?? '')), ENT_QUOTES, 'UTF-8');
    }

    public function getErrors(): array
    {
        return $this->errors;
    }

    public function getFirstError(): ?string
    {
        return empty($this->errors) ? null : reset($this->errors);
    }
}
