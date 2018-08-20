CKEDITOR.plugins.add('aligngroup', {
    requires: "wysiwygarea,basicstyles,toolbar,menu,menubutton,justify",
    //lang: 'af,ar,bg,bn,bs,ca,cs,cy,da,de,el,en,en-au,en-ca,en-gb,eo,es,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
    hidpi: true, // %REMOVE_LINE_CORE%
    tabToOpen: null,
    init: function (editor) {
        if (editor.blockless)
            return;

        var items = {};

        editor.addMenuGroup('aligngroup');

        items.justifyleft = {
            label: 'Align left', //editor.lang.justify.left,
            group: 'aligngroup',
            command: 'justifyleft',
            order: 1
        };
        items.justifycenter = {
            label: 'Align center', //editor.lang.justify.center,
            group: 'aligngroup',
            command: 'justifycenter',
            order: 2
        };

        items.justifyright = {
            label: 'Align right', //editor.lang.justify.right,
            group: 'aligngroup',
            command: 'justifyright',
            order: 3
        };

        items.justifyblock = {
            label: 'Align justified', //editor.lang.justify.block,
            group: 'aligngroup',
            command: 'justifyblock',
            order: 4
        };

        if (editor.addMenuItems) {
            editor.addMenuItems(items);
        }

        editor.ui.add('AlignGroup', CKEDITOR.UI_MENUBUTTON, {
            label: 'Alignment',
            icon: 'justifyleft',
            toolbar: "align",
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
