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
