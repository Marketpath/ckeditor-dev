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

//(function () {
//	var icons = {
//		'undo': 'fa fa-undo',
//		'redo': 'fa fa-redo',

//		'cut': 'fa fa-cut',
//		'copy': 'fa fa-copy',
//		'paste': 'fa fa-paste',
//		//'pastefromword',
//		//'pastetext',

//		'bold': 'fa fa-bold',
//		'italic': 'fa fa-italic',
//		'underline': 'fa fa-underline',

//		'strike': 'fa fa-strikethrough',
//		'subscript': 'fa fa-subscript',
//		'superscript': 'fa fa-superscript',

//		//'removeformat',

//		//'textcolor',
//		//'bgcolor',
//		//'uicolor',

//		//'justifyblock',
//		//'justifycenter',
//		//'justifyleft',
//		//'justifyright',

//		//'bulletedlist',
//		//'numberedlist',
//		//'blockquote',
//		//'indent',
//		//'outdent',

//		//'link',
//		//'unlink',
//		//'anchor',

//		//'image',
//		//'gallery',
//		//'embed',
//		//'addgroup',
//		//'specialchar',
//		//'table',
//		//'horizontalrule',
//		//'form',
//		//'snippet',
//		//'liquid-markup',

//		//'advprops',
//		//'showblocks',
//		//'ace',
//		//'maximize',

//		//'tablecell',
//		//'tablecell_delete',
//		//'tablecell_insertAfter',
//		//'tablecell_insertBefore',
//		//'tablecell_merge',
//		//'tablecell_merge_down',
//		//'tablecell_merge_right',
//		//'tablecell_split_horizontal',
//		//'tablecell_split_vertical',
//		//'tablecell_properties',
//		//'tablecolumn',
//		//'tablecolumn_delete',
//		//'tablecolumn_insertAfter',
//		//'tablecolumn_insertBefore',
//		//'tabledelete',
//		//'tablerow',
//		//'tablerow_delete',
//		//'tablerow_insertAfter',
//		//'tablerow_insertBefore'
//	};

//	CKEDITOR.on('template', function (evtInfo) {
//		if (evtInfo.data.name == 'button') {
//			evtInfo.data.source = evtInfo.data.source.replace('<span class="cke_button_icon cke_button__{iconName}_icon" style="{style}">', '<span class="cke_button_icon {style}">');
//		} else if (evtInfo.data.name == 'menuItem') {
//			evtInfo.data.source = evtInfo.data.source.replace('<span class="cke_button_icon cke_button__{iconName}_icon" style="{iconStyle}">', '<span class="cke_button_icon {iconStyle}">');
//		}
//	});

//	CKEDITOR.skin.getIconStyle = function (name, rtl) {
//		return icons[name] || '';
//	};
//})();

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
		'maximize',

		'tablecell',
		'tablecell_delete',
		'tablecell_insertAfter',
		'tablecell_insertBefore',
		'tablecell_merge',
		'tablecell_merge_down',
		'tablecell_merge_right',
		'tablecell_split_horizontal',
		'tablecell_split_vertical',
		'tablecell_properties',
		'tablecolumn',
		'tablecolumn_delete',
		'tablecolumn_insertAfter',
		'tablecolumn_insertBefore',
		'tabledelete',
		'tablerow',
		'tablerow_delete',
		'tablerow_insertAfter',
		'tablerow_insertBefore'
	];

	var iconsFolder = CKEDITOR.getUrl(CKEDITOR.skin.path() + 'icons/' + (CKEDITOR.env.hidpi ? 'hidpi/' : ''));

	for (var i = 0; i < icons.length; i++) {
		CKEDITOR.skin.addIcon(icons[i], iconsFolder + icons[i] + '.png');
	}
})();
// %REMOVE_END%
