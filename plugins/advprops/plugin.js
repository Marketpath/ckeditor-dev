(function () {
    CKEDITOR.plugins.add('advprops', {
        icons: 'advprops',
		init: function (editor) {
			editor.config

            CKEDITOR.dialog.add('advprops', this.path + 'dialogs/advprops.js');

			editor.addCommand('advprops', new CKEDITOR.dialogCommand('advprops', {
				allowedContent: '*[id,name,class,style,data-*,aria-*]'
			}));
			editor.ui.addButton('Advprops', {
				label: 'Element Properties',
				//icon: 'advprops',
				command: 'advprops',
				toolbar: 'tools'
			});

			if (editor.contextMenu) {
                editor.addMenuGroup('advpropsGroup');
                editor.addMenuItem('advpropsItem', {
					label: 'Element Properties',
                    icon: 'advprops',
                    command: 'advprops',
					group: 'advpropsGroup'
				});
				editor.contextMenu.addListener(function () {
					return {
						advpropsItem: CKEDITOR.TRISTATE_OFF
					}
				});
			}
        }
    });
})();
