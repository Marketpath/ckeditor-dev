CKEDITOR.plugins.add('toolbarcollapse', {
    requires: "wysiwygarea,toolbar",
	init: function (editor) {
		if (!editor.config.toolbarCanCollapse) {
			return;
		}

		editor.once('uiReady', function () {
			var collapser = editor.ui.space('toolbar_collapser'),
				$top = jQuery(editor.ui.space('top').$),
				$bottom = jQuery(editor.ui.space('bottom').$),
				$container = jQuery(editor.container.$),
				forceCollapsed = false;

			function isCollapsed() {
				return collapser.hasClass('cke_toolbox_collapser_min');
			}
			function toolbarIsNarrow() {
				return $top.width() <= 300;
			}
			function topIsTall() {
				return $top.height() > 80;
			}

			function hideOnBlur() {
				if (forceCollapsed || editor.container.hasClass('cke_maximized')) {
					return;
				}
				forceCollapsed = true;

				if (!isCollapsed()) {
					var command = editor.getCommand('toolbarCollapse');
					var oldFocus = command.editorFocus;
					command.state = CKEDITOR.TRISTATE_OFF;
					command.editorFocus = false;
					editor.execCommand('toolbarCollapse');
					command.editorFocus = oldFocus;
					$container.addClass('cke_collapsed');
				}
				collapser.hide();
			}

			function showOnFocus() {
				if (!forceCollapsed) {
					return;
				}
				forceCollapsed = false;
				//if (!editor.focusManager.hasFocus) {
				//	return;
				//}
				if (isCollapsed()) {
					if (toolbarIsNarrow()) {
						//if we do not auto-expand the toolbar we must show the collapser
						collapser.show();
					} else {
						//only auto-expand the toolbar if the editor is not "narrow"
						editor.execCommand('toolbarCollapse');
						if (topIsTall()) {
							//if we auto-expand the toolbar we should only show the
							//collapser if the toolbar is more than two rows
							collapser.show();
						}
					}
					$container.removeClass('cke_collapsed');
				}
			}

			
			editor.on('focus', showOnFocus);
			$top.click(showOnFocus);
			$bottom.click(showOnFocus);

			//silly antics to fix the editor's broken blur event
			//editor.on('blur', hideOnBlur);
			$container.on('mouseenter', function (e) {
				$container.addClass('editor_mousein');
			}).on('mouseleave', function (e) {
				$container.removeClass('editor_mousein');
			}).on('blur', function (e) {
				if (!$container.hasClass('editor_mousein')) {
					hideOnBlur();
				}
			});
			editor.on('blur', function (e) {
				if ($container.hasClass('editor_mousein')) {
					editor.focus();
				} else {
					$container.blur();
				}
			});


			//initial state
			if (editor.focusManager.hasFocus) {
				//hideOnBlur();
				$container.addClass('editor_mousein');
			} else {
				hideOnBlur();
			}


			

			//function switchVisibilityAfter1stRow(toolbox, show) {
			//	var children = toolbox.getChildren(),
			//		len = children.count(),
			//		topPos = children.getItem(0).$.offsetTop;

			//	for (var i = len - 1; i >= 0; i--) {
			//		var child = children.getItem(i);
			//		child.show();
			//		if (!show  && child.$.offsetTop >= topPos) {
			//			child.hide();
			//		//} else {
			//		//	child.hide();
			//		}
			//	}
			//}


			//if (!editor.focusManager.hasFocus) {
			//	//init collapsed
			//	var command = editor.getCommand('toolbarCollapse');
			//	var oldFocus = command.editorFocus;
			//	command.state = CKEDITOR.TRISTATE_OFF;
			//	command.editorFocus = false;
			//	editor.execCommand('toolbarCollapse');
			//	command.editorFocus = oldFocus;
			//}

			//// Copied from toolbar plugin & modified
			//var collapseFn = function (editor, override) {
			//	var collapser = editor.ui.space('toolbar_collapser'),
			//		toolbox = collapser.getPrevious(),
			//		contents = editor.ui.space('contents'),
			//		toolboxContainer = toolbox.getParent(),
			//		contentHeight = parseInt(contents.$.style.height, 10),
			//		previousHeight = toolboxContainer.$.offsetHeight,
			//		minClass = 'cke_toolbox_collapser_min',
			//		collapsed = collapser.hasClass(minClass);

			//	if (!toolbox.isVisible()) toolbox.show(); // necessary 1st time if initially collapsed

			//	if (typeof override == 'boolean') {
			//		collapsed = override;
			//	}

			//	if (!collapsed) {
			//		switchVisibilityAfter1stRow(toolbox, false); //toolbox.hide();
			//		collapser.addClass(minClass);
			//		collapser.setAttribute('title', editor.lang.toolbar.toolbarExpand);
			//	} else {
			//		switchVisibilityAfter1stRow(toolbox, true); //toolbox.show();
			//		collapser.removeClass(minClass);
			//		collapser.setAttribute('title', editor.lang.toolbar.toolbarCollapse);
			//	}

			//	// Update collapser symbol.
			//	collapser.getFirst().setText(collapsed ? '\u25B2' : // BLACK UP-POINTING TRIANGLE
			//		'\u25C0'); // BLACK LEFT-POINTING TRIANGLE

			//	var dy = toolboxContainer.$.offsetHeight - previousHeight;
			//	contents.setStyle('height', contentHeight - dy + 'px');

			//	editor.fire('resize', {
			//		outerHeight: editor.container.$.offsetHeight,
			//		contentsHeight: contents.$.offsetHeight,
			//		outerWidth: editor.container.$.offsetWidth
			//	});
			//}

			//editor.addCommand('toolbarCollapse', {
			//	readOnly: 1,
			//	exec: collapseFn,
			//	modes: { wysiwyg: 1, source: 1 }
			//});

			//var shouldExpandOnFocus = function () {
			//	//do not auto-expand the toolbar if the editor is less than 300px wide
			//	return jQuery(editor.ui.space('top').$).width() > 300;
			//}
			//editor.on('focus', function () {
			//	if (shouldExpandOnFocus()) {
			//		collapseFn(editor, true);
			//	}
			//});
			//editor.on('blur', function () {
			//	collapseFn(editor, false);
			//});

			////have to add this code to prevent focus+click on initial expansion
			//var collapser = editor.ui.space('toolbar_collapser');
			//collapser.$.onclick = function () {
			//	return false;
			//};
			//collapser.on('click', function () {
			//	//we do not want to collapse the toolbar if the editor
			//	//will receive focus through this click event and will
			//	//be auto-expanded by the focus event
			//	if (editor.focusManager.hasFocus || !shouldExpandOnFocus()) {
			//		collapseFn(editor);
			//	}
			//});
		});
    }
});
