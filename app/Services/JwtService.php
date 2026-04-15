<?php

namespace App\Services;

use Core\Config;

class JwtService
{
    private string $secret;
    private int $ttl;

    public function __construct(Config $config)
    {
        $this->secret = (string) $config->get('jwt.secret', 'change-me-secret');
        $this->ttl = (int) $config->get('jwt.ttl', 3600);
    }

    public function issue(array $payload): string
    {
        $header = ['typ' => 'JWT', 'alg' => 'HS256'];
        $payload = array_merge($payload, [
            'iat' => time(),
            'exp' => time() + $this->ttl,
        ]);

        $segments = [
            $this->base64UrlEncode(json_encode($header, JSON_UNESCAPED_SLASHES)),
            $this->base64UrlEncode(json_encode($payload, JSON_UNESCAPED_SLASHES)),
        ];

        $signature = $this->sign(implode('.', $segments));
        $segments[] = $this->base64UrlEncode($signature);

        return implode('.', $segments);
    }

    public function verify(string $token): ?array
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }

        [$header, $payload, $signature] = $parts;
        $expected = $this->base64UrlEncode($this->sign($header . '.' . $payload));

        if (!hash_equals($expected, $signature)) {
            return null;
        }

        $payload = json_decode($this->base64UrlDecode($payload), true);
        if (!is_array($payload) || isset($payload['exp']) && time() >= $payload['exp']) {
            return null;
        }

        return $payload;
    }

    private function sign(string $data): string
    {
        return hash_hmac('sha256', $data, $this->secret, true);
    }

    private function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private function base64UrlDecode(string $data): string
    {
        $padding = 4 - (strlen($data) % 4);
        if ($padding < 4) {
            $data .= str_repeat('=', $padding);
        }

        return base64_decode(strtr($data, '-_', '+/')) ?: '';
    }
}
