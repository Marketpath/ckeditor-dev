(function () {
    //copied from maximize plugin
    function refreshCursor(editor) {
        if (editor.editable().isInline()) {
            return;
        }

        // Refresh all editor instances on the page (https://dev.ckeditor.com/ticket/5724).
        var all = CKEDITOR.instances;
        for (var i in all) {
            var one = all[i];
            if (one.mode == 'wysiwyg' && !one.readOnly) {
                var body = one.document.getBody();
                // Refresh 'contentEditable' otherwise
                // DOM lifting breaks design mode. (https://dev.ckeditor.com/ticket/5560)
                body.setAttribute('contentEditable', false);
                body.setAttribute('contentEditable', true);
            }
        }

        if (editor.editable().hasFocus) {
            editor.toolbox.focus();
            editor.focus();
        }
    }

    CKEDITOR.plugins.add('mpmaximize', {
        icons: 'maximize', // %REMOVE_LINE_CORE%
        hidpi: true, // %REMOVE_LINE_CORE%
        init: function (editor) {
            // Maximize plugin isn't available in inline mode yet.
            if (editor.elementMode == CKEDITOR.ELEMENT_MODE_INLINE)
                return;

            var mainDocument = CKEDITOR.document,
                mainWindow = mainDocument.getWindow();

            // Saved resize handler function.
            function resizeHandler() {
                var viewPaneSize = mainWindow.getViewPaneSize();
                editor.resize(viewPaneSize.width, viewPaneSize.height, null, true);
            }

            // Retain state after mode switches.
            var savedState = CKEDITOR.TRISTATE_OFF;

            var //windowScroll = false,
                elStyles = [],
                //resizeArgs = false,
                originalHeight = false,
                originalWidth = false,
                fullscreenZIndex = (editor.config.baseFloatZIndex || 1000) - 5,
                documentStyle = 'position:absolute;top:0;left:0;right:0;bottom:0;margin:0;padding:0;border:0;',
                //'overflow:' + (CKEDITOR.env.webkit ? '' : 'hidden') + ';width:0;height:0;',
                bodyStyle = documentStyle,
                parentStyle = documentStyle + 'display:block;overflow:hidden;z-index:' + fullscreenZIndex + ';width:100%;min-width:100%;height:100%;min-height:100%;',
                containerStyle = documentStyle + 'z-index:' + fullscreenZIndex;

            //if (!CKEDITOR.env.gecko) {
            //	if (CKEDITOR.env.quirks) {
            //		bodyStyle = documentStyle;
            //	}
            //	documentStyle += 'position:fixed;';
            //}

            editor.addCommand('maximize', {
                // Disabled on iOS (https://dev.ckeditor.com/ticket/8307).
                modes: { wysiwyg: !CKEDITOR.env.iOS, source: !CKEDITOR.env.iOS, ace: !CKEDITOR.env.iOS },
                readOnly: 1,
                editorFocus: false,
                exec: function () {
                    var doMaximize = this.state == CKEDITOR.TRISTATE_OFF,
                        container = editor.container,
                        $container = container.$,
                        $docElement = mainDocument.getDocumentElement().$,
                        $bodyElement = mainDocument.getBody().$;

                    var savedSelection = false,
                        isWysiwyg = editor.mode == 'wysiwyg';

                    if (isWysiwyg) {
                        var selection = editor.getSelection();
                        savedSelection = selection && selection.getRanges();
                    }

                    if (doMaximize) {
                        //windowScroll = mainWindow.getScrollPosition();
                        elStyles = [];

                        //resizeArgs = {
                        //	outerHeight: $container.offsetHeight,
                        //	contentsHeight: editor.ui.space('contents').$.offsetHeight,
                        //	outerWidth: $container.offsetWidth
                        //};
                        var inner = container.getFirst(function (node) {
                            return node.type == CKEDITOR.NODE_ELEMENT && node.hasClass('cke_inner');
                        });
                        originalHeight = originalHeight || inner.getSize('height', true);
                        originalWidth = originalWidth || inner.getSize('width', true);

                        var saveNode = function (node) {
                            elStyles.push([node, node.style.cssText, node.scrollLeft, node.scrollTop]);
                        };
                        var setStyle = function (node, style) {
                            node.style.cssText = style;
                            node.scrollLeft = 0;
                            node.scrollTop = 0;
                        };
                        //save initial node information for later restoration
                        //saveNode(inner.$);
                        var node = $container;
                        do {
                            saveNode(node);
                            if (node == $bodyElement) {
                                break;
                            }
                        } while (node = node.parentElement);
                        saveNode($docElement);

                        //now override all nodes with new values
                        // setStyle(inner.$, containerStyle);
                        node = $container;
                        setStyle(node, containerStyle);
                        while (node = node.parentElement) {
                            if (node == $bodyElement) {
                                setStyle(node, bodyStyle);
                                break;
                            }
                            setStyle(node, parentStyle);
                        }
                        setStyle($docElement, documentStyle);

                        //// Scroll to the top left (IE needs some time for it - https://dev.ckeditor.com/ticket/4923).
                        //                  if (windowScroll && (windowScroll.x != 0 || windowScroll.y != 0)) {

                        //	if (CKEDITOR.env.ie) {
                        //		setTimeout(function () {
                        //			mainWindow.$.scrollTo(0, 0);
                        //		}, 0);
                        //	} else {
                        //		mainWindow.$.scrollTo(0, 0);
                        //	}
                        //}

                        // Add cke_maximized class before resize handle since that will change things sizes (https://dev.ckeditor.com/ticket/5580)
                        container.addClass('cke_maximized');

                        if (isWysiwyg && CKEDITOR.env.gecko) {
                            //// Fixing positioning editor chrome in Firefox break design mode. (https://dev.ckeditor.com/ticket/5149)
                            refreshCursor(editor);
                        }

                        //Add event handler for resizing
                        mainWindow.on('resize', resizeHandler);
                        resizeHandler();
                        //if (!isWysiwyg) {
                        //    editor.fire('resize');
                        //}
                    } else {
                        mainWindow.removeListener('resize', resizeHandler);

                        //simple to restore the styles and scroll offsets
                        for (var i = elStyles.length - 1; i >= 0; i--) {
                            elStyles[i][0].style.cssText = elStyles[i][1];
                        }
                        for (var i = elStyles.length - 1; i >= 0; i--) {
                            elStyles[i][0].scrollLeft = elStyles[i][2];
                            elStyles[i][0].scrollTop = elStyles[i][3];
                        }
                        elStyles = [];

                        ////Restore window scroll position
                        //if (windowScroll && (windowScroll.x != 0 || windowScroll.y != 0)) {
                        //	if (CKEDITOR.env.ie) {
                        //		setTimeout(function () {
                        //			mainWindow.$.scrollTo(windowScroll.x, windowScroll.y);
                        //		}, 0);
                        //	} else {
                        //		mainWindow.$.scrollTo(windowScroll.x, windowScroll.y);
                        //	}
                        //}
                        //windowScroll = false;

                        // Remove cke_maximized class.
                        container.removeClass('cke_maximized');

                        //// Webkit requires a re-layout on editor chrome. (https://dev.ckeditor.com/ticket/6695)
                        //if (CKEDITOR.env.webkit) {
                        //	container.setStyle('display', 'inline');
                        //	setTimeout(function () {
                        //		container.setStyle('display', 'block');
                        //	}, 0);
                        //}

                        // Emit a resize event, because this time the size is modified in
                        // restoreStyles.

                        if (originalHeight) {
                            editor.resize(originalWidth, originalHeight, true, true);
                        }
                        originalWidth = originalHeight = false;

                        var cmd = editor.getCommand('autogrow');
                        if (cmd) {
                            editor.execCommand('autogrow');
                        }
                    }

                    this.toggleState();

                    // Toggle button label.
                    var button = this.uiItems[0];
                    if (button) {
                        var label = (this.state == CKEDITOR.TRISTATE_OFF) ? 'Maximize' : 'Minimize';
                        var buttonNode = CKEDITOR.document.getById(button._.id);
                        buttonNode.getChild(1).setHtml(label);
                        buttonNode.setAttribute('title', label);
                        buttonNode.setAttribute('href', 'javascript:void("' + label + '");'); // jshint ignore:line
                    }

                    // Restore selection in editing area.
                    if (editor.mode == 'wysiwyg' && savedSelection) {
                        // Fixing positioning editor chrome in Firefox break design mode. (https://dev.ckeditor.com/ticket/5149)
                        if (CKEDITOR.env.gecko) {
                            refreshCursor(editor);
                        }

                        editor.getSelection().selectRanges(savedSelection);
                        var element = editor.getSelection().getStartElement();
                        if (element) {
                            element.scrollIntoView(true);
                        }
                    }

                    savedState = this.state;
                    editor.fire('maximize', this.state);
                },
                canUndo: false
            });

            editor.ui.addButton && editor.ui.addButton('Maximize', {
                label: 'Maximize',
                command: 'maximize',
                toolbar: 'tools,10'
            });

            // Restore the command state after mode change, unless it has been changed to disabled (https://dev.ckeditor.com/ticket/6467)
            editor.on('mode', function () {
                var command = editor.getCommand('maximize');
                command.setState(command.state == CKEDITOR.TRISTATE_DISABLED ? CKEDITOR.TRISTATE_DISABLED : savedState);
            }, null, null, 100);
        }
    });
})();
