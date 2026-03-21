
## Functions

### `function findLeadingJSDoc()`

**Description:** Find the leading JSDoc comment for an AST node.

```
findLeadingJSDoc(object node, Array comments) : string|null
```

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `node` | `object` |  | The AST node. |
| `comments` | `Array` |  | All block comments from the file. |

**Returns:** `string|null` — raw comment string or null.

### `function getDocBlock()`

**Description:** Get the docblock for an AST node.

```
getDocBlock(object node, Array comments) : { summary: string, description: string, tags: Array }|null
```

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `node` | `object` |  | The AST node. |
| `comments` | `Array` |  | All block comments. |

**Returns:** `{ summary: string, description: string, tags: Array }|null`

### `function getVisibility()`

**Description:** Get visibility from a class element node and its docblock.

```
getVisibility(object node, object|null docblock) : string
```

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `node` | `object` |  | The AST node (MethodDefinition or PropertyDefinition). |
| `docblock` | `object\|null` |  | The parsed docblock. |

**Returns:** `string` — 'private', or 'protected'.

### `function getKeyName()`

**Description:** Get the name from an AST key node.

```
getKeyName(object key) : string
```

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `key` | `object` |  | The AST key node. |

**Returns:** `string` — name.

### `function getReturnType()`

**Description:** Get the return type from a docblock.

```
getReturnType(object|null docblock) : string|null
```

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `docblock` | `object\|null` |  | The parsed docblock. |

**Returns:** `string|null`

### `function exportArguments()`

**Description:** Export function/method arguments.

```
exportArguments(Array params, object|null docblock) : Array
```

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `params` | `Array` |  | AST parameter nodes. |
| `docblock` | `object\|null` |  | Parsed docblock to get types from. |

**Returns:** `Array` — arguments.

### `function extractDefault()`

**Description:** Extract a default value as a string.

```
extractDefault(object node) : string|null
```

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `node` | `object` |  | The AST node for the default value. |

**Returns:** `string|null`

### `function exportClass()`

**Description:** Export a class declaration to structured data.

```
exportClass(object node, Array comments) : object
```

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `node` | `object` |  | ClassDeclaration AST node. |
| `comments` | `Array` |  | All comments from the file. |

**Returns:** `object` — class data.

### `function exportMethod()`

**Description:** Export a method definition to structured data.

```
exportMethod(object node, Array comments, string className = '') : object
```

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `node` | `object` |  | MethodDefinition AST node. |
| `comments` | `Array` |  | All comments from the file. |
| `className` | `string` | `''` | The owning class name. |

**Returns:** `object` — method data.

### `function exportFunction()`

**Description:** Export a function declaration to structured data.

```
exportFunction(object node, Array comments) : object
```

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `node` | `object` |  | FunctionDeclaration AST node. |
| `comments` | `Array` |  | All comments from the file. |

**Returns:** `object` — function data.

### `function exportProperty()`

**Description:** Export a property definition to structured data.

```
exportProperty(object node, Array comments, string className = '') : object
```

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `node` | `object` |  | PropertyDefinition AST node. |
| `comments` | `Array` |  | All comments from the file. |
| `className` | `string` | `''` | The owning class name. |

**Returns:** `object` — property data.

### `function exportConstant()`

**Description:** Export a top-level constant (const declaration) to structured data.

```
exportConstant(object declarator, object|null docblock, number line) : object
```

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `declarator` | `object` |  | VariableDeclarator AST node. |
| `docblock` | `object\|null` |  | Parsed docblock. |
| `line` | `number` |  | Line number. |

**Returns:** `object` — constant data.
