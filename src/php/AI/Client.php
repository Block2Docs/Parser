<?php

namespace Block2Docs\AI;

class Client
{
    private string $provider;
    private string $model;
    private string $apiKey;

    public function __construct(string $provider, string $model, string $apiKey)
    {
        $this->provider = $provider;
        $this->model = $model;
        $this->apiKey = $apiKey;
    }

    public function complete(string $prompt): string
    {
        // TODO: implement API call to AI provider
        return '';
    }
}
