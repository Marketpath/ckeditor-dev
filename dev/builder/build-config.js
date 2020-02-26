/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* exported CKBUILDER_CONFIG */

var CKBUILDER_CONFIG = {
	skin: 'mp',
	ignore: [
		'bender.js',
		'bender.ci.js',
		'.bender',
		'bender-err.log',
		'bender-out.log',
		'.travis.yml',
		'dev',
		'docs',
		'.DS_Store',
		'.editorconfig',
		'.github',
		'.gitignore',
		'.gitattributes',
		'.github',
		'gruntfile.js',
		'.idea',
		'.jscsrc',
		'.jshintignore',
		'.jshintrc',
		'less',
		'.mailmap',
		'node_modules',
		'package.json',
		'README.md',
		'tests',
		'build.sh',
		'samples'
	],
	plugins: {
		//****** original plugins
		//about: 1,
		//a11yhelp: 1,
		basicstyles: 1,
		//bidi: 1,
		blockquote: 1,
		clipboard: 1,
		colorbutton: 1,
		colordialog: 1,
		//copyformatting: 1,
		contextmenu: 1,
		//dialogadvtab: 1,
		div: 1,
		elementspath: 1,
		enterkey: 1,
		entities: 1,
		//filebrowser: 1,
		find: 1,
		//flash: 1,
		//floatingspace: 1,
		font: 1,
		format: 1,
		//forms: 1,
		horizontalrule: 1,
		htmlwriter: 1,
		//image: 1,
		//iframe: 1,
		indentlist: 1,
		indentblock: 1,
		justify: 1,
		//language: 1,
		link: 1,
		list: 1,
		liststyle: 1,
		magicline: 1,
		//maximize: 1,
		//newpage: 1,
		//pagebreak: 1,
		pastefromlibreoffice: 1,
		pastefromword: 1,
		pastetext: 1,
		//preview: 1,
		//print: 1,
		removeformat: 1,
		resize: 1,
		//save: 1,
		//selectall: 1,
		showblocks: 1,
		showborders: 1,
		//smiley: 1,
		//sourcearea: 1,
		specialchar: 1,
		//stylescombo: 1,
		//tab: 1,
		table: 1,
		tableselection: 1,
		tabletools: 1,
		//templates: 1,
		toolbar: 1,
		undo: 1,
		//uploadimage: 1,
		wysiwygarea: 1,

		//****** other plugins
		//adobeair: 1,
		//ajax: 1,
		autoembed: 1,
		autogrow: 1,
		//autolink: 1,
		//balloonpanel: 1,
		//balloontoolbar: 1,
		//bbcode: 1,
		//button: 1,
		//cloudservices: 1,
		//codemirror: 1,
		//codesnippet: 1,
		//codesnippetgeshi: 1,
		//devtools: 1,
		//dialog: 1,
		//dialogui: 1,
		//divarea: 1,
		//docprops: 1,
		//easyimage: 1,
		//embed: 1,
		//embedbase: 1,
		//embedsemantic: 1,
		//fakeobjects: 1,
		//filetools: 1,
		//floatpanel: 1,
		//iframedialog: 1,
		image2: 1,
		//imagebase: 1,
		//indent: 1,
		//lineutils: 1,
		listblock: 1,
		//mathjax: 1,
		//menu: 1,
		//menubutton: 1,
		//notification: 1,
		//notificationaggregator: 1,
		//panel: 1,
		//panelbutton: 1,
		//placeholder: 1,
		//popup: 1,
		//richcombo: 1,
		//sharedspace: 1,
		//sourcedialog: 1,
		//stylesheetparser: 1,
		//tableresize: 1,
		//uicolor: 1,
		//uploadfile: 1,
		//uploadwidget: 1,
		//widget: 1,
		//widgetselection: 1,
		//xml: 1,

		//****** custom plugins
		ace: 1,
		addgroup: 1,
		advprops: 1,
		aligngroup: 1,
		strikegroup: 1,
		pastegroup: 1,
		mpdialog: 1,
		liquidmarkup: 1,
		mpimage: 1,
		mplink: 1,
		mpembed: 1,
		mpmaximize: 1,
		mpstyles: 1,
		toolbarcollapse: 1

		//**************This is the "original" config
		//a11yhelp: 1,
		//about: 1,
		//basicstyles: 1,
		//bidi: 1,
		//blockquote: 1,
		//clipboard: 1,
		//colorbutton: 1,
		//colordialog: 1,
		//copyformatting: 1,
		//contextmenu: 1,
		//dialogadvtab: 1,
		//div: 1,
		//elementspath: 1,
		//enterkey: 1,
		//entities: 1,
		//filebrowser: 1,
		//find: 1,
		//flash: 1,
		//floatingspace: 1,
		//font: 1,
		//format: 1,
		//forms: 1,
		//horizontalrule: 1,
		//htmlwriter: 1,
		//iframe: 1,
		//image: 1,
		//indentlist: 1,
		//indentblock: 1,
		//justify: 1,
		//language: 1,
		//link: 1,
		//list: 1,
		//liststyle: 1,
		//magicline: 1,
		//maximize: 1,
		//newpage: 1,
		//pagebreak: 1,
		//pastefromword: 1,
		//pastetext: 1,
		//preview: 1,
		//print: 1,
		//removeformat: 1,
		//resize: 1,
		//save: 1,
		//selectall: 1,
		//showblocks: 1,
		//showborders: 1,
		//smiley: 1,
		//sourcearea: 1,
		//specialchar: 1,
		//stylescombo: 1,
		//tab: 1,
		//table: 1,
		//tableselection: 1,
		//tabletools: 1,
		//templates: 1,
		//toolbar: 1,
		//undo: 1,
		//uploadimage: 1,
		//wysiwygarea: 1,
		//codemirror: 1,
		//liquidmarkup: 1,
		//aligngroup: 1,
		//addgroup: 1
	}
};
