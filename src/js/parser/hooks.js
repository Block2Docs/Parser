import { exportDocBlock } from './docblock.js';

/**
 * Names of WordPress hook-dispatching functions (do/apply).
 */
const HOOK_FUNCTIONS = new Set([
	'createHooks',
	'doAction',
	'doActionAsync',
	'applyFilters',
	'applyFiltersAsync',
]);

/**
 * Names of WordPress hook-registering functions (add).
 */
const ADDED_HOOK_FUNCTIONS = new Set([
	'addAction',
	'addFilter',
	'removeAction',
	'removeFilter',
	'removeAllActions',
	'removeAllFilters',
]);

/**
 * Check whether a CallExpression callee matches a hook function name.
 *
 * Supports bare calls like `doAction(...)` and member calls like `wp.hooks.doAction(...)`.
 *
 * @param {object} callee The AST callee node.
 * @param {Set<string>} nameSet Set of function names to match.
 * @return {string|null} The matched function name, or null.
 */
function matchCallee(callee, nameSet) {
	// Bare identifier: doAction('hook')
	if (callee.type === 'Identifier' && nameSet.has(callee.name)) {
		return callee.name;
	}

	// Member expression: wp.hooks.doAction('hook')
	if (
		callee.type === 'MemberExpression' &&
		callee.property.type === 'Identifier' &&
		nameSet.has(callee.property.name)
	) {
		return callee.property.name;
	}

	return null;
}

/**
 * Get the hook type from the function name.
 *
 * @param {string} fnName The function name.
 * @return {string} 'action' or 'filter'.
 */
function getHookType(fnName) {
	if (fnName === 'doAction' || fnName === 'addAction') {
		return 'action';
	}
	return 'filter';
}

/**
 * Extract the hook name from the first argument of a call expression.
 *
 * @param {object} node The first argument AST node.
 * @return {string} The hook name string.
 */
function extractHookName(node) {
	if (node.type === 'Literal') {
		return String(node.value);
	}

	if (node.type === 'TemplateLiteral') {
		// Build a representation like "pre_option_{option}"
		let result = '';
		for (let i = 0; i < node.quasis.length; i++) {
			result += node.quasis[i].value.cooked || '';
			if (i < node.expressions.length) {
				const expr = node.expressions[i];
				const name = expr.type === 'Identifier' ? expr.name : '...';
				result += `{${name}}`;
			}
		}
		return result;
	}

	return '<dynamic>';
}

/**
 * Find the leading JSDoc comment for a given line from the comments array.
 *
 * @param {Array} comments All block comments from the file.
 * @param {number} line The line number of the node.
 * @return {string|null} The comment value or null.
 */
function findLeadingComment(comments, line) {
	for (let i = comments.length - 1; i >= 0; i--) {
		const comment = comments[i];
		if (comment.type === 'Block' && comment.value.startsWith('*')) {
			const commentEndLine = comment.loc.end.line;
			if (commentEndLine === line - 1 || commentEndLine === line) {
				return `/*${comment.value}*/`;
			}
		}
	}
	return null;
}

/**
 * Extract WordPress hooks from an array of AST statements.
 *
 * @param {Array} body The array of statement nodes to search.
 * @param {Array} comments All comments from the file.
 * @return {{ hooks: Object, addedHooks: Object }} Detected hooks keyed by hook_{line}.
 */
export function extractHooks(body, comments) {
	const hooks = {};
	const addedHooks = {};

	walkStatements(body, (node) => {
		if (
			node.type !== 'ExpressionStatement' ||
			node.expression.type !== 'CallExpression'
		) {
			return;
		}

		const call = node.expression;
		const hookMatch = matchCallee(call.callee, HOOK_FUNCTIONS);
		const addedHookMatch = matchCallee(call.callee, ADDED_HOOK_FUNCTIONS);
		const fnName = hookMatch || addedHookMatch;

		if (!fnName || call.arguments.length === 0) {
			return;
		}

		const line = node.loc.start.line;
		const hookName = extractHookName(call.arguments[0]);
		const args = call.arguments.slice(1);
		const commentValue = findLeadingComment(comments, line);

		const hookData = {
			name: hookName,
			type: getHookType(fnName),
			args: args.map((arg) => ({ type: arg.type, loc: arg.loc })),
			docblock: exportDocBlock(commentValue),
		};

		if (hookMatch) {
			const key = `hook_${line}`;
			if (!hooks[key]) {
				hooks[key] = [];
			}
			hooks[key].push(hookData);
		} else {
			const key = `added_hook_${line}`;
			if (!addedHooks[key]) {
				addedHooks[key] = [];
			}
			addedHooks[key].push(hookData);
		}
	});

	return { hooks, addedHooks };
}

/**
 * Recursively walk statements looking for expression statements containing calls.
 *
 * @param {Array} nodes AST nodes to walk.
 * @param {Function} callback Called for each statement node.
 */
function walkStatements(nodes, callback) {
	for (const node of nodes) {
		callback(node);

		if (node.type === 'BlockStatement' || node.type === 'Program') {
			walkStatements(node.body, callback);
		} else if (node.type === 'IfStatement') {
			if (node.consequent) {
				walkStatements([node.consequent], callback);
			}
			if (node.alternate) {
				walkStatements([node.alternate], callback);
			}
		} else if (
			node.type === 'ForStatement' ||
			node.type === 'WhileStatement' ||
			node.type === 'DoWhileStatement' ||
			node.type === 'ForInStatement' ||
			node.type === 'ForOfStatement'
		) {
			if (node.body) {
				walkStatements([node.body], callback);
			}
		} else if (node.type === 'TryStatement') {
			walkStatements([node.block], callback);
			if (node.handler) {
				walkStatements([node.handler.body], callback);
			}
			if (node.finalizer) {
				walkStatements([node.finalizer], callback);
			}
		} else if (
			node.type === 'ExpressionStatement' &&
			node.expression.type === 'CallExpression'
		) {
			// Check callback arguments for hook calls within arrow functions / function expressions.
			for (const arg of node.expression.arguments) {
				if (
					(arg.type === 'ArrowFunctionExpression' ||
						arg.type === 'FunctionExpression') &&
					arg.body.type === 'BlockStatement'
				) {
					walkStatements(arg.body.body, callback);
				}
			}
		}
	}
}
