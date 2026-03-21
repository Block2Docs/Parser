import { exportDocBlock } from './docblock.js';
import { extractHooks } from './hooks.js';

/**
 * Find the leading JSDoc comment for an AST node.
 *
 * @param {object} node The AST node.
 * @param {Array} comments All block comments from the file.
 * @return {string|null} The raw comment string or null.
 */
export function findLeadingJSDoc(node, comments) {
	const nodeLine = node.loc.start.line;

	for (let i = comments.length - 1; i >= 0; i--) {
		const comment = comments[i];
		if (comment.type === 'Block' && comment.value.startsWith('*')) {
			const commentEndLine = comment.loc.end.line;
			if (
				commentEndLine === nodeLine - 1 ||
				commentEndLine === nodeLine
			) {
				return `/*${comment.value}*/`;
			}
		}
	}
	return null;
}

/**
 * Get the docblock for an AST node.
 *
 * @param {object} node The AST node.
 * @param {Array} comments All block comments.
 * @return {{ summary: string, description: string, tags: Array }|null}
 */
function getDocBlock(node, comments) {
	const raw = findLeadingJSDoc(node, comments);
	return exportDocBlock(raw);
}

/**
 * Get visibility from a class element node and its docblock.
 *
 * @param {object} node The AST node (MethodDefinition or PropertyDefinition).
 * @param {object|null} docblock The parsed docblock.
 * @return {string} 'public', 'private', or 'protected'.
 */
function getVisibility(node, docblock) {
	// ES2022 private fields/methods use # prefix.
	if (node.key && node.key.type === 'PrivateIdentifier') {
		return 'private';
	}

	// Check JSDoc tags.
	if (docblock && docblock.tags) {
		for (const tag of docblock.tags) {
			if (tag.name === 'private') {
				return 'private';
			}
			if (tag.name === 'protected') {
				return 'protected';
			}
			if (tag.name === 'public') {
				return 'public';
			}
			if (tag.name === 'access' && tag.description) {
				return tag.description.trim();
			}
		}
	}

	return 'public';
}

/**
 * Get the name from an AST key node.
 *
 * @param {object} key The AST key node.
 * @return {string} The name.
 */
function getKeyName(key) {
	if (key.type === 'PrivateIdentifier') {
		return `#${key.name}`;
	}
	if (key.type === 'Identifier') {
		return key.name;
	}
	if (key.type === 'Literal') {
		return String(key.value);
	}
	return '<computed>';
}

/**
 * Get the return type from a docblock.
 *
 * @param {object|null} docblock The parsed docblock.
 * @return {string|null}
 */
function getReturnType(docblock) {
	if (!docblock || !docblock.tags) {
		return null;
	}
	const returnTag = docblock.tags.find((t) => t.name === 'return');
	return returnTag ? returnTag.type || null : null;
}

/**
 * Export function/method arguments.
 *
 * @param {Array} params AST parameter nodes.
 * @param {object|null} docblock Parsed docblock to get types from.
 * @return {Array} Structured arguments.
 */
export function exportArguments(params, docblock) {
	const paramTypes = {};
	if (docblock && docblock.tags) {
		for (const tag of docblock.tags) {
			if (tag.name === 'param' && tag.variable) {
				paramTypes[tag.variable] = tag.type || null;
			}
		}
	}

	return params.map((param) => {
		let name;
		let defaultValue = null;
		let variadic = false;

		if (param.type === 'AssignmentPattern') {
			name =
				param.left.type === 'Identifier'
					? param.left.name
					: '<destructured>';
			defaultValue = extractDefault(param.right);
		} else if (param.type === 'RestElement') {
			name =
				param.argument.type === 'Identifier'
					? param.argument.name
					: '<destructured>';
			variadic = true;
		} else if (param.type === 'Identifier') {
			name = param.name;
		} else {
			name = '<destructured>';
		}

		return {
			name,
			type: paramTypes[name] || null,
			default: defaultValue,
			by_reference: false,
			variadic,
		};
	});
}

/**
 * Extract a default value as a string.
 *
 * @param {object} node The AST node for the default value.
 * @return {string|null}
 */
function extractDefault(node) {
	if (!node) {
		return null;
	}
	if (node.type === 'Literal') {
		return node.raw;
	}
	if (node.type === 'Identifier') {
		return node.name;
	}
	if (node.type === 'ArrayExpression') {
		return '[]';
	}
	if (node.type === 'ObjectExpression') {
		return '{}';
	}
	if (
		node.type === 'UnaryExpression' &&
		node.operator === '-' &&
		node.argument.type === 'Literal'
	) {
		return `-${node.argument.raw}`;
	}
	return null;
}

