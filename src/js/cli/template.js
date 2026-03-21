#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { renderAll } from '../templaters/MarkdownTemplater.js';

const args = process.argv.slice(2);
const positional = args.filter((a) => !a.startsWith('--'));

const inputDir = positional[0];
const outputDir = positional[1] || null;

if (!inputDir) {
	process.stderr.write(
		'Usage: node src/js/cli/template.js <input-dir> [output-dir]\n',
	);
	process.exit(1);
}

const resolved = path.resolve(inputDir);

if (!fs.existsSync(resolved)) {
	fs.mkdirSync(resolved, { recursive: true });
}

if (!fs.statSync(resolved).isDirectory()) {
	process.stderr.write(`Error: '${inputDir}' is not a directory.\n`);
	process.exit(1);
}

const jsonFiles = fs.readdirSync(resolved).filter((f) => f.endsWith('.json'));

if (jsonFiles.length === 0) {
	process.stderr.write(`No JSON files found in ${resolved}.\n`);
	process.exit(1);
}

let totalFiles = 0;

for (const jsonFile of jsonFiles) {
	const filePath = path.join(resolved, jsonFile);
	const json = fs.readFileSync(filePath, 'utf-8');
	const data = JSON.parse(json);
	const results = renderAll(data);

	if (outputDir) {
		const outResolved = path.resolve(outputDir);

		if (!fs.existsSync(outResolved)) {
			fs.mkdirSync(outResolved, { recursive: true });
		}

		for (const [fileName, content] of Object.entries(results)) {
			const outPath = path.join(outResolved, fileName);
			const outFileDir = path.dirname(outPath);
			if (!fs.existsSync(outFileDir)) {
				fs.mkdirSync(outFileDir, { recursive: true });
			}
			fs.writeFileSync(outPath, content);
			process.stderr.write(`Wrote ${outPath}\n`);
		}
	} else {
		for (const [content] of Object.entries(results)) {
			process.stdout.write(content);
		}
	}

	totalFiles += Object.keys(results).length;
}

process.stderr.write(
	`Generated ${totalFiles} markdown files from ${jsonFiles.length} JSON files.\n`,
);
