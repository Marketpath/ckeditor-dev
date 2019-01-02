CKEDITOR.plugins.add('strikegroup', {
	requires: "wysiwygarea,basicstyles,toolbar,menu,menubutton",
	hidpi: true, // %REMOVE_LINE_CORE%
	tabToOpen: null,
	init: function (editor) {
		if (editor.blockless)
			return;

		var items = {};

		editor.addMenuGroup('strikegroup');

		items.strike = {
			label: 'Strikethrough', //editor.lang.justify.left,
			group: 'strikegroup',
			command: 'strike',
			order: 1
		};
		items.superscript = {
			label: 'Superscript', //editor.lang.justify.center,
			group: 'strikegroup',
			command: 'superscript',
			order: 2
		};

		items.subscript = {
			label: 'Subscript', //editor.lang.justify.right,
			group: 'strikegroup',
			command: 'subscript',
			order: 3
		};

		if (editor.addMenuItems) {
			editor.addMenuItems(items);
		}

		editor.ui.add('StrikeGroup', CKEDITOR.UI_MENUBUTTON, {
			label: 'Additional Styles',
			icon: 'strike',
			toolbar: "basicstyles",
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
