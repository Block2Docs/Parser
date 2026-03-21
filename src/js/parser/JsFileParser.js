import fs from 'node:fs';
import path from 'node:path';
import * as espree from 'espree';
import { exportDocBlock } from './docblock.js';
import {
	exportClass,
	exportFunction,
	exportConstant,
	findLeadingJSDoc,
} from './exporters.js';

export class JsFileParser {
	/**
	 * Parse all JS files in a directory and return structured documentation data.
	 *
	 * @param {string} directory The directory to parse.
	 * @return {Object<string, object>} Parsed file data keyed by relative path.
	 */
	parseDirectory(directory) {
		const files = this.findJsFiles(directory);
		if (files.length === 0) {
			return {};
		}

		const result = {};
		for (const filePath of files) {
			const relativePath = this.relativePath(filePath, directory);
			result[relativePath] = this.parseFile(filePath);
		}

		return result;
	}

	/**
	 * Parse a single JS file.
	 *
	 * @param {string} filePath Absolute path to the JS file.
	 * @return {object} Structured documentation data.
	 */
	parseFile(filePath) {
		const source = fs.readFileSync(filePath, 'utf-8');

		let ast;
		try {
			ast = espree.parse(source, {
				ecmaVersion: 'latest',
				sourceType: 'module',
				comment: true,
				loc: true,
				range: true,
			});
		} catch {
			// If module parsing fails, try script mode.
			ast = espree.parse(source, {
				ecmaVersion: 'latest',
				sourceType: 'script',
				comment: true,
				loc: true,
				range: true,
			});
		}

		return this.exportFile(ast, filePath);
	}

	/**
	 * Convert a parsed AST to the output structure.
	 *
	 * @param {object} ast The espree AST.
	 * @param {string} filePath The file path.
	 * @return {object} Structured file data.
	 */
	exportFile(ast, filePath) {
		const comments = ast.comments || [];

		const data = {
			path: filePath,
			docblock: this.getFileDocBlock(ast, comments),
			includes: [],
			constants: [],
			functions: [],
			classes: [],
			methods: [],
		};

		for (const node of ast.body) {
			switch (node.type) {
				case 'ImportDeclaration':
					data.includes.push(node.source.value);
					break;

				case 'ClassDeclaration':
					data.classes.push(exportClass(node, comments));
					break;

				case 'FunctionDeclaration':
					data.functions.push(exportFunction(node, comments));
					break;

				case 'VariableDeclaration':
					if (node.kind === 'const') {
						const docblock = exportDocBlock(
							findLeadingJSDoc(node, comments),
						);
						for (const declarator of node.declarations) {
							// If the init is a class expression, export as class.
							if (
								declarator.init &&
								declarator.init.type === 'ClassExpression'
							) {
								const classNode = {
									...declarator.init,
									id: declarator.id,
									loc: node.loc,
								};
								data.classes.push(
									exportClass(classNode, comments),
								);
							} else if (
								declarator.init &&
								(declarator.init.type ===
									'ArrowFunctionExpression' ||
									declarator.init.type ===
										'FunctionExpression')
							) {
								// Named arrow function / function expression export.
								const funcNode = {
									...declarator.init,
									id: declarator.id,
									loc: node.loc,
								};
								if (!funcNode.params) {
									funcNode.params = [];
								}
								data.functions.push(
									exportFunction(funcNode, comments),
								);
							} else {
								data.constants.push(
									exportConstant(
										declarator,
										docblock,
										node.loc.start.line,
									),
								);
							}
						}
					}
					break;

				case 'ExportNamedDeclaration':
				case 'ExportDefaultDeclaration':
					if (node.declaration) {
						this.exportDeclaration(
							node.declaration,
							node,
							data,
							comments,
						);
					}
					break;
			}
		}

		return data;
	}

	/**
	 * Handle an exported declaration.
	 *
	 * @param {object} decl The declaration node.
	 * @param {object} exportNode The export statement node (for location/comments).
	 * @param {object} data The file data being built.
	 * @param {Array} comments All comments.
	 */
	exportDeclaration(decl, exportNode, data, comments) {
		switch (decl.type) {
			case 'ClassDeclaration':
				data.classes.push(exportClass(decl, comments));
				break;

			case 'FunctionDeclaration':
				data.functions.push(exportFunction(decl, comments));
				break;

			case 'VariableDeclaration':
				if (decl.kind === 'const') {
					const docblock = exportDocBlock(
						findLeadingJSDoc(exportNode, comments),
					);
					for (const declarator of decl.declarations) {
						if (
							declarator.init &&
							declarator.init.type === 'ClassExpression'
						) {
							const classNode = {
								...declarator.init,
								id: declarator.id,
								loc: exportNode.loc,
							};
							data.classes.push(exportClass(classNode, comments));
						} else if (
							declarator.init &&
							(declarator.init.type ===
								'ArrowFunctionExpression' ||
								declarator.init.type === 'FunctionExpression')
						) {
							const funcNode = {
								...declarator.init,
								id: declarator.id,
								loc: exportNode.loc,
							};
							if (!funcNode.params) {
								funcNode.params = [];
							}
							data.functions.push(
								exportFunction(funcNode, comments),
							);
						} else {
							data.constants.push(
								exportConstant(
									declarator,
									docblock,
									exportNode.loc.start.line,
								),
							);
						}
					}
				}
				break;
		}
	}

	/**
	 * Get the file-level docblock (first comment in the file if it's a JSDoc block).
	 *
	 * @param {object} ast The parsed AST.
	 * @param {Array} comments All comments.
	 * @return {object|null} Parsed docblock or null.
	 */
	getFileDocBlock(ast, comments) {
		if (comments.length === 0) {
			return null;
		}

		const first = comments[0];
		if (first.type !== 'Block' || !first.value.startsWith('*')) {
			return null;
		}

		// Only treat as file-level if it starts at line 1 or 2.
		if (first.loc.start.line > 2) {
			return null;
		}

		// Make sure it's not attached to the first declaration.
		if (ast.body.length > 0) {
			const firstNode = ast.body[0];
			if (first.loc.end.line === firstNode.loc.start.line - 1) {
				return null;
			}
		}

		return exportDocBlock(`/*${first.value}*/`);
	}

	/**
	 * Find all JS files in a directory recursively.
	 *
	 * @param {string} directory The directory to search.
	 * @return {string[]} Array of absolute file paths.
	 */
	findJsFiles(directory) {
		const files = [];
		this.walkDirectory(directory, files);
		files.sort();
		return files;
	}

	/**
	 * Recursively walk a directory collecting .js files.
	 *
	 * @param {string} dir The directory to walk.
	 * @param {string[]} files Accumulator for file paths.
	 */
	walkDirectory(dir, files) {
		const entries = fs.readdirSync(dir, { withFileTypes: true });

		for (const entry of entries) {
			const fullPath = path.join(dir, entry.name);
			if (entry.isDirectory()) {
				this.walkDirectory(fullPath, files);
			} else if (entry.isFile() && entry.name.endsWith('.js')) {
				files.push(fullPath);
			}
		}
	}

	/**
	 * Get the relative path of a file.
	 *
	 * @param {string} filePath The absolute file path.
	 * @param {string} basePath The base directory path.
	 * @return {string} The relative path.
	 */
	relativePath(filePath, basePath) {
		const base = basePath.endsWith('/') ? basePath : `${basePath}/`;
		if (filePath.startsWith(base)) {
			return filePath.slice(base.length);
		}
		return filePath;
	}
}
