# AddedHookStrategy

| | |
|---|---|
| **FQSEN** | `\Doc2Me\Parsers\WordPress\AddedHookStrategy` |
| **Final** | Yes |

---

## Constants

### `HOOK_FUNCTIONS`

```
['add_action', 'add_filter']
```

### `TYPE_MAP`

```
['add_action' => 'action', 'add_filter' => 'filter']
```

---

## Methods

### `public function matches()`

**Description:** Check if the object is a function call to a WordPress hook.

```
matches(\phpDocumentor\Reflection\Php\Factory\ContextStack context, object object) : bool
```

**Visibility:** public

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `context` | `\phpDocumentor\Reflection\Php\Factory\ContextStack` |  |  |
| `object` | `object` |  |  |

**Returns:** `bool`

---

### `public function create()`

**Description:** Create an added hook metadata object with all data extracted from the AST node.

```
create(\phpDocumentor\Reflection\Php\Factory\ContextStack context, object object, \phpDocumentor\Reflection\Php\StrategyContainer strategies) : void
```

**Visibility:** public

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `context` | `\phpDocumentor\Reflection\Php\Factory\ContextStack` |  |  |
| `object` | `object` |  |  |
| `strategies` | `\phpDocumentor\Reflection\Php\StrategyContainer` |  |  |

**Returns:** `void`

---

### `private function cleanupName()`

```
private cleanupName(mixed name) : mixed
```

**Visibility:** private

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `mixed` |  |  |

**Returns:** `mixed`

---

### `private function extractArgs()`

```
private extractArgs(\PhpParser\Node\Stmt\Expression expression) : array
```

**Visibility:** private

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `expression` | `\PhpParser\Node\Stmt\Expression` |  |  |

**Returns:** `array`

---

### `private function nodeToString()`

```
private nodeToString(mixed node) : string
```

**Visibility:** private

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `node` | `mixed` |  |  |

**Returns:** `string`

---

### `private function extractDocBlock()`

```
private extractDocBlock(\PhpParser\Node\Stmt\Expression expression) : ?array
```

**Visibility:** private

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `expression` | `\PhpParser\Node\Stmt\Expression` |  |  |

**Returns:** `?array`
