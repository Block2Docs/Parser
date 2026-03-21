/**
 * A sample class for testing.
 *
 * This class demonstrates various JS constructs for parser testing.
 *
 * @since 1.0.0
 */
export class SampleClass {
	/** @type {string} The name to use. */
	#name;

	static VERSION = '1.0.0';

	/**
	 * Create a new instance.
	 *
	 * @param {string} name The name.
	 */
	constructor(name = 'World') {
		this.#name = name;
	}

	/**
	 * Return a greeting.
	 *
	 * @param {string} prefix Optional prefix.
	 * @return {string} The greeting string.
	 */
	greet(prefix = 'Hello') {
		/**
		 * I'm a comment.
		 *
		 * @since 1.0.1
		 *
		 * @param {string} prefix Optional prefix.
		 */
		doAction('hook_do_action', prefix);
		return `${prefix}, ${this.#name}!`;
	}

	/**
	 * A static helper.
	 *
	 * @deprecated 2.0.0 Use greet() instead.
	 */
	static legacyGreet(name) {
		addAction('hook_name_add_action', 'namespace', (p) => {
			return `${p}!`;
		});

		addFilter(
			'hook_name_add_filter',
			'namespace',
			SampleClass.prototype.greet,
		);
		return `Hello, ${name}!`;
	}

	/**
	 * Test apply filters.
	 */
	static testDynamicHooks() {
		addAction('edit_post', SampleClass.prototype.greet);

		addFilter('the_title', SampleClass.prototype.greet);

		const option = 'option_name';
		applyFilters(`pre_option_${option}`, option);
	}
}
