<?php

namespace Api;

require_once __DIR__ . '/../app/Services/AuthService.php';
require_once __DIR__ . '/../core/ApiResponse.php';
require_once __DIR__ . '/../core/Validator.php';

use App\Services\AuthService;
use Core\ApiResponse;
use Core\Validator;

class BaseController
{
    protected AuthService $authService;

    public function __construct()
    {
        $this->authService = new AuthService();
    }

    protected function success($data, string $message = '', int $code = 200, array $meta = []): void
    {
        ApiResponse::success($data, $message, $code, $meta);
    }

    protected function error(string $message, int $code = 400, array $errors = [], array $meta = []): void
    {
        ApiResponse::error($message, $code, $errors, $meta);
    }

    protected function getUser(): ?array
    {
        return $this->authService->getUser();
    }

    protected function authorize(array $roles = []): array
    {
        $user = $this->getUser();
        if ($user === null) {
            $this->error('Unauthorized.', 401);
        }

        if (!empty($roles) && !$this->authService->checkRole($roles)) {
            $this->error('Forbidden.', 403);
        }

        return $user;
    }

    protected function validate(array $data, array $rules): Validator
    {
        $validator = new Validator($data);

        foreach ($rules as $field => $fieldRules) {
            $ruleList = is_array($fieldRules) ? $fieldRules : explode('|', $fieldRules);

            foreach ($ruleList as $rule) {
                $rule = trim($rule);

                if ($rule === 'required') {
                    $validator->required([$field]);
                }

                if ($rule === 'email') {
                    $validator->email($field);
                }
            }
        }

        if ($validator->getErrors()) {
            $this->error($validator->getFirstError() ?? 'Validation failed.', 422, $validator->getErrors());
        }

        return $validator;
    }
}
