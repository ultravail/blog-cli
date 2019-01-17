'use strict';

const open = require('opn');

const config = require('./lib/config');
const writeFile = require('./lib/write-file');
const publish = require('./lib/publish');

module.exports = async (input, flags) => {
	console.log(flags);
	// Configure the path to the markdown posts.
	if (flags.path !== '.') {
		config.set('path', flags.path);
		console.log(`Saved the path \`${flags.path}\` for your blog posts`);
		return;
	}

	if (flags.editor !== 'ia writer') {
		config.set('editor', flags.editor);
		console.log(`Saved ${flags.editor} as your editor`);
		return;
	}

	if (flags.publish) {
		await publish();
		console.log('Your changes have been pushed');
		return;
	}

	if (input) {
		const time = new Date();
		const day = time.getDate();
		const month = time.getMonth() + 1;
		const dd = `${day}`.length < 2 ? `0${day}` : `${day}`;
		const mm = `${month}`.length < 2 ? `0${month}` : `${month}`;
		const yyyy = time.getFullYear();
		const fileName = `${yyyy}-${mm}-${dd}-${input}`;
		const filePath = `${config.get('path')}/${fileName}.md`;
		writeFile(filePath);
		await open(filePath, {
			app: config.get('editor'),
			wait: false
		});
		console.log(`Created your new post at ${filePath} and openening it in your editor`);
	}
};
