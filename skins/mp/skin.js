/*
For this skin, the following tasks are achieved in this file:
	2. Register browser specific skin files.
	4. Register the skin icons, to have them used on the development version of
		the skin.
*/

CKEDITOR.skin.name = 'mp';

// 2. Register browser specific skin files
// -----------------------------------------
// (https://docs.ckeditor.com/ckeditor4/docs/#!/guide/skin_sdk_browser_hacks)
//
// The accepted browser names must match the CKEDITOR.env properties. The most
// common names are: ie, webkit and gecko. Check the documentation for the complete
// list:
// https://docs.ckeditor.com/ckeditor4/docs/#!/api/CKEDITOR.env
//CKEDITOR.skin.ua_editor = 'ie,iequirks,gecko';
//CKEDITOR.skin.ua_dialog = 'ie,iequirks';


// %REMOVE_START%
(function () {
	var icons = [
		'undo',
		'redo',

		'cut',
		'copy',
		'paste',
		'pastefromword',
		'pastetext',

		'bold',
		'italic',
		'underline',

		'strike',
		'subscript',
		'superscript',

		'removeformat',

		'textcolor',
		'bgcolor',
		//'uicolor',

		'justifyblock',
		'justifycenter',
		'justifyleft',
		'justifyright',

		'bulletedlist',
		'numberedlist',
		'blockquote',
		'indent',
		'outdent',

		'link',
		'unlink',
		'anchor',

		'image',
		'gallery',
		'embed',
		'addgroup',
		'specialchar',
		'table',
		'horizontalrule',
		'form',
		'snippet',
		'liquid-markup',

		'advprops',
		'showblocks',
		'ace',
		'maximize'
	];

	//var iconsFolder = CKEDITOR.getUrl( CKEDITOR.skin.path() + 'icons/' + ( CKEDITOR.env.hidpi ? 'hidpi/' : '' ) );
	var iconsFolder = CKEDITOR.getUrl(CKEDITOR.skin.path() + 'icons/');

	for (var i = 0; i < icons.length; i++) {
		CKEDITOR.skin.addIcon(icons[i], iconsFolder + icons[i] + '.png');
	}
})();
// %REMOVE_END%
