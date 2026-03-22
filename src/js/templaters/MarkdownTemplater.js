/**
 * Renders parsed JSON output into human-readable Markdown documentation.
 *
 */
import reassurance from '../../../config/reassurance.json' with { type: 'json' };

/**
 * Render a docblock's summary and description lines.
 *
 * @param {object|null} docblock The docblock object.
 * @return {string} Markdown text.
 */
function renderDocblock(docblock) {
	if (!docblock) {
		return '';
	}

	const parts = [];

	if (docblock.summary) {
		parts.push(docblock.summary);
	}

	if (docblock.description) {
		parts.push(docblock.description);
	}

	return parts.join('\n\n');
}

/**
 * Find a specific tag from a docblock.
 *
 * @param {object|null} docblock The docblock object.
 * @param {string}      name     Tag name to find.
 * @return {object|null} The first matching tag, or null.
 */
function findTag(docblock, name) {
	if (!docblock || !docblock.tags) {
		return null;
	}
	return docblock.tags.find((t) => t.name === name) || null;
}

/**
 * Find all tags with a given name from a docblock.
 *
 * @param {object|null} docblock The docblock object.
 * @param {string}      name     Tag name to find.
 * @return {object[]} Matching tags.
 */
function findTags(docblock, name) {
	if (!docblock || !docblock.tags) {
		return [];
	}
	return docblock.tags.filter((t) => t.name === name);
}

/**
 * Escape pipe characters for use in markdown table cells.
 *
 * @param {string} text The text to escape.
 * @return {string} Escaped text.
 */
