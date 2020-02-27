CKEDITOR.dialog.add('mpembed', function (editor) {
    var dialog,
        widget,
        lastUrl,
        cancelRequest = false,
        okButton, resetButton, instructionElement;

    var instructionMarkup = '<span style="display:block;text-align:center;">- or -</span>',
        invalidUrlMarkup = '<span style="color:red;">Unable to determine media to embed. Please try a different URL or paste the embed code directly below.</span>';

    function onUrlError() {
        instructionElement.setHtml(invalidUrlMarkup);
        dialog.setState(CKEDITOR.DIALOG_STATE_IDLE);
    }
    function onUrlChange(newUrl) {
        if (newUrl == lastUrl) {
            return;
        }
        lastUrl = newUrl;
        if (cancelRequest) {
            cancelRequest();
            cancelRequest = false;
        }

        if (!newUrl) {
            instructionElement.setHtml(instructionMarkup);
            return;
        } else if (!widget.providerUrl || !widget.isUrlValid(newUrl)) {
            instructionElement.setHtml(invalidUrlMarkup);
            return;
        }

        dialog.setState(CKEDITOR.DIALOG_STATE_BUSY);
        instructionElement.setHtml(instructionMarkup);
        okButton.disable();
        resetButton.disable();

        var request = widget.loadContent(newUrl, {
            skipUpdate: true,
            callback: function (url, html) {
                if (url != lastUrl) {
                    return;
                }
                if (html) {
                    dialog.getContentElement('info', 'code').setValue(html, true);
                    okButton.enable();
                    resetButton.enable();
                    dialog.setState(CKEDITOR.DIALOG_STATE_IDLE);
                } else {
                    onUrlError();
                }
                cancelRequest = false;
            },
            errorCallback: function () {
                onUrlError();
                cancelRequest = false;
            }
        });

        var doCancel = function () {
            request.cancel();
            request.callback = request.errorCallback = null;
            if (cancelRequest == doCancel) {
                cancelRequest = false;
                dialog.setState(CKEDITOR.DIALOG_STATE_IDLE);
            }
        };
        cancelRequest = doCancel;
    }
    function onCodeChange(newCode) {
        var urlElement = dialog.getContentElement('info', 'url'),
            hasUrl = !!urlElement.getValue();
        if (cancelRequestIfActive()) {
            urlElement.setValue('', true);
            hasUrl = false;
        }

        okButton.enable();
        instructionElement.setHtml(instructionMarkup);
        resetButton.enable();
    }

    function cancelRequestIfActive() {
        if (cancelRequest) {
            cancelRequest();
            cancelRequest = false;
            return true;
        }
        return false;
    }

    return {
        title: 'Media Embed',
        minWidth: 350,
        minHeight: 50,
        onShow: function () {
            dialog = this;
            widget = this.widget;
            lastUrl = false;
            cancelRequest = false;
            okButton = this.getButton('ok');
            resetButton = this.getButton('reset');
            instructionElement = this.getContentElement('info', 'instructions').getElement();

            okButton.disable();
            instructionElement.setHtml(instructionMarkup);

            if (widget.data.url || widget.data.original_code) {
                resetButton.getElement().show();
                resetButton.disable();
            } else {
                resetButton.getElement().hide();
            }
        },
        contents: [
            {
                id: 'info',
                elements: [
                    {
                        type: 'text',
                        id: 'url',
                        label: editor.lang.common.url,
                        setup: function (widget) {
                            var val = widget.data.url;
                            if (val == 'custom') {
                                val = '';
                            }
                            lastUrl = val;
                            this.setValue(val, true);
                        },
                        validate: function () {
                            var val = this.getValue();
                            if (val && !this.getDialog().widget.isUrlValid(this.getValue())) {
                                return lang.unsupportedUrlGiven;
                            }
                            return true;
                        },
                        onChange: function () {
                            onUrlChange(this.getValue());
                        },
                        onKeyup: function (ckEvent) {
                            var event = ckEvent && ckEvent.data && ckEvent.data.$;
                            if (event && event.which !== 0 && !event.ctrlKey && !event.metaKey) { // && !event.altKey) {
                                onUrlChange(this.getValue());
                            }
                        }
                    }, {
                        type: 'html',
                        id: 'instructions',
                        html: instructionMarkup
                    }, {
                        type: 'textarea',
                        id: 'code',
                        label: 'Embed Code',
                        setup: function (widget) {
                            var el = widget.element,
                                code,
                                name = el.getName();
                            if (name == 'iframe' || name == 'img') {
                                el = el.clone();

                                var attributes = el.getAttributes();
                                for (var attr in attributes) {
                                    if (attr.substr(0, 9) == 'data-cke-' || attr == 'data-widget') {
                                        el.removeAttribute(attr);
                                    } else if (attr == 'class') {
                                        var classes = attributes[attr].split(' ');
                                        if (classes.length) {
                                            for (var i = classes.length - 1; i >= 0; i--) {
                                                if (classes[i].substr(0, 4) == 'cke_') {
                                                    classes.splice(i, 1);
                                                }
                                            }
                                        }
                                        if (classes.length) {
                                            el.setAttribute('class', classes.join(' '));
                                        } else {
                                            el.removeAttribute('class');
                                        }
                                    }
                                }

                                code = el.getOuterHtml();
                            } else {
                                code = el.getHtml();
                            }
                            this.setValue(code, true);
                        },
                        validate: function () {
                            if (!this.getValue()) {
                                return "Cannot embed media without any embed code.";
                            }
                            return true;
                        },
                        onChange: function () {
                            onCodeChange(this.getValue());
                        },
                        onKeyup: function (ckEvent) {
                            var event = ckEvent && ckEvent.data && ckEvent.data.$;
                            if (event && event.which !== 0 && !event.ctrlKey && !event.metaKey) { // && !event.altKey) {
                                onCodeChange(this.getValue());
                            }
                        }
                    }
                ]
            }
        ],
        buttons: [
            {
                id: 'reset',
                type: 'button',
                label: 'Reset',
                title: '',
                accessKey: 'Z',
                onClick: function () {
                    resetButton.disable();
                    var url = dialog.getContentElement('info', 'url').getValue();
                    dialog.getContentElement('info', 'code').setValue(widget.data.original_code || '', true);
                    dialog.getContentElement('info', 'url').setValue(widget.data.url || '', true);
                    okButton.enable();
                }
            },
            CKEDITOR.dialog.okButton,
            CKEDITOR.dialog.cancelButton
        ],
        onOk: function () {
            var code = this.getValueOf('info', 'code'),
                url = this.getValueOf('info', 'url');

            if (code) {
                if (cancelRequestIfActive() || (url && !widget.isUrlValid(url))) {
                    url = '';
                }

                if (!widget.setContent(url, code)) {
                    onUrlError();
                    return false;
                }
            } else {
                widget.destroy();
            }

            //editor.fire('saveSnapshot');
        },
        onCancel: function () {
            if (cancelRequestIfActive()) {
                //this.setState(CKEDITOR.DIALOG_STATE_IDLE);
            }
        }
    };
});
