(function () {
	CKEDITOR.plugins.add('mpdialog', {
		//this is a really bad place to "bootstrap" these icons. 
		icons: 'tablecell,tablecell_delete,tablecell_insertAfter,tablecell_insertBefore,tablecell_merge,tablecell_merge_down,tablecell_merge_right,tablecell_split_vertical,tablecell_split_horizontal,tablecell_properties,tablecolumn,tablecolumn_delete,tablecolumn_insertAfter,tablecolumn_insertBefore,tabledelete,tablerow,tablerow_delete,tablerow_insertAfter,tablerow_insertBefore',
		init: function (editor) {
			editor.mpdialog = {
				browsing: false,
				wasFullscreen: false,
				closeSubId: false,
				onCancelId: false,
				afterClose: false,
				oldPath: '',
				openDialog: function (name, attrs, afterClose) {
					var Dialog = editor.config.Dialog;
					if (!Dialog) {
						return false;
					}

					//console.log('Opening ' + editor.id);

					var firstEditor = Dialog.get('ckeditor_browsing_instance');
					if (firstEditor && firstEditor != editor && firstEditor.mpdialog && firstEditor.mpdialog.browsing) {
						firstEditor.mpdialog.wasFullscreen = false;
						firstEditor.mpdialog.endBrowse({ listenerData: { name: 'openDialog', forceclose: true } });
					}
					if (editor.mpdialog.browsing) {
						editor.mpdialog.endBrowse({ listenerData: { name: 'openDialog', forceclose: true } });
					}
					Dialog.set('ckeditor_browsing_instance', editor);

					if (Dialog.get('fromCache', false)) {
						attrs['from-cache'] = true;
						var cacheName = Dialog.get('cacheName', false);
						if (cacheName) {
							attrs['cache-name'] = cacheName;
						}
					}
					if (Dialog.get('getDefinitionFn')) {
						attrs['define-from'] = 'getDefinitionFn';
					}

					editor.mpdialog.afterClose = afterClose;
					editor.mpdialog.browsing = true;
					editor.focusManager.lock();

					var maximizeCommand = editor.getCommand('maximize');
					editor.mpdialog.wasFullscreen = maximizeCommand && maximizeCommand.state == CKEDITOR.TRISTATE_ON;
					if (editor.mpdialog.wasFullscreen) {
						maximizeCommand.exec();
					}

					var os = Dialog.openSub(name, attrs);
					var afterOpen = function () {
						//console.log('Opened ' + editor.id);
						editor.on('change', editor.mpdialog.endBrowse, null, { name: 'change', forceclose: true });
						editor.mpdialog.oldPath = editor.elementPath();
						editor.on('selectionChange', editor.mpdialog.selectionChangeListener, null, { name: 'selectionChange', forceclose: true });
						editor.on('mode', editor.mpdialog.endBrowse, null, { name: 'mode', forceclose: true });

						editor.mpdialog.closeSubId = Dialog.on('afterCloseSub', function () {
							editor.mpdialog.endBrowse({ listenerData: { name: 'afterCloseSub', forceclose: false } });
						});
						editor.mpdialog.onCancelId = Dialog.on('onCancel', function () {
							editor.mpdialog.endBrowse({ listenerData: { name: 'onCancel', forceclose: true } });
						});

						if (editor.config.$scope) {
							editor.config.$scope.$evalAsync();
						}
					};
					if (typeof os == 'object' && typeof os.then == 'function') {
						os.then(afterOpen, function () {
							editor.mpdialog.browsing = false;
							editor.focusManager.unlock();
						})
					} else {
						afterOpen();
					}
				},
				selectionChangeListener: function (event) {
					var newPath = event.data.path;
					if (!newPath.compare(editor.mpdialog.oldPath)) {
						editor.mpdialog.endBrowse(event);
					}
				},
				endBrowse: function (event) {
					var eventname = event && event.listenerData && event.listenerData.name,
						forceclose = event && event.listenerData && event.listenerData.forceclose;

					var Dialog = editor.config.Dialog;
					if (!Dialog || (!forceclose && Dialog.get('ckeditor_browsing_instance') != editor)) {
						return;
					}

					//console.log('Closing ' + editor.id + (eventname ? ' from ' + eventname : ''));
					editor.mpdialog.browsing = false;

					editor.removeListener('change', editor.mpdialog.endBrowse);
					editor.removeListener('selectionChange', editor.mpdialog.selectionChangeListener);
					editor.removeListener('mode', editor.mpdialog.endBrowse);

					if (editor.mpdialog.closeSubId !== false) {
						Dialog.off('afterCloseSub', editor.mpdialog.closeSubId);
						editor.mpdialog.closeSubId = false;
					}
					if (editor.mpdialog.onCancelId !== false) {
						Dialog.off('onCancel', editor.mpdialog.onCancelId);
						editor.mpdialog.onCancelId = false;
					}

					if (editor.mpdialog.wasFullscreen) {
						var maximizeCommand = editor.getCommand('maximize');
						if (maximizeCommand.state == CKEDITOR.TRISTATE_OFF) {
							maximizeCommand.exec();
						}
					}

					if (typeof editor.mpdialog.afterClose == "function") {
						editor.mpdialog.afterClose();
						editor.mpdialog.afterClose = false;
					}

					Dialog.closeSub();
					editor.focusManager.unlock();
				}
			};

			editor.on('focus', function (event) {
				var Dialog = editor.config.Dialog;
				if (Dialog) {
					var firstEditor = Dialog.get('ckeditor_browsing_instance');
					if (firstEditor && firstEditor.mpdialog) {
						firstEditor.mpdialog.wasFullscreen = false;
					}
					//if (firstEditor && firstEditor != editor && firstEditor.mpdialog) {
					//firstEditor.mpdialog.endBrowse({ listenerData: { name: 'otherfocus', forceclose: true } });
					//}
				}
			});
		}
	});
})();
