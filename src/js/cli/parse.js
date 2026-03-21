#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { JsFileParser } from '../parser/JsFileParser.js';

const args = process.argv.slice( 2 );
const flags = args.filter( ( a ) => a.startsWith( '--' ) );
const positional = args.filter( ( a ) => ! a.startsWith( '--' ) );
const pretty = flags.includes( '--pretty' );

const directory = positional[ 0 ];
const outputDir = positional[ 1 ] || null;

if ( ! directory ) {
	process.stderr.write(
		'Usage: node src/js/cli/parse.js <directory> [output-dir] [--pretty]\n'
	);
	process.exit( 1 );
}

const resolved = path.resolve( directory );

if ( ! fs.existsSync( resolved ) || ! fs.statSync( resolved ).isDirectory() ) {
	process.stderr.write( `Error: '${ directory }' is not a valid directory.\n` );
	process.exit( 1 );
}

process.stderr.write( `Parsing JS files in ${ resolved }...\n` );

const parser = new JsFileParser();
const result = parser.parseDirectory( resolved );

const fileCount = Object.keys( result ).length;
let functionCount = 0;
let classCount = 0;

for ( const file of Object.values( result ) ) {
	functionCount += ( file.functions || [] ).length;
	classCount += ( file.classes || [] ).length;
}

process.stderr.write(
	`Parsed ${ fileCount } files, ${ classCount } classes, ${ functionCount } functions.\n`
);

if ( outputDir ) {
	const outResolved = path.resolve( outputDir );

	if ( ! fs.existsSync( outResolved ) ) {
		fs.mkdirSync( outResolved, { recursive: true } );
	}

	for ( const [ fileName, fileData ] of Object.entries( result ) ) {
		const baseName = path.basename( fileName, path.extname( fileName ) );
		const outputFile = path.join( outResolved, `${ baseName }Docs.json` );
		const json = JSON.stringify( { [ fileName ]: fileData }, null, pretty ? 2 : undefined );
		fs.writeFileSync( outputFile, json + '\n' );
		process.stderr.write( `Wrote ${ outputFile }\n` );
	}
} else {
	const json = JSON.stringify( result, null, pretty ? 2 : undefined );
	process.stdout.write( json + '\n' );
}
