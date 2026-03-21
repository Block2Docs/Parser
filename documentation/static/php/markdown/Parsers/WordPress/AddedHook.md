# AddedHook

| | |
|---|---|
| **FQSEN** | `\Block2Docs\Parsers\WordPress\AddedHook` |
| **Final** | Yes |

---

## Properties

### `$line`

| | |
|---|---|
| **Type** | `int` |
| **Visibility** | private |

### `$name`

| | |
|---|---|
| **Type** | `string` |
| **Visibility** | private |

### `$type`

| | |
|---|---|
| **Type** | `string` |
| **Visibility** | private |

### `$args`

| | |
|---|---|
| **Type** | `array` |
| **Visibility** | private |

### `$docblock`

| | |
|---|---|
| **Type** | `?array` |
| **Visibility** | private |

---

## Methods

### `public function __construct()`

**Description:** Construct the added hook metadata object.

```
__construct(int line, string name, string type, array args, ?array docblock) : mixed
```

**Visibility:** public

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `line` | `int` |  | The line number of the hook call. |
| `name` | `string` |  | The hook name. |
| `type` | `string` |  | The hook type (action or filter). |
| `args` | `array` |  | The hook arguments (excluding the hook name). |
| `docblock` | `?array` |  | The parsed docblock, if any. |

**Returns:** `mixed`

---

### `public function key()`

**Description:** Get the key for the hook metadata.

```
key() : string
```

**Visibility:** public

**Returns:** `string` — The key for the hook metadata.

---

### `public function getName()`

```
getName() : mixed
```

**Visibility:** public

**Returns:** `mixed`

---

### `public function getShortName()`

```
getShortName() : mixed
```

**Visibility:** public

**Returns:** `mixed`

---

### `public function getType()`

```
getType() : mixed
```

**Visibility:** public

**Returns:** `mixed`

---

### `public function getArgs()`

```
getArgs() : mixed
```

**Visibility:** public

**Returns:** `mixed`

---

### `public function format()`

```
format() : mixed
```

**Visibility:** public

**Returns:** `mixed`

---

### `public function getDocBlock()`

```
getDocBlock() : ?array
```

**Visibility:** public

**Returns:** `?array`
