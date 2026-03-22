import { parse } from 'comment-parser';

/**
 * Parse a JSDoc comment string into a structured docblock object.
 *
 * @param {string|null} commentValue The raw comment text (without leading/trailing delimiters handled by espree).
 * @return {{ summary: string, description: string, tags: Array }|null}
 */
export function exportDocBlock(commentValue) {
	if (!commentValue) {
		return null;
	}

	// comment-parser expects the full /** ... */ wrapper.
	const raw = commentValue.startsWith('/**')
		? commentValue
		: `/**\n${commentValue}\n*/`;

	const parsed = parse(raw, { spacing: 'preserve' });

	if (!parsed.length) {
		return null;
	}

	const block = parsed[0];

	// Split description into summary (first paragraph/sentence) and description (rest).
	// The PHP parser uses phpDocumentor which splits on blank lines.
	const descriptionText = block.description.trim();
	const paragraphs = descriptionText.split(/\n\s*\n/);
	const summary = paragraphs[0].replace(/\n/g, ' ').trim();
	const description = paragraphs.slice(1).join('\n\n').trim();

	const tags = block.tags.map((tag) => {
		const entry = {
			name: tag.tag,
			description: tag.description || null,
		};

		if (tag.tag === 'param') {
			entry.variable = tag.name || null;
			entry.type = tag.type || null;
		} else if (tag.tag === 'return' || tag.tag === 'returns') {
			entry.name = 'return';
			entry.type = tag.type || null;
		} else if (tag.tag === 'needs-docs' || tag.tag === 'todo') {
			// comment-parser splits the body into type/name/description;
			// rejoin them into a single description for free-text tags.
			entry.description =
				[tag.type, tag.name, tag.description]
					.filter(Boolean)
					.join(' ')
					.trim() || null;
		} else if (tag.type) {
			entry.type = tag.type;
		}

		return entry;
	});

	return { summary, description, tags };
}
