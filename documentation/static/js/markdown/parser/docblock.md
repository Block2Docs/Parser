
## Functions

### `function exportDocBlock()`

**Description:** Parse a JSDoc comment string into a structured docblock object.

```
exportDocBlock(string|null commentValue) : { summary: string, description: string, tags: Array }|null
```

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `commentValue` | `string\|null` |  | The raw comment text (without leading/trailing delimiters handled by espree). |

**Returns:** `{ summary: string, description: string, tags: Array }|null`
