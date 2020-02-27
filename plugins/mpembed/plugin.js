(function () {
    CKEDITOR.plugins.add('mpembed', {
        icons: 'embed', // %REMOVE_LINE_CORE%
        hidpi: true, // %REMOVE_LINE_CORE%
        //requires: 'embedbase',
        requires: 'dialog,widget',
        onLoad: function () {
            CKEDITOR._.mpembedCallbacks = [];
        },
        init: function (editor) {
            CKEDITOR.dialog.add('mpembed', this.path + 'dialogs/mpembed.js');

            editor.widgets.add('mpembed', {
                mask: true,
                template: '<div></div>',
                pathName: 'media object',
                urlRegExp: /^((https?:)?\/\/|www\.)/i,
                dialog: 'mpembed',
                button: 'Insert Media Embed',
                allowedContent: 'div img[!data-oembed-url]',
                requiredContent: 'div[data-oembed-url]',
                providerUrl: editor.config.embed_provider || '',
                styleToAllowedContentRules: function (style) {
                    // The filter element callback actually allows all divs with data-oembed-url,
                    // so registering styles to the filter is virtually unnecessary because
                    // classes won't be filtered out. However, registering them will make filter.check() work
                    // which may be important in some cases.

                    var classes = style.getClassesArray();
                    return {
                        div: {
                            propertiesOnly: true,
                            classes: classes,
                            attributes: '!data-oembed-url'
                        }
                    };
                },
                upcast: function (el, data) {
                    var url = el.attributes['data-oembed-url'];
                    if (url == 'custom') {
                        url = '';
                    }
                    if (url && (el.name == 'div' || el.name == 'img')) {
                        data.url = url;
                        data.original_code = el.getHtml();
                        return true;
                    } else if (el.name == 'iframe') {
                        data.url = url;
                        //remove this attribute from the "original_code"
                        delete el.attributes['data-oembed-url'];
                        data.original_code = el.getOuterHtml();
                        //                 if (url) {
                        ////restore the embed URL
                        //                     el.attributes['data-oembed-url'] = url;
                        //                 }
                        return true;
                    }
                },
                upcastPriority: 8, //before image
                downcast: function (el) {
                    if (el.name != 'iframe' || (this.data.url && this.data.url != 'custom')) {
                        el.attributes['data-oembed-url'] = this.data.url || 'custom';
                    } else {
                        delete el.attributes['data-oembed-url'];
                    }
                },
                init: function () {
                    this.on('dialog', function (evt) {
                        evt.data.widget = this;
                    }, this);
                },
                isUrlValid: function (url) {
                    return this.urlRegExp.test(url);
                },
                loadContent: function (newUrl, opts) {
                    opts = opts || {};

                    var widget = this,
                        scriptElement = false,
                        request = {
                            url: widget.providerUrl.replace('{url}', encodeURIComponent(newUrl)),
                            cancel: function noop() { }
                        };

                    widget.data.original_code = false;

                    var callback = function (response) {
                        setTimeout(function () {
                            request.cancel();

                            var html;
                            if (typeof response != 'object') {
                                if (typeof opts.errorCallback == 'function') {
                                    opts.errorCallback();
                                }
                                return;
                            } else if (response.type == 'photo') {
                                html = '<img src="' + CKEDITOR.tools.htmlEncodeAttr(response.url) + '" ' + 'alt="' + CKEDITOR.tools.htmlEncodeAttr(response.title || '') + '" style="max-width:100%;height:auto" />';
                            } else if (response.type == 'video' || response.type == 'rich') {
                                // Embedded iframes are added to page's focus list. Adding negative tabindex attribute
                                // removes their ability to be focused by user. (https://dev.ckeditor.com/ticket/14538)
                                html = response.html.trim().replace(/<iframe/g, '<iframe tabindex="-1"');

                                var fakeElement = CKEDITOR.document.createElement('div');
                                fakeElement.setHtml(html);
                                html = fakeElement.getHtml();
                            } else {
                                //error :(
                                if (typeof opts.errorCallback == 'function') {
                                    opts.errorCallback();
                                }
                                return;
                            }

                            if (!opts.skipUpdate) {
                                this.setContent(newUrl, html);
                            }

                            if (typeof opts.callback == 'function') {
                                opts.callback(newUrl, html);
                            }

                            widget.data.original_code = html;
                        });
                    };

                    if (navigator.userAgent.match(/Explorer/)) {
                        var scriptElement = new CKEDITOR.dom.element('script'),
                            nextCbNum = CKEDITOR._.mpembedCallbacks.length
                        request.url += '&callback=' + encodeURIComponent('CKEDITOR._.mpembedCallbacks[' + nextCbNum + ']');
                        request.cancel = function () {
                            if (scriptElement) {
                                scriptElement.remove();
                                delete CKEDITOR._.mpembedCallbacks[nextCbNum];
                                scriptElement = null;
                            }
                        };

                        CKEDITOR._.mpembedCallbacks[nextCbNum] = callback;
                        scriptElement.setAttribute('src', request.url);
                        scriptElement.on('error', function () {
                            request.cancel();

                            if (typeof opts.errorCallback == 'function') {
                                opts.errorCallback();
                            }
                        });
                        CKEDITOR.document.getBody().append(scriptElement);
                        return request;
                    }

                    var req = new XMLHttpRequest();
                    req.open('GET', request.url, true);
                    req.onreadystatechange = function (e) {
                        if (req.readyState == 4) {
                            var data;
                            if (req.status == 200) {
                                try {
                                    data = JSON.parse(req.responseText);
                                } catch (e) { }
                            }
                            callback(data);
                        }
                    };
                    req.send();

                    return request;
                },
                setContent: function (url, content) {
                    if (content) {
                        var contentElement = CKEDITOR.document.createElement('div');
                        try {
                            contentElement.setHtml(content.trim());
                        } catch (e) {
                            return false;
                        }
                        var childCount = contentElement.getChildCount();
                        if (childCount == 0) {
                            return false;
                        }
                        if (childCount == 1) {
                            var contentElement = contentElement.getChild(0);
                            if (contentElement.type != CKEDITOR.NODE_ELEMENT) {
                                return false;
                            }
                        }
                        if ((url && url != 'custom') || contentElement.getName() == 'div') {
                            contentElement.setAttribute('data-oembed-url', url || 'custom');
                        }

                        if (this.ready) {
                            var range = editor.createRange();
                            range.setStartAt(this.wrapper, CKEDITOR.POSITION_BEFORE_START);
                            range.collapse(true);
                            editor.insertHtml(contentElement.getOuterHtml(), 'html', range);
                        } else {
                            var selection = editor.getSelection();
                            var range = selection.getRanges()[0];
                            editor.insertHtml(contentElement.getOuterHtml(), 'html', range);
                            this.destroy();
                            return true;
                        }
                    }
                    if (this.ready) {
                        this.wrapper.remove();
                    }
                    this.destroy(true);
                    return true;
                }
            });
            //var widgetDefinition = CKEDITOR.plugins.embedBase.createWidgetBaseDefinition(editor);

            if (!editor.config.embed_provider) {
                CKEDITOR.error('embed-no-provider-url');
            }

            if (editor.ui.addButton) {
                editor.ui.addButton('Embed', {
                    label: 'Embed',
                    command: 'mpembed',
                    group: 'insert'
                });
            }

            // Do not filter contents of the div[data-oembed-url] at all.
            editor.filter.addElementCallback(function (el) {
                if ('data-oembed-url' in el.attributes) {
                    return CKEDITOR.FILTER_SKIP_TREE;
                }
            });
        }
    });
})();
