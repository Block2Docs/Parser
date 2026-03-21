
## Functions

### `function matchCallee()`

**Description:** Check whether a CallExpression callee matches a hook function name.

Supports bare calls like `doAction(...)` and member calls like `wp.hooks.doAction(...)`.

```
matchCallee(object callee, Set<string> nameSet) : string|null
```

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `callee` | `object` |  | The AST callee node. |
| `nameSet` | `Set<string>` |  | Set of function names to match. |

**Returns:** `string|null` — matched function name, or null.

### `function getHookType()`

**Description:** Get the hook type from the function name.

```
getHookType(string fnName) : string
```

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `fnName` | `string` |  | The function name. |

**Returns:** `string` — or 'filter'.

### `function extractHookName()`

**Description:** Extract the hook name from the first argument of a call expression.

```
extractHookName(object node) : string
```

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `node` | `object` |  | The first argument AST node. |

**Returns:** `string` — hook name string.

### `function findLeadingComment()`

**Description:** Find the leading JSDoc comment for a given line from the comments array.

```
findLeadingComment(Array comments, number line) : string|null
```

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `comments` | `Array` |  | All block comments from the file. |
| `line` | `number` |  | The line number of the node. |

**Returns:** `string|null` — comment value or null.

### `function extractHooks()`

**Description:** Extract WordPress hooks from an array of AST statements.

```
extractHooks(Array body, Array comments) : { hooks: Object, addedHooks: Object }
```

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `body` | `Array` |  | The array of statement nodes to search. |
| `comments` | `Array` |  | All comments from the file. |

**Returns:** `{ hooks: Object, addedHooks: Object }` — hooks keyed by hook_{line}.

### `function walkStatements()`

**Description:** Recursively walk statements looking for expression statements containing calls.

```
walkStatements(Array nodes, Function callback)
```

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `nodes` | `Array` |  | AST nodes to walk. |
| `callback` | `Function` |  | Called for each statement node. |

---

## Constants

### `HOOK_FUNCTIONS`

Names of WordPress hook-dispatching functions (do/apply).

### `ADDED_HOOK_FUNCTIONS`

Names of WordPress hook-registering functions (add).
