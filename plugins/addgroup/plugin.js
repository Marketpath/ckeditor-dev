CKEDITOR.plugins.add('addgroup', {
    requires: "wysiwygarea,basicstyles,toolbar,menu,menubutton,table,horizontalrule,specialchar,link,liquidmarkup",
    hidpi: true, // %REMOVE_LINE_CORE%
	tabToOpen: null,
	icons: 'addgroup',
    init: function (editor) {
        if (editor.blockless)
            return;

        var items = {};

        editor.addMenuGroup('addgroup');

        //items.image = {
        //    label: 'Image', //editor.lang.justify.left,
        //    group: 'addgroup',
        //    command: 'image',
        //    order: 1
        //};
        items.table = {
            label: 'Table',
            group: 'addgroup',
            command: 'table',
            order: 2
        };
        items.horizontalrule = {
            label: 'Horizontal Line',
            group: 'addgroup',
            command: 'horizontalrule',
            order: 3
        };
        items.specialchar = {
            label: 'Special Character',
            group: 'addgroup',
            command: 'specialchar',
            order: 4
		};
		//items.anchor = {
		//	label: 'Named Anchor',
		//	group: 'addgroup',
		//	command: 'anchor',
		//	order: 5
		//};
		if (editor.config.ServiceFactory && editor.config.Dialog) {
			items.snippet = {
				label: 'Snippet',
				//icon: 'fa fa-file-text-o fa',
				//icon: 'templates',
				icon: 'snippet',
				group: 'addgroup',
				command: 'mpSnippet',
				order: 6
			};
			items.form = {
				label: 'Form',
				//icon: 'fa fa-sliders fa',
				icon: 'form',
				group: 'addgroup',
				command: 'mpForm',
				order: 7
			};
			//items.gallery = {
			//	label: 'Gallery',
			//	//icon: 'fa fa-object-group fa',
			//	icon: 'gallery',
			//	group: 'addgroup',
			//	command: 'mpGallery',
			//	order: 8
			//};
		};
		//items.flash = {
		//	label: 'Flash',
		//	group: 'addgroup',
		//	command: 'flash',
		//	order: 9
		//};
		//items.embed = {
		//	label: 'Embed',
		//	group: 'addgroup',
		//	command: 'mpembed',
		//	order: 9
		//};
        items.liquidmarkup = {
            label: 'Liquid Markup',
            group: 'addgroup',
            command: 'liquidmarkup',
            order: 10
        };

        if (editor.addMenuItems) {
            editor.addMenuItems(items);
        }

        editor.ui.add('AddGroup', CKEDITOR.UI_MENUBUTTON, {
            label: 'Add/Modify',
            //icon: 'addgroup',
            toolbar: "insert",
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
