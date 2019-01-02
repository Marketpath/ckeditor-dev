CKEDITOR.plugins.add('ace', {
	icons: 'ace,ace-rtl', // %REMOVE_LINE_CORE%
	hidpi: true, // %REMOVE_LINE_CORE%
	init: function (editor) {
		if (!window.ace) {
			return;
		}

		// Source mode in inline editors is only available through the "sourcedialog" plugin.
		if (editor.elementMode == CKEDITOR.ELEMENT_MODE_INLINE) {
			return;
		}

		var acee = false;

		editor.addMode('ace', function (callback) {
			var contentsSpace = editor.ui.space('contents'),
				div = contentsSpace.getDocument().createElement('div'),
				initData = editor.getData();;

			//contentSpace.$.style.position = 'relative';

			div.setStyles({
				height: '100%',
				width: '100%',
				'text-align': 'left'
			});
			//div.addClass('cke_source').addClass('cke_reset'); //.addClass('cke_enable_context_menu');

			contentsSpace.append(div);

			var options = {
				theme: 'ace/theme/github',
				mode: 'ace/mode/html',
				showPrintMargin: false,
				wrap: true
			};

			acee = window.ace.edit(div.$); //, options);
			var container = acee.renderer.getContainerElement(),
				session = acee.getSession();

			//helpful for html mode
			session.on('changeAnnotation', function () {
				var annotations = session.getAnnotations() || [];
				var r1 = /doctype first\. Expected/,
					r2 = /Unexpected End of file\. Expected/,
					i = len = annotations.length;
				while (i--) {
					if (r1.test(annotations[i].text) || r2.test(annotations[i].text)) {
						annotations.splice(i, 1);
					}
				}
				if (annotations.length < len) {
					session.setAnnotations(annotations);
				}
			});

			acee.setOptions(options);
			acee.$blockScrolling = Infinity;

			acee.on('focus', function () {
				editor.fire('focus');
			});
			acee.on('blur', function () {
				editor.fire('blur');
			});

			//container.style.position = 'absolute';
			//container.style.top = 0;
			//container.style.left = 0;
			//container.style.right = 0;
			//container.style.bottom = 0;
			//container.style.height = '100%';
			//container.style.margin = 0;

			session.setValue(initData);

			//make the editor fill the space
			editor.on('resize', resizeAce);

			session.on('change', function () {
				var val = session.getValue();
				editor.setData(val, {
					internal: true,
					noSnapshot: true
				});
				editor.fire('change');
			});

			callback();
		});

		editor.addCommand('ace', {
			modes: { wysiwyg: 1, ace: 1 },
			editorFocus: false,
			readOnly: 1,
			exec: function (editor) {
				if (editor.mode == 'wysiwyg') {
					editor.fire('saveSnapshot');
				}
				editor.setMode(editor.mode == 'ace' ? 'wysiwyg' : 'ace');
				editor.getCommand('ace').setState(editor.mode == 'ace' ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF);
			},
			canUndo: false
		});

		if (editor.ui.addButton) {
			editor.ui.addButton('Ace', {
				label: 'Source',
				command: 'ace',
				toolbar: 'mode,10'
			});
		}

		//var cmd = editor.getCommand('maximize');
		//if (cmd && cmd.modes) {
		//	//enable maximize button in ace mode
		//	cmd.modes.ace = 1;

		//}

		editor.on('mode', function () {
			if (editor.mode == 'ace') {

				//var config = editor.config.aceConfig; //???

				//	//if (scope.readonly || angular.isDefined(attrs.readonly)) {
				//	//	_editor.setReadOnly(true);
				//	//}

				

				


				//		// launch the editor and set the theme
				//		session.setValue(editor.getData());

				//		// this function checks to see if we are returning to design view.  If so, purge all the ACE stuff
				//		function returnToDesignView(e) {
				//			if (e.data.name == 'source') {
				//				// Set the data of the CKEditor to the value of ACE Editor
				//				editor.setData(session.getValue(), function () {
				//					//console.log('change saved');
				//				}, false);

				//				editor.fire('dataReady');
				//			}
				//		}
				//		// this function will update the z-index of the ACE Editor based on whether we are maximized or not
				//		function maximizeACE(e) {
				//			// if they are maximizing it
				//			if (e.data.name == 'maximize') {
				//				// if maximixed 
				//				if (e.data.command.state == 1) {
				//					$('#aceEditor_container_' + editorID).css('z-index', '9997');
				//				} else {
				//					$('#aceEditor_container_' + editorID).css('z-index', 'auto');
				//				}
				//			}
				//		}
				//	}
				//});
			} else {
				cleanup();
			}
		});

		editor.on('destroy', cleanup);

		function resizeAce() {
			acee && acee.resize(true);
		}

		function cleanup() {
			if (acee) {
				editor.removeListener('resize', resizeAce);
				acee.destroy();
				acee = false;
			}
		}
	}
});
