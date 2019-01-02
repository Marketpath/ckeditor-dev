(function () {
	CKEDITOR.plugins.add('mpdialog', {
		//this is a really bad place to "bootstrap" these icons. 
		icons: 'tablecell,tablecell_delete,tablecell_insertAfter,tablecell_insertBefore,tablecell_merge,tablecell_merge_down,tablecell_merge_right,tablecell_split_vertical,tablecell_split_horizontal,tablecell_properties,tablecolumn,tablecolumn_delete,tablecolumn_insertAfter,tablecolumn_insertBefore,tabledelete,tablerow,tablerow_delete,tablerow_insertAfter,tablerow_insertBefore',
		init: function (editor) {
			var browsing = false,
				wasFullscreen = false,
				closeSubId = false,
				afterClose = false;

			editor.addCommand('openDialog', {
				canUndo: false,
				//contextSensitive: false,
				//editorFocus: false,
				exec: openDialog
			});
			editor.addCommand('closeDialog', {
				canUndo: false,
				exec: endBrowse
			});

			function openDialog(editor, data) {
				if (browsing) {
					endBrowse();
				}

				var Dialog = editor.config.Dialog;
				if (!Dialog || !data.name) {
					return false;
				}

				afterClose = typeof data.afterClose == 'function' ? data.afterClose : false;
				browsing = true;
				editor.focusManager.lock();

				var maximizeCommand = editor.getCommand('maximize');
				wasFullscreen = maximizeCommand && maximizeCommand.state == CKEDITOR.TRISTATE_ON;
				if (wasFullscreen) {
					maximizeCommand.exec();
				}

				editor.on('change', endBrowse);
				editor.on('selectionChange', endBrowse);
				editor.on('mode', endBrowse);

				closeSubId = Dialog.on('afterCloseSub', endBrowse);
				Dialog.off('onCancel').on('onCancel', endBrowse);

				Dialog.openSub(data.name, data.attrs);
				if (editor.config.$scope) {
					editor.config.$scope.$apply();
				}
			}

			function endBrowse() {
				browsing = false;

				var Dialog = editor.config.Dialog;
				if (!Dialog) {
					return;
				}

				editor.removeListener('change', endBrowse);
				editor.removeListener('selectionChange', endBrowse);
				editor.removeListener('mode', endBrowse);

				Dialog.off('onCancel');
				if (closeSubId !== false) {
					Dialog.off('afterCloseSub', closeSubId);
					closeSubId = false;
				}

				if (wasFullscreen) {
					var maximizeCommand = editor.getCommand('maximize');
					if (maximizeCommand.state == CKEDITOR.TRISTATE_OFF) {
						maximizeCommand.exec();
					}
				}

				if (typeof afterClose == "function") {
					afterClose();
					afterClose = false;
				}

				Dialog.closeSub();
				editor.focusManager.unlock();
			}
		}
	});
})();
