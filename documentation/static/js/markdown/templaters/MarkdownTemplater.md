
## Functions

### `function renderDocblock()`

**Description:** Render a docblock's summary and description lines.

```
renderDocblock(object|null docblock) : string
```

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `docblock` | `object\|null` |  | The docblock object. |

**Returns:** `string` — text.

### `function findTag()`

**Description:** Find a specific tag from a docblock.

```
findTag(object|null docblock, string name) : object|null
```

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `docblock` | `object\|null` |  | The docblock object. |
| `name` | `string` |  | Tag name to find. |

**Returns:** `object|null` — first matching tag, or null.

### `function findTags()`

**Description:** Find all tags with a given name from a docblock.

```
findTags(object|null docblock, string name) : object[]
```

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `docblock` | `object\|null` |  | The docblock object. |
| `name` | `string` |  | Tag name to find. |

**Returns:** `object[]` — tags.

### `function escapeCell()`

**Description:** Escape pipe characters for use in markdown table cells.

```
escapeCell(string text) : string
```

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` |  | The text to escape. |

**Returns:** `string` — text.

### `function renderSignature()`

**Description:** Render a method or function signature.

```
renderSignature(object method) : string
```

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `method` | `object` |  | The method data. |

**Returns:** `string` — signature string.

### `function renderParamsTable()`

**Description:** Render a parameters table for arguments with docblock info.

```
renderParamsTable(object[] args, object|null docblock) : string
```

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `args` | `object[]` |  | The arguments array. |
| `docblock` | `object\|null` |  | The docblock object. |

**Returns:** `string` — table.

### `function renderConstant()`

**Description:** Render a single class constant.

```
renderConstant(object constant) : string
```

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `constant` | `object` |  | The constant data. |

**Returns:** `string` — section.

### `function renderProperty()`

**Description:** Render a single property.

```
renderProperty(object property) : string
```

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `property` | `object` |  | The property data. |

**Returns:** `string` — section.

### `function renderMethod()`

**Description:** Render a single method.

```
renderMethod(object method) : string
```

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `method` | `object` |  | The method data. |

**Returns:** `string` — section.

### `function renderFunction()`

**Description:** Render a single function (file-level).

```
renderFunction(object func) : string
```

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `func` | `object` |  | The function data. |

**Returns:** `string` — section.

### `function renderHooksSection()`

**Description:** Render hook entries from a hooks or added_hooks array.

```
renderHooksSection(object[]|object hooksList, string heading) : string
```

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `hooksList` | `object[]\|object` |  | Array of hook objects, or a legacy map keyed by hook_<line>. |
| `heading` | `string` |  | Section heading, e.g. 'Hooks' or 'Added Hooks'. |

**Returns:** `string` — section.

### `function renderClass()`

**Description:** Render a single class to Markdown.

```
renderClass(object cls) : string
```

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `cls` | `object` |  | The class data. |

**Returns:** `string` — Markdown for the class.

### `function renderFile()`

**Description:** Render a full file entry to Markdown.

```
renderFile(string fileName, object fileData) : string
```

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `fileName` | `string` |  | The file name key. |
| `fileData` | `object` |  | The parsed file data. |

**Returns:** `string` — Markdown document.

### `function renderAll()`

**Description:** Render an entire parsed JSON result (multiple files) to a map of Markdown strings.

```
renderAll(object data) : Object<string, string>
```

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `object` |  | The full parsed JSON output (keyed by filename). |

**Returns:** `Object<string, string>` — of output filename to Markdown content.
