# PhpFileParser

| | |
|---|---|
| **FQSEN** | `\Block2Docs\Parsers\PhpFileParser` |

---

## Properties

### `$factory`

The project factory.

| | |
|---|---|
| **Type** | `\phpDocumentor\Reflection\Php\ProjectFactory` |
| **Visibility** | private |

---

## Methods

### `public function __construct()`

**Description:** Constructor.

```
__construct() : mixed
```

**Visibility:** public

**Returns:** `mixed`

---

### `public function parseDirectory()`

**Description:** Parse all PHP files in a directory and return structured documentation data.

```
parseDirectory(string directory) : array
```

**Visibility:** public

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `directory` | `string` |  | The directory to parse. |

**Returns:** `array`

---

### `public function parseFile()`

**Description:** Parse a single PHP file.

```
parseFile(string filePath) : array
```

**Visibility:** public

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `filePath` | `string` |  |  |

**Returns:** `array`

---

### `private function findPhpFiles()`

**Description:** Find PHP files in a directory.

```
private findPhpFiles(string directory) : array
```

**Visibility:** private

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `directory` | `string` |  | The directory to search. |

**Returns:** `array`

---

### `private function exportFile()`

**Description:** Export a PHP file to a structured array.

```
private exportFile(\phpDocumentor\Reflection\Php\File file) : array
```

**Visibility:** private

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `file` | `\phpDocumentor\Reflection\Php\File` |  | The PHP file to export. |

**Returns:** `array`

---

### `private function exportClass()`

**Description:** Export a class to a structured array.

```
private exportClass(\phpDocumentor\Reflection\Php\Class_ class) : array
```

**Visibility:** private

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `class` | `\phpDocumentor\Reflection\Php\Class_` |  | The class to export. |

**Returns:** `array`

---

### `private function exportInterface()`

**Description:** Export an interface to a structured array.

```
private exportInterface(\phpDocumentor\Reflection\Php\Interface_ interface) : array
```

**Visibility:** private

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `interface` | `\phpDocumentor\Reflection\Php\Interface_` |  | The interface to export. |

**Returns:** `array`

---

### `private function exportTrait()`

**Description:** Export a trait to a structured array.

```
private exportTrait(\phpDocumentor\Reflection\Php\Trait_ trait) : array
```

**Visibility:** private

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `trait` | `\phpDocumentor\Reflection\Php\Trait_` |  | The trait to export. |

**Returns:** `array`

---

### `private function exportEnum()`

**Description:** Export an enum to a structured array.

```
private exportEnum(\phpDocumentor\Reflection\Php\Enum_ enum) : array
```

**Visibility:** private

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `enum` | `\phpDocumentor\Reflection\Php\Enum_` |  | The enum to export. |

**Returns:** `array`

---

### `private function exportFunction()`

**Description:** Export a function to a structured array.

```
private exportFunction(\phpDocumentor\Reflection\Php\Function_ function) : array
```

**Visibility:** private

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `function` | `\phpDocumentor\Reflection\Php\Function_` |  | The function to export. |

**Returns:** `array`

---

### `private function exportMethod()`

**Description:** Export a method to a structured array.

```
private exportMethod(\phpDocumentor\Reflection\Php\Method method) : array
```

**Visibility:** private

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `method` | `\phpDocumentor\Reflection\Php\Method` |  | The method to export. |

**Returns:** `array`

---

### `private function exportProperty()`

**Description:** Export a property to a structured array.

```
private exportProperty(\phpDocumentor\Reflection\Php\Property property) : array
```

**Visibility:** private

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `property` | `\phpDocumentor\Reflection\Php\Property` |  | The property to export. |

**Returns:** `array`

---

### `private function exportConstant()`

**Description:** Export a constant to a structured array.

```
private exportConstant(\phpDocumentor\Reflection\Php\Constant constant) : array
```

**Visibility:** private

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `constant` | `\phpDocumentor\Reflection\Php\Constant` |  | The constant to export. |

**Returns:** `array`

---

### `private function exportArguments()`

**Description:** Export arguments to a structured array.

```
private exportArguments(array arguments) : array
```

**Visibility:** private

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `arguments` | `array` |  |  |

**Returns:** `array`

---

### `private function exportDocBlock()`

**Description:** Export a docblock to a structured array.

```
private exportDocBlock(?\phpDocumentor\Reflection\DocBlock docblock) : ?array
```

**Visibility:** private

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `docblock` | `?\phpDocumentor\Reflection\DocBlock` |  | The docblock to export. |

**Returns:** `?array`

---

### `private function exportHooks()`

**Description:** Export the called hooks to a structured array.

```
private exportHooks(\phpDocumentor\Reflection\Php\Method method) : array
```

**Visibility:** private

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `method` | `\phpDocumentor\Reflection\Php\Method` |  | The method in which the hooks are called. |

**Returns:** `array` — The formattedcalled hooks.

---

### `private function exportAddedHooks()`

**Description:** Export the added hooks to a structured array.

```
private exportAddedHooks(\phpDocumentor\Reflection\Php\Method method) : array
```

**Visibility:** private

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `method` | `\phpDocumentor\Reflection\Php\Method` |  | The method in which the hooks are added. |

**Returns:** `array` — The formatted added hooks.

---

### `private function relativePath()`

**Description:** Get the relative path of a file.

```
private relativePath(string filePath, string basePath) : string
```

**Visibility:** private

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `filePath` | `string` |  | The path to the file. |
| `basePath` | `string` |  | The base path to compare against. |

**Returns:** `string`
