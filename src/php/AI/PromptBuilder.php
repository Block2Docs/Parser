<?php

namespace Block2Docs\AI;

class PromptBuilder
{
    private string $promptsDir;

    public function __construct(string $promptsDir)
    {
        $this->promptsDir = $promptsDir;
    }

    public function build(string $templateName, array $variables): string
    {
        $template = file_get_contents($this->promptsDir . '/' . $templateName . '.txt');
        foreach ($variables as $key => $value) {
            $template = str_replace('{{' . $key . '}}', $value, $template);
        }
        return $template;
    }
}
