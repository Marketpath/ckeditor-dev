(function () {
	CKEDITOR.plugins.add('mpdialog', {
		//this is a really bad place to "bootstrap" these icons. 
		icons: 'tablecell,tablecell_delete,tablecell_insertAfter,tablecell_insertBefore,tablecell_merge,tablecell_merge_down,tablecell_merge_right,tablecell_split_vertical,tablecell_split_horizontal,tablecell_properties,tablecolumn,tablecolumn_delete,tablecolumn_insertAfter,tablecolumn_insertBefore,tabledelete,tablerow,tablerow_delete,tablerow_insertAfter,tablerow_insertBefore',
		init: function (editor) {
			//We don't actually have to run any code
			//All we have to do is expose the mpdialog plugin object
		}
	});
	CKEDITOR.plugins.mpdialog = {
		editorInstance: false,
		wasFullscreen: false,
		closeSubId: false,
		afterClose: false,
		openDialog: function (editor, name, attrs, afterClose) {
			if (this.editorInstance) {
				this.endBrowse();
			}

			var Dialog = editor.config.Dialog;
			if (!Dialog) {
				return false;
			}
			this.editorInstance = editor;
			editor.focusManager.lock();

			var maximizeCommand = editor.getCommand('maximize');
			this.wasFullscreen = maximizeCommand && maximizeCommand.state == CKEDITOR.TRISTATE_ON;
			if (this.wasFullscreen) {
				maximizeCommand.exec();
			}

			editor.on('change', this.endBrowse);
			editor.on('selectionChange', this.endBrowse);
			editor.on('mode', this.endBrowse);

			this.closeSubId = Dialog.on('afterCloseSub', this.endBrowse);
			Dialog.off('onCancel').on('onCancel', this.endBrowse);

			Dialog.openSub(name, attrs);
			if (this.editorInstance.config.$scope) {
				this.editorInstance.config.$scope.$apply();
			}
		},
		endBrowse: function () {
			var mpdialog = CKEDITOR.plugins.mpdialog;
			var editor = mpdialog.editorInstance,
				Dialog = editor && editor.config.Dialog;

			mpdialog.editorInstance = false;
			if (!Dialog) {
				return;
			}

			editor.removeListener('change', mpdialog.endBrowse);
			editor.removeListener('selectionChange', mpdialog.endBrowse);
			editor.removeListener('mode', mpdialog.endBrowse);

			Dialog.off('onCancel');
			if (mpdialog.closeSubId !== false) {
				Dialog.off('afterCloseSub', mpdialog.closeSubId);
				mpdialog.closeSubId = false;
			}

			if (mpdialog.wasFullscreen) {
				var maximizeCommand = editor.getCommand('maximize');
				if (maximizeCommand.state == CKEDITOR.TRISTATE_OFF) {
					maximizeCommand.exec();
				}
			}

			if (typeof mpdialog.afterClose == "function") {
				mpdialog.afterClose();
				mpdialog.afterClose = false;
			}

			Dialog.closeSub();
			editor.focusManager.unlock();
		}
	}
})();
