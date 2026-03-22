import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { JsFileParser } from '../../../src/js/parser/JsFileParser.js';

describe('JsFileParser', () => {
	let parser;

	beforeEach(() => {
		parser = new JsFileParser();
	});

	it('parseFile returns structured data with class name and docblock', () => {
		const result = parser.parseFile(
			path.resolve(import.meta.dirname, 'fixtures/SampleClass.js'),
		);

		assert.ok(result.classes, 'result should have classes');
		assert.strictEqual(result.classes.length, 1);

		const cls = result.classes[0];
		assert.strictEqual(cls.name, 'SampleClass');
		assert.strictEqual(cls.docblock.summary, 'A sample class for testing.');
	});

	it('parseFile extracts methods', () => {
		const result = parser.parseFile(
			path.resolve(import.meta.dirname, 'fixtures/SampleClass.js'),
		);

		const cls = result.classes[0];
		const methodNames = cls.methods.map((m) => m.name);
		assert.ok(methodNames.includes('greet'), 'should contain greet');
	});

	it('parseFile extracts docblock tags', () => {
		const result = parser.parseFile(
			path.resolve(import.meta.dirname, 'fixtures/SampleClass.js'),
		);

		const cls = result.classes[0];
		const greet = cls.methods.find((m) => m.name === 'greet');

		assert.ok(greet, 'greet method should exist');
		assert.ok(greet.docblock, 'greet should have a docblock');

		const paramTags = greet.docblock.tags.filter((t) => t.name === 'param');
		assert.ok(paramTags.length > 0, 'should have param tags');
	});

	it('parseDirectory returns all files', () => {
		const result = parser.parseDirectory(
			path.resolve(import.meta.dirname, 'fixtures'),
		);

		assert.ok(Object.keys(result).length > 0);
		assert.ok('SampleClass.js' in result, 'should contain SampleClass.js');
	});

	it('parseDirectory returns empty object for empty directory', () => {
		const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'doc2me_test_'));

		const result = parser.parseDirectory(tmpDir);
		assert.deepStrictEqual(result, {});

		fs.rmdirSync(tmpDir);
	});

	it('parseFile extracts needs-docs tag', () => {
		const result = parser.parseFile(
			path.resolve(import.meta.dirname, 'fixtures/SampleClass.js'),
		);

		const cls = result.classes[0];
		const greet = cls.methods.find((m) => m.name === 'greet');

		assert.ok(greet, 'greet method should exist');
		assert.ok(greet.docblock, 'greet should have a docblock');

		const needsDocsTags = greet.docblock.tags.filter(
			(t) => t.name === 'needs-docs',
		);
		assert.ok(needsDocsTags.length > 0, 'should have needs-docs tag');
		assert.strictEqual(
			needsDocsTags[0].description,
			'Add usage examples for greeting customization.',
		);
	});

	it('parseFile extracts WordPress hooks on methods', () => {
		const result = parser.parseFile(
			path.resolve(import.meta.dirname, 'fixtures/SampleClass.js'),
		);

		const cls = result.classes[0];
		const greet = cls.methods.find((m) => m.name === 'greet');
		assert.ok(greet.hooks, 'greet should have hooks');
		assert.ok(
			greet.hooks.length > 0,
			'greet should have at least one hook',
		);

		const hookNames = greet.hooks.map((h) => h.name);
		assert.ok(
			hookNames.includes('hook_do_action'),
			'should contain hook_do_action',
		);

		const legacyGreet = cls.methods.find((m) => m.name === 'legacyGreet');
		assert.ok(
			legacyGreet.added_hooks,
			'legacyGreet should have added_hooks',
		);

		const addedHookNames = legacyGreet.added_hooks.map((h) => h.name);
		assert.ok(
			addedHookNames.includes('hook_name_add_action'),
			'should contain hook_name_add_action',
		);
		assert.ok(
			addedHookNames.includes('hook_name_add_filter'),
			'should contain hook_name_add_filter',
		);
	});
});
