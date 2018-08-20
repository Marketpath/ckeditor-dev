CKEDITOR.editorConfig = function (config) {
	config.toolbarCanCollapse = true;
	config.protectedSource = [/<liquid-markup protected>[\s\S]*?<\/liquid-markup>/gi];
	config.toolbar = [
		{ name: 'undo', items: ['Undo', 'Redo'] },
		{ name: 'clipboard', items: ['PasteGroup'] },
		{ name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'StrikeGroup', 'RemoveFormat'] },
		{ name: 'colors', items: ['TextColor', 'BGColor'] },
		{ name: 'align', items: ['AlignGroup'] },
		{ name: 'lists', items: ['BulletedList', 'NumberedList', 'Blockquote', 'Outdent', 'Indent'] },
		{ name: 'links', items: ['Link', 'Unlink', 'Anchor'] },
		{ name: 'insert', items: ['Image', 'Gallery', 'Embed', 'AddGroup'] },
		{ name: 'styles', items: ['Styles', 'Format', 'FontSize'] },
		{ name: 'tools', items: ['Advprops', 'ShowBlocks', 'Ace', 'Maximize'] },
	];
	config.autoGrow_minHeight = 150;
	config.autoGrow_maxHeight = 400;
	config.autoGrow_onStartup = true;
	config.allowedContent = true;
	config.contentsCss = '';
	config.format_tags = 'p;div;h1;h2;h3;h4;h5;h6;pre';
	config.embed_provider = 'https://noembed.com/embed?callback={callback}&url={url}';
	config.autoEmbed_widget = 'mpembed';
	// %REMOVE_START%
	config.skin = 'mp';
	//config.skin = 'moono-lisa';
	//using the original plugin ordering
	//with unknown plugins after original plugins
	//and custom plugins at the end
	config.plugins =
		//****** original plugins
		//'about,' +
		//'a11yhelp,' +
		'basicstyles,' +
		//'bidi,' +
		'blockquote,' +
		'clipboard,' +
		'colorbutton,' +
		'colordialog,' +
		//'copyformatting,' +
		'contextmenu,' +
		//'dialogadvtab,' +
		'div,' +
		'elementspath,' +
		'enterkey,' +
		'entities,' +
		//'filebrowser,' +
		'find,' +
		//'flash,' +
		//'floatingspace,' +
		'font,' +
		'format,' +
		//'forms,' +
		'horizontalrule,' +
		'htmlwriter,' +
		//'image,' +
		//'iframe,' +
		'indentlist,' +
		'indentblock,' +
		'justify,' +
		//'language,' +
		'link,' +
		'list,' +
		'liststyle,' +
		'magicline,' +
		//'maximize,' +
		//'newpage,' +
		//'pagebreak,' +
		'pastefromword,' +
		'pastetext,' +
		//'preview,' +
		//'print,' +
		'removeformat,' +
		'resize,' +
		//'save,' +
		//'selectall,' +
		'showblocks,' +
		'showborders,' +
		//'smiley,' +
		//'sourcearea,' +
		'specialchar,' +
		//'stylescombo,' +
		//'tab,' +
		'table,' +
		'tableselection,' +
		'tabletools,' +
		//'templates,' +
		'toolbar,' +
		'undo,' +
		//'uploadimage,' +
		'wysiwygarea,' +

		//****** other plugins
		//'adobeair,' +
		//'ajax,' +
		'autoembed,' +
		'autogrow,' +
		//'autolink,' +
		//'balloonpanel,' +
		//'balloontoolbar,' +
		//'bbcode,' +
		//'button,' +
		//'cloudservices,' +
		//'codemirror,' +
		//'codesnippet,' +
		//'codesnippetgeshi,' +
		//'devtools,' +
		//'dialog,' +
		//'dialogui,' +
		//'divarea,' +
		//'docprops,' +
		//'easyimage,' +
		//'embed,' +
		//'embedbase,' +
		//'embedsemantic,' +
		//'fakeobjects,' +
		//'filetools,' +
		//'floatpanel,' +
		//'iframedialog,' +
		'image2,' +
		//'imagebase,' +
		//'indent,' +
		//'lineutils,' +
		'listblock,' +
		//'mathjax,' +
		//'menu,' +
		//'menubutton,' +
		//'notification,' +
		//'notificationaggregator,' +
		//'panel,' +
		//'panelbutton,' +
		//'placeholder,' +
		//'popup,' +
		//'richcombo,' +
		//'sharedspace,' +
		//'sourcedialog,' +
		//'stylesheetparser,' +
		//'tableresize,' +
		//'uicolor,' +
		//'uploadfile,' +
		//'uploadwidget,' +
		//'widget,' +
		//'widgetselection,' +
		//'xml,' +

		//****** custom plugins
		'ace,' +
		'addgroup,' +
		'advprops,' +
		'aligngroup,' +
		'strikegroup,' +
		'pastegroup,' +
		'mpdialog,' +
		'liquidmarkup,' +
		'mpimage,' +
		'mplink,' +
		'mpembed,' +
		'mpmaximize,' +
		'mpstyles,' +
		'toolbarcollapse';
	// %REMOVE_END%
};
// %LEAVE_UNMINIFIED% %REMOVE_LINE%