function escapeCell(text) {
	if (!text) {
		return '';
	}
	return String(text).replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

/**
 * Render a method or function signature.
 *
 * @param {object} method The method data.
 * @return {string} Code signature string.
 */
function renderSignature(method) {
	const parts = [];

	if (method.visibility && method.visibility !== 'public') {
		parts.push(method.visibility);
	}

	if (method.static) {
		parts.push('static');
	}

	const params = (method.arguments || []).map((arg) => {
		let str = '';
		if (arg.type) {
			str += arg.type + ' ';
		}
		str += arg.name;
		if (arg.default !== null && arg.default !== undefined) {
			str += ' = ' + arg.default;
		}
		return str;
	});

	parts.push(`${method.name}(${params.join(', ')})`);

	if (method.return_type) {
		parts.push(': ' + method.return_type);
	}

	return parts.join(' ');
}

/**
 * Render a parameters table for arguments with docblock info.
 *
 * @param {object[]}    args     The arguments array.
 * @param {object|null} docblock The docblock object.
 * @return {string} Markdown table.
 */
function renderParamsTable(args, docblock) {
	if (!args || args.length === 0) {
		return '';
	}

	const paramTags = findTags(docblock, 'param');
	const lines = [
		'| Name | Type | Default | Description |',
		'|------|------|---------|-------------|',
	];

	for (const arg of args) {
		const tag = paramTags.find((t) => t.variable === arg.name) || {};
		const type = escapeCell(arg.type || tag.type || '');
		const def = escapeCell(
			arg.default !== null && arg.default !== undefined
				? arg.default
				: '',
		);
		const desc = escapeCell(tag.description || '');
		lines.push(
			`| \`${escapeCell(arg.name)}\` | \`${type}\` | ${def ? '`' + def + '`' : ''} | ${desc} |`,
		);
	}

	return lines.join('\n');
}

/**
 * Render a single class constant.
 *
 * @param {object} constant The constant data.
 * @return {string} Markdown section.
 */
function renderConstant(constant) {
	const lines = [`### \`${constant.name}\``];

	if (constant.docblock) {
		const desc = renderDocblock(constant.docblock);
		if (desc) {
			lines.push('', desc);
		}
	}

	if (constant.value !== null && constant.value !== undefined) {
		lines.push('', '```', String(constant.value), '```');
	}

	return lines.join('\n');
}

/**
 * Render a single property.
 *
 * @param {object} property The property data.
 * @return {string} Markdown section.
 */
function renderProperty(property) {
	const lines = [`### \`$${property.name}\``];

	if (property.docblock) {
		const desc = renderDocblock(property.docblock);
		if (desc) {
			lines.push('', desc);
		}
	}

	const meta = [];

	if (property.type) {
		meta.push(['Type', `\`${property.type}\``]);
	}

	if (property.visibility) {
		meta.push(['Visibility', property.visibility]);
	}

	if (property.static) {
		meta.push(['Static', 'Yes']);
	}

	if (property.default !== null && property.default !== undefined) {
		meta.push(['Default', `\`${property.default}\``]);
	}

	if (meta.length > 0) {
		lines.push('');
		lines.push('| | |');
		lines.push('|---|---|');
		for (const [key, val] of meta) {
			lines.push(`| **${key}** | ${val} |`);
		}
	}

	return lines.join('\n');
}

/**
 * Render a single method.
 *
 * @param {object} method The method data.
 * @return {string} Markdown section.
 */
function renderMethod(method) {
	const headingParts = [];

	if (method.visibility) {
		headingParts.push(method.visibility);
	}

	if (method.static) {
		headingParts.push('static');
	}

	headingParts.push(`function ${method.name}()`);

	const lines = [`### \`${headingParts.join(' ')}\``];

	const deprecated = findTag(method.docblock, 'deprecated');
	if (deprecated) {
		lines.push('', `> **Deprecated:** ${deprecated.description || ''}`);
	}

	const needsDocs = findTag(method.docblock, 'needs-docs');
	if (needsDocs) {
		lines.push('', `> **Needs docs:** ${needsDocs.description || ''}`);
	}

	const needsReassuranceMethod = findTag(
		method.docblock,
		'needs-reassurance',
	);
	if (needsReassuranceMethod) {
		lines.push(
			'',
			`> **Reassurance:** ${reassurance[Math.floor(Math.random() * reassurance.length)]}`,
		);
	}

	const desc = renderDocblock(method.docblock);
	if (desc) {
		lines.push('', `**Description:** ${desc}`);
	}

	lines.push('', '```', renderSignature(method), '```');

	if (method.visibility) {
		lines.push('', `**Visibility:** ${method.visibility}`);
	}

	const paramsTable = renderParamsTable(method.arguments, method.docblock);
	if (paramsTable) {
		lines.push('', '**Parameters:**', '', paramsTable);
	}

	const returnTag = findTag(method.docblock, 'return');
	if (method.return_type || returnTag) {
		const type = method.return_type || (returnTag && returnTag.type) || '';
		const returnDesc =
			returnTag && returnTag.description
				? ' — ' + returnTag.description
				: '';
		lines.push('', `**Returns:** \`${type}\`${returnDesc}`);
	}

	const hooksSection = renderHooksSection(method.hooks, 'Hooks');
	if (hooksSection) {
		lines.push('', hooksSection);
	}

	const addedHooksSection = renderHooksSection(
		method.added_hooks,
		'Added Hooks',
	);
	if (addedHooksSection) {
		lines.push('', addedHooksSection);
	}

	return lines.join('\n');
}

/**
 * Render a single function (file-level).
 *
 * @param {object} func The function data.
 * @return {string} Markdown section.
 */
function renderFunction(func) {
	return renderMethod(func);
}

/**
 * Render hook entries from a hooks or added_hooks array.
 *
 * @param {object[]|object} hooksList Array of hook objects, or a legacy map keyed by hook_<line>.
 * @param {string}          heading   Section heading, e.g. 'Hooks' or 'Added Hooks'.
 * @return {string} Markdown section.
 */
function renderHooksSection(hooksList, heading) {
	// Normalise: accept both a flat array and a legacy { hook_<line>: [...] } map.
	let hooks;
	if (Array.isArray(hooksList)) {
		hooks = hooksList;
	} else if (hooksList && typeof hooksList === 'object') {
		hooks = Object.values(hooksList).flat();
	} else {
		hooks = [];
	}

	if (hooks.length === 0) {
		return '';
	}

	const lines = [`**${heading}:**`];

	for (const hook of hooks) {
		lines.push('', `- \`${hook.name}\` _${hook.type}_`);

		const desc = renderDocblock(hook.docblock);
		if (desc) {
			lines.push(`  ${desc}`);
		}

		const paramTags = findTags(hook.docblock, 'param');
		if (paramTags.length > 0) {
			for (const tag of paramTags) {
				const type = tag.type ? `\`${escapeCell(tag.type)}\` ` : '';
				lines.push(
					`  - ${type}\`${escapeCell(tag.variable || '')}\` ${escapeCell(tag.description || '')}`,
				);
			}
		}

		const sinceTag = findTag(hook.docblock, 'since');
		if (sinceTag && sinceTag.description) {
			lines.push(`  Since: ${sinceTag.description}`);
		}
	}

	return lines.join('\n');
}

/**
 * Render a single class to Markdown.
 *
 * @param {object} cls The class data.
 * @return {string} Full Markdown for the class.
 */
function renderClass(cls) {
	const lines = [`# ${cls.name}`];

	const needsReassuranceClassTag = findTag(cls.docblock, 'needs-reassurance');
	if (
		needsReassuranceClassTag &&
		needsReassuranceClassTag.name === 'needs-reassurance'
	) {
		lines.push(
			'',
			`> **Reassurance:** ${reassurance[Math.floor(Math.random() * reassurance.length)]}`,
		);
	}

	const desc = renderDocblock(cls.docblock);
	if (desc) {
		lines.push('', '## Description', '', desc);
	}

	// Metadata table.
	const meta = [];
	if (cls.fqsen) {
		meta.push(['FQSEN', `\`${cls.fqsen}\``]);
	}

	const sinceTag = findTag(cls.docblock, 'since');
	if (sinceTag && sinceTag.description) {
		meta.push(['Since', sinceTag.description]);
	}

	if (cls.parent) {
		meta.push(['Parent', `\`${cls.parent}\``]);
	}

	if (cls.abstract) {
		meta.push(['Abstract', 'Yes']);
	}

	if (cls.final) {
		meta.push(['Final', 'Yes']);
	}

	if (meta.length > 0) {
		lines.push('');
		lines.push('| | |');
		lines.push('|---|---|');
		for (const [key, val] of meta) {
			lines.push(`| **${key}** | ${val} |`);
		}
	}

	// Constants.
	if (cls.constants && cls.constants.length > 0) {
		lines.push('', '---', '', '## Constants');
		for (const constant of cls.constants) {
			lines.push('', renderConstant(constant));
		}
	}

	// Properties.
	if (cls.properties && cls.properties.length > 0) {
		lines.push('', '---', '', '## Properties');
		for (const prop of cls.properties) {
			lines.push('', renderProperty(prop));
		}
	}

	// Methods.
	if (cls.methods && cls.methods.length > 0) {
		lines.push('', '---', '', '## Methods');
		for (let i = 0; i < cls.methods.length; i++) {
			lines.push('', renderMethod(cls.methods[i]));
			if (i < cls.methods.length - 1) {
				lines.push('', '---');
			}
		}
	}

	return lines.join('\n');
}

/**
 * Render a full file entry to Markdown.
 *
 * @param {string} fileName The file name key.
 * @param {object} fileData The parsed file data.
 * @return {string} Full Markdown document.
 */
export function renderFile(fileName, fileData) {
	const lines = [];

	// If the file has classes, each class becomes a top-level section.
	if (fileData.classes && fileData.classes.length > 0) {
		for (const cls of fileData.classes) {
			lines.push(renderClass(cls));
		}
	}

	// File-level functions.
	if (fileData.functions && fileData.functions.length > 0) {
		if (lines.length > 0) {
			lines.push('', '---');
		}
		lines.push('', '## Functions');
		for (const func of fileData.functions) {
			lines.push('', renderFunction(func));
		}
	}

	// File-level constants.
	if (fileData.constants && fileData.constants.length > 0) {
		if (lines.length > 0) {
			lines.push('', '---');
		}
		lines.push('', '## Constants');
		for (const constant of fileData.constants) {
			lines.push('', renderConstant(constant));
		}
	}

	// File-level methods (standalone exported methods).
	if (fileData.methods && fileData.methods.length > 0) {
		if (lines.length > 0) {
			lines.push('', '---');
		}
		lines.push('', '## Exported Methods');
		for (const method of fileData.methods) {
			lines.push('', renderMethod(method));
		}
	}

	return lines.join('\n') + '\n';
}

/**
 * Render an entire parsed JSON result (multiple files) to a map of Markdown strings.
 *
 * @todo Add support for a config file with an arbitrary list of tags to include in the documentation in `renderAll`.
 *
 * @param {object} data The full parsed JSON output (keyed by filename).
 * @return {Object<string, string>} Map of output filename to Markdown content.
 */
export function renderAll(data) {
	const results = {};

	for (const [fileName, fileData] of Object.entries(data)) {
		const mdName = fileName.replace(/\.[^.]+$/, '.md');
		results[mdName] = renderFile(fileName, fileData);
	}

	return results;
}
