# JsFileParser

| | |
|---|---|
| **FQSEN** | `\JsFileParser` |

---

## Methods

### `public function parseDirectory()`

**Description:** Parse all JS files in a directory and return structured documentation data.

```
parseDirectory(string directory) : Object<string, object>
```

**Visibility:** public

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `directory` | `string` |  | The directory to parse. |

**Returns:** `Object<string, object>` — file data keyed by relative path.

---

### `public function parseFile()`

**Description:** Parse a single JS file.

```
parseFile(string filePath) : object
```

**Visibility:** public

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `filePath` | `string` |  | Absolute path to the JS file. |

**Returns:** `object` — documentation data.

---

### `public function exportFile()`

**Description:** Convert a parsed AST to the output structure.

```
exportFile(object ast, string filePath) : object
```

**Visibility:** public

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `ast` | `object` |  | The espree AST. |
| `filePath` | `string` |  | The file path. |

**Returns:** `object` — file data.

---

### `public function exportDeclaration()`

**Description:** Handle an exported declaration.

```
exportDeclaration(object decl, object exportNode, object data, Array comments)
```

**Visibility:** public

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `decl` | `object` |  | The declaration node. |
| `exportNode` | `object` |  | The export statement node (for location/comments). |
| `data` | `object` |  | The file data being built. |
| `comments` | `Array` |  | All comments. |

---

### `public function getFileDocBlock()`

**Description:** Get the file-level docblock (first comment in the file if it's a JSDoc block).

```
getFileDocBlock(object ast, Array comments) : object|null
```

**Visibility:** public

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `ast` | `object` |  | The parsed AST. |
| `comments` | `Array` |  | All comments. |

**Returns:** `object|null` — docblock or null.

---

### `public function findJsFiles()`

**Description:** Find all JS files in a directory recursively.

```
findJsFiles(string directory) : string[]
```

**Visibility:** public

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `directory` | `string` |  | The directory to search. |

**Returns:** `string[]` — of absolute file paths.

---

### `public function walkDirectory()`

**Description:** Recursively walk a directory collecting .js files.

```
walkDirectory(string dir, string[] files)
```

**Visibility:** public

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `dir` | `string` |  | The directory to walk. |
| `files` | `string[]` |  | Accumulator for file paths. |

---

### `public function relativePath()`

**Description:** Get the relative path of a file.

```
relativePath(string filePath, string basePath) : string
```

**Visibility:** public

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `filePath` | `string` |  | The absolute file path. |
| `basePath` | `string` |  | The base directory path. |

**Returns:** `string` — relative path.
