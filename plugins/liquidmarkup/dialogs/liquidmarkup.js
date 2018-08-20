CKEDITOR.dialog.add('liquidmarkup', function (editor) {
    return {
        title: 'Liquid Markup',
        resizable: CKEDITOR.DIALOG_RESIZE_HEIGHT,
        minWidth: 400,
        minHeight: 400,
        onOk: function (evt) {
            var markup = this.getValueOf('liquidmarkup', 'markup');
            editor.fire('setliquidmarkup', markup);
        },
        onCancel: function () {
            editor.fire('cancelliquidmarkup');
        },
        contents: [
            {
                id: 'liquidmarkup',
                elements: [
                    {
                        id: 'markup',
                        type: 'textarea',
                        label: 'Markup'
                    }
                ]
            }
        ]
    };
});