<?php

namespace Core;

class Controller
{
    protected function view(string $view, array $data = [], ?string $layout = null): void
    {
        extract($data, EXTR_SKIP);
        $viewPath = __DIR__ . '/../app/Views/' . $view . '.php';

        if (!file_exists($viewPath)) {
            throw new \RuntimeException("View not found: $view");
        }

        if ($layout) {
            ob_start();
            require $viewPath;
            $content = ob_get_clean();
            require __DIR__ . '/../app/Views/' . $layout . '.php';
            return;
        }

        require $viewPath;
    }
}
