#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { JsFileParser } from '../parser/JsFileParser.js';

const args = process.argv.slice( 2 );
const flags = args.filter( ( a ) => a.startsWith( '--' ) );
const positional = args.filter( ( a ) => ! a.startsWith( '--' ) );
const pretty = flags.includes( '--pretty' );

const directory = positional[ 0 ];
const outputFile = positional[ 1 ] || null;

if ( ! directory ) {
	process.stderr.write(
		'Usage: node src/js/cli/parse.js <directory> [output.json] [--pretty]\n'
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

const json = JSON.stringify( result, null, pretty ? 2 : undefined );

if ( outputFile ) {
	fs.writeFileSync( outputFile, json + '\n' );
	process.stderr.write( `Output written to ${ outputFile }\n` );
} else {
	process.stdout.write( json + '\n' );
}
