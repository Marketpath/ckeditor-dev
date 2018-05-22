(function () {
	CKEDITOR.plugins.add('mplink', {
		requires: 'link',
		init: function (editor) {
			editor.once('instanceReady', function () {
				if (!editor.config.Dialog) {
					return;
				}
				editor.getCommand('link').on('exec', function (evt) {
					//adapted from CKEditor/source/plugins/link/dialogs/link.js and CKEDITOR/source/plugins/link/plugin.js
					//	allowedContent: 'a[!href,title,target,data-ref]',
					var widget = editor.widgets.focused,
						selection = editor.getSelection(),
						ranges = selection.getRanges(),
						links = [],
						firstlink = false,
						showLinkText = true,
						dialogArgs = {};


					var setArgsFromLink = function (link) {
						//set initial attribute values
						var href = link.getAttribute('href'),
							ref = link.getAttribute('data-ref'),
							title = link.getAttribute('title'),
							type = false,
							guid;

						dialogArgs.link = href;

						if (ref) {
							var refParts = ref.split(':'),
								guid = refParts[1];

							switch (refParts[0]) {
								case 'page':
									type = 'page';
									break;
								case 'document':
									type = 'document';
									break;
								case 'image':
									type = 'image'
									break;
							}
						}

						if (type) {
							dialogArgs['link-type'] = type;
							dialogArgs['link-guid'] = guid;
						} else if (href.substr(0, 7) == 'mailto:') {
							type = 'email';
							dialogArgs['link-type'] = type;
						}
						if (title) {
							dialogArgs['link-title'] = title;
						}

						if (type != 'email' && firstlink.getAttribute('target') == '_blank') {
							dialogArgs['open-in-new-tab'] = true;
						}
						//var dlname = firstlink.getAttribute('download');
						//if (dlname) //what now?
					};

					// Widget cannot be enclosed in a link, i.e.
					// <a>foo<inline widget/>bar</a>
					if (widget && widget.name == 'image' && (widget.inline ? !widget.wrapper.getAscendant('a') : 1) && widget.parts.link) {
						firstlink = widget.parts.link;
						links.push(firstlink);
						setArgsFromLink(firstlink);
					//} else {
					//	widget = false;
					}

					if (!widget) {
						for (var i = 0; i < ranges.length; i++) {
							var range = ranges[i];

							// Skip bogus to cover cases of multiple selection inside tables (#tp2245).
							// Shrink to element to prevent losing anchor (#859).
							range.shrink(CKEDITOR.SHRINK_ELEMENT, true, { skipBogus: true });
							var link = editor.elementPath(range.getCommonAncestor()).contains('a', 1);

							if (link) {
								links.push(link);
							}
						}

						firstlink = links[0];
						if (firstlink && firstlink.hasAttribute('href')) {
							setArgsFromLink(firstlink);
							//set initial attribute values
						}
					}

					//set initial text (or indicate to hide text)
					if (ranges.length > 1 || (editor.widgets && editor.widgets.focused) || (firstlink && firstlink.is({
						img: 1,
						table: 1,
						tbody: 1,
						thead: 1,
						tfoot: 1,
						input: 1,
						select: 1,
						textarea: 1
					}))) {
						showLinkText = false;
						dialogArgs['hide-text'] = true;
					} else if (firstlink) {
						dialogArgs.text = firstlink.getText();
					} else {
						dialogArgs.text = selection.getSelectedText();
					}


					var isFinished = false;
					var finishDialogNav = function () {
						if (isFinished) {
							return;
						}
						isFinished = true;
						editor.config.Dialog.off('linkSaved').off('onCancel');
						editor.config.Dialog.closeSub();
						editor.focusManager.unlock();
					};

					editor.config.Dialog.off('linkSaved').on('linkSaved', function (info) {
						var newRanges = [],
							setAttrs = {
								href: info.href
							},
							removeAttrs = [];

						switch (info.type) {
							case 'document':
							case 'image':
							case 'page':
								if (info.guid) {
									setAttrs['data-ref'] = info.type + ':' + info.guid;
								}
								break;
						}
						if (info.type == 'document') {
							//add 'download' attribute
							if (info.title) {
								setAttrs['download'] = info.title;
							} else {
								setAttrs['download'] = true;
							}
						} else {
							removeAttrs.push('download');
						}
						if (info.title) {
							setAttrs['title'] = info.title;
						} else {
							removeAttrs.push('title');
						}
						if (info.openInNewTab) {
							setAttrs['target'] = '_blank';
						} else {
							removeAttrs.push('target');
						}

						var applyToLink = function (link) {
							for (var attr in setAttrs) {
								link.setAttribute(attr, setAttrs[attr]);
							}
							for (var j = removeAttrs.length - 1; j >= 0; j--) {
								link.removeAttribute(removeAttrs[j]);
							}
							if (showLinkText) {
								link.setText(info.text);
							}
						};
						var getNewStyle = function () {
							var newStyle = new CKEDITOR.style({
								element: 'a',
								attributes: setAttrs
							});
							newStyle.type = CKEDITOR.STYLE_INLINE; // need to override... dunno why.
							return newStyle;
						};

						if (widget) {
							if (widget.parts.link) {
								applyToLink(widget.parts.link);
							} else {
								var element = editor.document.createElement('a');
								for (var attr in setAttrs) {
									element.setAttribute(attr, setAttrs[attr]);
								}
								widget.parts.image.insertBeforeMe(element);
								widget.parts.image.move(element);
								widget.parts.link = element;

								//var newRange = editor.createRange(widget.parts.image);
								//newRange.selectNodeContents(widget.parts.image);
								//var newStyle = getNewStyle();
								//newStyle.applyToRange(newRange, editor);
								//widget.parts.link = widget.parts.image.getParent();
							}
							var linkPlugin = CKEDITOR.plugins.link;
							var data = linkPlugin.parseLinkAttributes(editor, widget.parts.link);
							widget.data.link = data;
							//newRanges.push(editor.createRange(widget.wrapper));
						} else if (links.length) {
							//update existing links
							for (var i = links.length - 1; i >= 0; i--) {
								var element = links[i];
								applyToLink(element);
								var newRange = editor.createRange();
								newRange.setStartBefore(element);
								newRange.setEndAfter(element);
								newRanges.push(newRange);
								return newRange;
							}
						} else {
							//create new links
							var newStyle = getNewStyle();

							var text;
							if (info.text) {
								text = info.text;
							} else if (info.type == 'email') {
								var qpos = info.href.indexOf('?');
								text = info.href.substr(7, qpos > 7 ? qpos - 7 : undefined);
							} else {
								text = info.href;
							}

							for (i = 0; i < ranges.length; i++) {
								var range = ranges[i];

								if (range.collapsed) {
									var textNode = new CKEDITOR.dom.text(text, editor.document);
									range.insertNode(textNode);
									range.selectNodeContents(textNode);
								} else if (showLinkText) {
									var textNode = new CKEDITOR.dom.text(text, editor.document);

									// Shrink range to preserve block element.
									range.shrink(CKEDITOR.SHRINK_TEXT);

									// Use extractHtmlFromRange to remove markup within the selection. Also this method is a little
									// smarter than range#deleteContents as it plays better e.g. with table cells.
									editor.editable().extractHtmlFromRange(range);

									range.insertNode(textNode);

									// Editable links nested within current range should be removed, so that the link is applied to whole selection.
									var nestedLinks = range._find('a');

									for (var j = 0; j < nestedLinks.length; j++) {
										nestedLinks[j].remove(true);
									}
								}

								// Apply style.
								newStyle.applyToRange(range, editor);
								newRanges.push(range);
							}
						}

						if (newRanges.length) {
							editor.getSelection().selectRanges(newRanges);
						}
						finishDialogNav();
					});
					editor.config.Dialog.off('onCancel').on('onCancel', finishDialogNav);
					editor.once('selectionChange', finishDialogNav);
					editor.once('mode', finishDialogNav);

					editor.focusManager.lock();
					editor.config.Dialog.openSub('link-editor', dialogArgs);
					editor.config.$scope && editor.config.$scope.$apply();

					evt.cancel();
				});

				editor.on('doubleclick', function (evt) {
					if (evt.data.dialog == 'link') {
						delete evt.data.dialog;
						editor.execCommand('link');
					}
				});
			});
		}
	});
})();