/**
 * Export a class declaration to structured data.
 *
 * @param {object} node ClassDeclaration AST node.
 * @param {Array} comments All comments from the file.
 * @return {object} Structured class data.
 */
export function exportClass(node, comments) {
	const docblock = getDocBlock(node, comments);
	const className = node.id ? node.id.name : '<anonymous>';

	const data = {
		name: className,
		fqsen: `\\${className}`,
		line: node.loc.start.line,
		end_line: node.loc.end.line,
		docblock,
		final: false,
		abstract: false,
		parent: node.superClass ? node.superClass.name || null : null,
		methods: [],
		properties: [],
		constants: [],
	};

	for (const element of node.body.body) {
		if (element.type === 'MethodDefinition') {
			const method = exportMethod(element, comments, className);
			data.methods.push(method);
		} else if (element.type === 'PropertyDefinition') {
			const prop = exportProperty(element, comments, className);

			// If static with a literal value and UPPER_CASE name, treat as constant.
			const name = getKeyName(element.key);
			if (element.static && /^[A-Z_][A-Z0-9_]*$/.test(name)) {
				data.constants.push({
					name,
					fqsen: `\\${className}::${name}`,
					line: element.loc.start.line,
					docblock: prop.docblock,
					value: prop.default,
				});
			} else {
				data.properties.push(prop);
			}
		}
	}

	return data;
}

/**
 * Export a method definition to structured data.
 *
 * @param {object} node MethodDefinition AST node.
 * @param {Array} comments All comments from the file.
 * @param {string} className The owning class name.
 * @return {object} Structured method data.
 */
export function exportMethod(node, comments, className = '') {
	const docblock = getDocBlock(node, comments);
	const name = getKeyName(node.key);
	const fqsen = className ? `\\${className}::${name}()` : name;

	let hooks = [];
	let addedHooks = [];

	if (node.value && node.value.body && node.value.body.body) {
		const extracted = extractHooks(node.value.body.body, comments);
		hooks = Object.values(extracted.hooks).flat();
		addedHooks = Object.values(extracted.addedHooks).flat();
	}

	return {
		name,
		fqsen,
		line: node.loc.start.line,
		end_line: node.loc.end.line,
		docblock,
		abstract: false,
		final: false,
		static: node.static || false,
		visibility: getVisibility(node, docblock),
		return_type: getReturnType(docblock),
		arguments: exportArguments(node.value.params, docblock),
		hooks,
		added_hooks: addedHooks,
	};
}

/**
 * Export a function declaration to structured data.
 *
 * @param {object} node FunctionDeclaration AST node.
 * @param {Array} comments All comments from the file.
 * @return {object} Structured function data.
 */
export function exportFunction(node, comments) {
	const docblock = getDocBlock(node, comments);
	const name = node.id ? node.id.name : '<anonymous>';

	return {
		name,
		fqsen: `\\${name}()`,
		line: node.loc.start.line,
		end_line: node.loc.end.line,
		docblock,
		return_type: getReturnType(docblock),
		arguments: exportArguments(node.params, docblock),
	};
}

/**
 * Export a property definition to structured data.
 *
 * @param {object} node PropertyDefinition AST node.
 * @param {Array} comments All comments from the file.
 * @param {string} className The owning class name.
 * @return {object} Structured property data.
 */
export function exportProperty(node, comments, className = '') {
	const docblock = getDocBlock(node, comments);
	const name = getKeyName(node.key);
	const fqsen = className ? `\\${className}::$${name}` : name;

	let type = null;
	if (docblock && docblock.tags) {
		const typeTag = docblock.tags.find((t) => t.name === 'type');
		if (typeTag) {
			type = typeTag.type || null;
		}
	}

	return {
		name,
		fqsen,
		line: node.loc.start.line,
		docblock,
		static: node.static || false,
		visibility: getVisibility(node, docblock),
		type,
		default: node.value ? extractDefault(node.value) : null,
	};
}

/**
 * Export a top-level constant (const declaration) to structured data.
 *
 * @param {object} declarator VariableDeclarator AST node.
 * @param {object|null} docblock Parsed docblock.
 * @param {number} line Line number.
 * @return {object} Structured constant data.
 */
export function exportConstant(declarator, docblock, line) {
	const name =
		declarator.id.type === 'Identifier'
			? declarator.id.name
			: '<destructured>';

	return {
		name,
		fqsen: `\\${name}`,
		line,
		docblock,
		value: declarator.init ? extractDefault(declarator.init) : null,
	};
}
