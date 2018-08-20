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

				editor.document && editor.document.getBody().setStyle('overflow', 'hidden');
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

				editor.document && editor.document.getBody().removeStyle('overflow');
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

			var onReady = function () {
				//initial state
				if (editor.focusManager.hasFocus) {
					//hideOnBlur();
					$container.addClass('editor_mousein');
				} else {
					hideOnBlur();
				}
			};
			if (editor.status == 'ready') {
				onReady();
			} else {
				editor.on('instanceReady', onReady);
			}
		});
    }
});
