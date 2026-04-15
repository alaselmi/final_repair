<?php

namespace Core;

use Core\HttpException;

abstract class FormRequest
{
    protected Request $request;
    protected Validator $validator;
    protected array $validated = [];

    public function __construct(Request $request = null)
    {
        $this->request = $request ?? Request::fromGlobals();
        $this->validator = new Validator($this->request->all());

        if (!$this->authorize()) {
            throw new HttpException('Unauthorized request.', 403);
        }

        $this->validate();
    }

    abstract public function rules(): array;

    public function authorize(): bool
    {
        return true;
    }

    public function validate(): void
    {
        $rules = $this->rules();
        foreach ($rules as $field => $fieldRules) {
            $ruleList = is_array($fieldRules) ? $fieldRules : explode('|', $fieldRules);
            foreach ($ruleList as $rule) {
                $rule = trim($rule);
                if ($rule === 'required') {
                    $this->validator->required([$field]);
                    continue;
                }
                if ($rule === 'email') {
                    $this->validator->email($field);
                    continue;
                }
                if (str_starts_with($rule, 'min:')) {
                    $limit = (int) substr($rule, 4);
                    $this->validator->min($field, $limit);
                    continue;
                }
                if (str_starts_with($rule, 'max:')) {
                    $limit = (int) substr($rule, 4);
                    $this->validator->max($field, $limit);
                    continue;
                }
                if (str_starts_with($rule, 'in:')) {
                    $options = explode(',', substr($rule, 3));
                    $options = array_map('trim', $options);
                    $this->validator->in($field, $options);
                    continue;
                }
            }
        }

        if ($this->validator->getErrors()) {
            throw new HttpException('Validation failed.', 422, $this->validator->getErrors());
        }

        $this->validated = array_intersect_key($this->request->all(), $rules);
    }

    public function validated(): array
    {
        return $this->validated;
    }

    public function all(): array
    {
        return array_merge($this->request->getQuery(), $this->request->getBody(), $this->request->getRouteParams());
    }

    public function get(string $key, $default = null)
    {
        return $this->request->get($key, $default);
    }
}
