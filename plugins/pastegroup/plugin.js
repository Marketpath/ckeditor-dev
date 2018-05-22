CKEDITOR.plugins.add('pastegroup', {
	requires: "wysiwygarea,clipboard,pastetext,pastefromword,toolbar,menu,menubutton",
	hidpi: true, // %REMOVE_LINE_CORE%
	tabToOpen: null,
	init: function (editor) {
		if (editor.blockless)
			return;

		var items = {};

		editor.addMenuGroup('pastegroup');

		items.cut = {
			label: 'Cut',
			group: 'pastegroup',
			command: 'cut',
			order: 1
		};
		items.copy = {
			label: 'Copy',
			group: 'pastegroup',
			command: 'copy',
			order: 2
		};
		items.paste = {
			label: 'Paste',
			group: 'pastegroup',
			command: 'paste',
			order: 3
		};
		items.pastetext = {
			label: 'Paste Text',
			group: 'pastegroup',
			command: 'pastetext',
			order: 4
		};
		items.pastefromword = {
			label: 'Paste from Word',
			group: 'pastegroup',
			command: 'pastefromword',
			order: 5
		};

		if (editor.addMenuItems) {
			editor.addMenuItems(items);
		}

		editor.ui.add('PasteGroup', CKEDITOR.UI_MENUBUTTON, {
			label: 'Copy / Paste',
			icon: 'paste',
			toolbar: "clipboard",
			modes: {
				wysiwyg: 1
			},
			onMenu: function () {
				var active = {};

				// Make all items active.
				for (var p in items) {
					active[p] = CKEDITOR.TRISTATE_OFF;
				}

				return active;
			}
		});
	}
});
