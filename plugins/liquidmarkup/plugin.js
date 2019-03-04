(function () {
    CKEDITOR.dom.liquidmarkup = function (element, ownerDocument) {
        if (typeof element == 'string') {
            element = (ownerDocument ? ownerDocument.$ : document).createElement(element);
        }
        CKEDITOR.dom.element.call(this, element);
    };

    CKEDITOR.dom.liquidmarkup.prototype = new CKEDITOR.dom.liquidmarkup();


    for (var elem in CKEDITOR.dtd) {
        if (CKEDITOR.dtd.hasOwnProperty(elem) && !(elem.substr(0, 1) == '$')) {
            CKEDITOR.dtd[elem]['liquid-markup'] = 1;
        }
    }
    CKEDITOR.dtd['liquid-markup'] = { '#': 1 }; //can only contain a textnode
    CKEDITOR.dtd.$block['liquid-markup'] = 1;
    //CKEDITOR.dtd.$blockLimit['liquid-markup'] = 1;
    //CKEDITOR.dtd.$cdata['liquid-markup'] = 1;
    CKEDITOR.dtd.$editable['liquid-markup'] = 1;
    CKEDITOR.dtd.$inline['liquid-markup'] = 1;
    //CKEDITOR.dtd.$nonEditable['liquid-markup'] = 1;
    CKEDITOR.dtd.$removeEmpty['liquid-markup'] = 1;
    CKEDITOR.dtd.$tableContent['liquid-markup'] = 1;


    CKEDITOR.plugins.add('liquidmarkup', {
        requires: 'mpdialog',
        icons: 'liquidmarkup,mpForm,snippet,gallery',
        onLoad: function () {
			CKEDITOR.addCss('liquid-markup[type]{display:block;background:#0097cf;color:#0097cf;border-width:2px;margin:10px 0;white-space:nowrap;overflow:hidden;cursor:default;user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;}');
            CKEDITOR.addCss('liquid-markup[type]:before{content:attr(type) " " attr(title);font-size:1em;color:white;}');
			CKEDITOR.addCss('liquid-markup,liquid-markup[type=custom]{display:inline-block;border:1px solid #e8761c;padding:0 4px;margin-bottom:10px;white-space:pre-wrap;overflow:initial;cursor:text;user-select:all;-webkit-user-select:all;-webkit-user-select:text;-moz-user-select:all;-ms-user-select:all;}');
            CKEDITOR.addCss('liquid-markup:before,liquid-markup[type=custom]:before{content:"{ }";color:#e8761c;font-size:9px;vertial-align:top;padding-right:4px;}');
        },
        init: function (editor) {
            //add 'liquidmarkup' command
            CKEDITOR.dialog.add('liquidmarkup', this.path + 'dialogs/liquidmarkup.js');

            editor.addCommand('liquidmarkup', {
                async: true,
                exec: function (editor) {
                    tryCommand('custom', 'liquidmarkup', this);
                }
                //refresh: function(editor, path) {
                //},
                //contextSensitive: true
            });

            if (editor.contextMenu) {
                editor.addMenuGroup('liquidmarkupGroup');
                editor.addMenuItem('liquidmarkupItem', {
                    label: 'Edit Markup',
                    icon: this.path + 'icons/liquidmarkup.png',
                    command: 'liquidmarkup',
                    group: 'liquidmarkupGroup'
                });

                editor.contextMenu.addListener(function (element) {
                    var lm = element.getAscendant('liquid-markup', true);
                    if (lm) {
                        var att = lm.getAttribute('type');
                        if (!att || att == 'custom') {
                            return { liquidmarkupItem: CKEDITOR.TRISTATE_OFF };
                        }
                    }
                });
            }

            if (editor.config.ServiceFactory && editor.config.Dialog) {
                editor.addCommand('mpForm', {
                    async: true,
                    exec: function (editor) {
                        tryCommand('Form', 'mpForm', this);
                    }
                    //refresh: function(editor, path) {
                    //},
                    //contextSensitive: true
                });
                editor.addCommand('mpGallery', {
                    async: true,
                    exec: function (editor) {
                        tryCommand('Gallery', 'mpGallery', this);
                    }
                    //refresh: function(editor, path) {
                    //},
                    //contextSensitive: true
                });
                editor.addCommand('mpSnippet', {
                    async: true,
                    exec: function (editor) {
                        tryCommand('Snippet', 'mpSnippet', this);
                    }
                    //refresh: function(editor, path) {
                    //},
                    //contextSensitive: true
				});

				if (editor.ui.addButton) {
					editor.ui.addButton('Gallery', {
						label: 'Gallery',
						command: 'mpGallery',
						toolbar: 'insert'
					});
					editor.ui.addButton('Form', {
						label: 'Form',
						command: 'mpForm',
						toolbar: 'insert'
					});
					editor.ui.addButton('Snippet', {
						label: 'Snippet',
						command: 'mpSnippet',
						toolbar: 'insert'
					});
				}
            }

            editor.on('doubleclick', function (evt) {
				if (evt.data.element.is('liquid-markup')) {
					editor.getSelection().selectElement(evt.data.element);
					tryCommand(); //evt.data.element);
                    evt.stop();
                }
            });

            

            function tryCommand(type, name, cmd) {
                var selection = editor.getSelection(),
                    range = selection.getRanges()[0],
                    targetElement = selection.getSelectedElement() || selection.getStartElement() || range.startContainer,
                    editExisting = false,
                    isCustom = !type || type == 'custom',
                    initialMarkup = '{% comment %}This is Liquid Markup{% endcomment %}',
					service;

				//if (type && typeof type == 'object') {
				//}

                var finishCommand = function () {
                    editor.focus();
                    selection.selectRanges([range]);
                    if (name && cmd) {
                        editor.fire('afterCommandExec', {
                            name: name,
                            command: cmd
                        });
                    }
                };

                if (targetElement.type == CKEDITOR.NODE_TEXT) {
                    targetElement = targetElement.getParent();
                }

                if (targetElement.is('liquid-markup')) {
                    editExisting = true;
                    type = (editor.config.ServiceFactory && editor.config.Dialog) ? targetElement.getAttribute('type') : 'custom';
                    isCustom = !type || type == 'custom';
                    if (!isCustom) {
                        service = editor.config.ServiceFactory(type);
                        if (!service) {
                            type = 'custom';
                            isCustom = true;
                        }
                    }
                    if (isCustom) {
                        initialMarkup = targetElement.getText();
                    }
                } else {
                    if (!editor.config.ServiceFactory || !editor.config.Dialog) {
                        type = 'custom';
                        isCustom = true;
                    }
                    if (!isCustom) {
                        service = editor.config.ServiceFactory(type);
                        if (!service) {
                            type = 'custom';
                            isCustom = true;
                        }
                    }
                    if (range.collapsed) {
                        if (targetElement.getText().trim() == '') {
                            editExisting = true;
                        }
                    } else {
                        if (isCustom) {
                            initialMarkup = selection.getSelectedText();
                        }
                    }
                }

                var setMarkup = function (markup, name) {
                    markup = markup.trim();

                    if (!markup) {
                        range.deleteContents();
                        finishCommand();
                        return;
                    }

                    var newElement = document.createElement('liquid-markup');
                    newElement.innerText = markup;
                    if (!isCustom) {
                        newElement.setAttribute('type', type);
                        newElement.setAttribute('contenteditable', 'false');
                    }
                    if (name) {
                        newElement.setAttribute('title', name);
                    }
                    var ckElement = new CKEDITOR.dom.element(newElement);


                    if (editExisting) {
                        ckElement.replace(targetElement);
                        range.setStartAfter(ckElement);
                        range.collapse(true);
                    } else {
                        //range.setStartAfter(newElement);
                        range.deleteContents();
                        range.insertNode(ckElement);
                        range.collapse(false);
                    }

                    finishCommand();
                }

                if (isCustom) {
                    var finishCustom = function () {
                        editor.removeListener('setliquidmarkup');
                        editor.removeListener('cancelliquidmarkup');
                    };
                    editor.on('setliquidmarkup', function (evt) {
                        setMarkup(evt.data);
                        finishCustom();
                    });
                    editor.on('cancelliquidmarkup', finishCustom);
                    editor.openDialog('liquidmarkup', function (dialog) {
                        dialog.once('show', function () {
                            dialog.setValueOf('liquidmarkup', 'markup', initialMarkup);
                        });
                    });
                } else {
					var Dialog = editor.config.Dialog;

					var onFinishId = Dialog.off('onEntitySelect').on('onEntitySelect', function (input) {
						var guid = input ? typeof input === "string" ? input : input.GUID || input.item.GUID : void 0;
						if (!guid) {
							setMarkup('');
						}

						service.get(guid).then(function (obj) {
							setMarkup('{% ' + type.toLowerCase() + ' output_to_template "' + guid + '" %}', obj.Name);
						});

						return true;
					});

					var finish = function () {
						Dialog.off('onEntitySelect', onFinishId);
					};

					editor.mpdialog.openDialog('select-' + type.toLowerCase(), {}, finish);
                }
            }

            if (editor.dataProcessor && editor.dataProcessor.writer) {
                editor.dataProcessor.writer.setRules('liquid-markup', {
                    indent: false,
                    breakBeforeOpen: false,
                    breakAfterOpen: false,
                    breakBeforeClose: false,
                    breakAfterClose: false
                });
            }
        },
        afterInit: function (editor) {
            editor.on('toDataFormat', function (evt) {
                var lm = evt.data.dataValue.find('liquid-markup', true);
                for (var i = lm.length - 1; i >= 0; i--) {
                    var ta = document.createElement('textarea');
                    ta.innerHTML = lm[i].getHtml();
                    lm[i].setHtml(ta.innerText);
                    if (lm[i].attributes.hasOwnProperty('contenteditable')) {
                        delete lm[i].attributes['contenteditable'];
                    }
                }
            }, null, null, 14);

            editor.on('dataReady', function (evt) {
                var doc = evt.editor.document;
                if (!doc) {
                    return;
                }
                var lm = doc.getElementsByTag('liquid-markup').toArray();
                for (var i = lm.length - 1; i >= 0; i--) {
                    var attr = lm[i].getAttribute('type');
                    if (attr && attr != 'custom') {
                        lm[i].setAttribute('contenteditable', 'false');
                    }
                }
            });
        }
    });
})();
