(function () {
	CKEDITOR.plugins.add('mpimage', {
		requires: 'image2',
		init: function (editor) {
			editor.once('instanceReady', function () {
				if (!editor.config.Dialog) {
					return;
				}

				editor.getCommand('image').on('exec', function (evt) {
					evt.cancel();
					doEdit();
				});

				editor.widgets.onWidget('image', 'edit', function (evt) {
					evt.cancel();
					doEdit();
				});

				if (editor.config.ServiceFactory) {
					editor.widgets.onWidget('image', 'data', function (evt) {
						if (evt.sender.name != 'image') {
							//sanity check
							return;
						}
						var width = evt.data.width,
							height = evt.data.height,
							widget = evt.sender,
							img = widget && widget.parts.image,
							plugin = CKEDITOR.plugins.image2;

						if (!img) {
							//we can't resize a non-existent image
							return;
						}
						if (width && typeof width == 'string' && width[width.length - 1] == '%') {
							width = null;
						}
						if (height && typeof height == 'string' && height[height.length - 1] == '%') {
							height = null;
						}
						if (widget.data.resizedWidth == width && widget.data.resizedHeight == height) {
							//we have already resized the image to these dimensions
							return;
						}

						widget.data.resizedWidth = width;
						widget.data.resizedHeight = height;

						var ref = img.getAttribute('data-ref');
						if (!ref || ref.substr(0, 6) != 'image:') {
							//this is a non-marketpath image
							return;
						}

						var cPos = ref.indexOf(':', 7);
						var imgGuid = cPos > 7 ? ref.substr(6, cPos - 6) : ref.substr(6);
						if (!imgGuid) {
							//this is an invalid image
							return;
						}

						var service = editor.config.ServiceFactory('image');
						service.get(imgGuid).then(function (image) {
							if (widget.data.resizedWidth != width || widget.data.resizedHeight != height) {
								//race check
								return;
							}

							var presetCodes = img.getAttribute('data-preset');
							if (presetCodes) {
								presetCodes = presetCodes.split('/');
							}
							var url = service.getUrl(image, width, height, presetCodes);
							if (widget.data.src != url) {
								widget.data.src = url;
								img.setAttribute('src', url);
							}
						});
					});
				}


				function doEdit() {
					var dialogArgs = {},
						widget = editor.widgets.focused,
						img = widget && widget.parts.image,
						protectedClasses = [],
						plugin = CKEDITOR.plugins.image2;

					if (img) {
						var url = img.getAttribute('src'),
							ref = img.getAttribute('data-ref'),
							alt = img.getAttribute('alt'),
							title = img.getAttribute('title'),
							classname = img.getAttribute('class'),
							width = img.getStyle('width') || img.getAttribute('width'),
							height = img.getStyle('height') || img.getAttribute('height'),
							captioned = !!widget.parts.caption,
							alignment = widget.data.align, // img.getAttribute(''),
							margin = img.getStyle('margin'),
							borderWidth = img.getStyle('border-width'),
							borderColor = img.getStyle('border-color');

						if (!margin) {
							var mt = img.getStyle('margin-top'),
								mr = img.getStyle('margin-right'),
								mb = img.getStyle('margin-bottom'),
								ml = img.getStyle('margin-left');

							if (mt || mr || mb || ml) {
								margin = (mt || '0') + ' ' + (mr || '0') + ' ' + (mb || '0') + ' ' + (ml || '0');
							}
						}

						//if (!width || !height) {
						var dimensions = plugin.getNatural(img);
						dialogArgs['natural-width'] = dimensions.width;
						dialogArgs['natural-height'] = dimensions.height;
						//}

						//	if (width) {
						//		if (width == dimensions.width) {
						//			height = dimensions.height;
						//		} else {
						//			height = width * (dimensions.height / dimensions.width);
						//		}
						//	} else {
						//		if (height == dimensions.height) {
						//			width = dimensions.width;
						//		} else {
						//			width = height * (dimensions.width / dimensions.height);
						//		}
						//	}
						//}

						dialogArgs['url'] = url;
						if (ref && ref.substr(0, 6) == 'image:') {
							var cPos = ref.indexOf(':', 7);
							dialogArgs['img-guid'] = cPos > 7 ? ref.substr(6, cPos - 6) : ref.substr(6);

							var presetCodes = img.getAttribute('data-preset');
							if (presetCodes) {
								dialogArgs['img-presets'] = presetCodes;
							}
						}
						dialogArgs['img-alt'] = alt;
						dialogArgs['img-title'] = title;
						if (classname) {
							var allClasses = classname.split(' '),
								finalClasses = [];

							for (var i = 0; i < allClasses.length; i++) {
								//ignore empty classnames (extra spaces in the class attribute)
								if (allClasses[i]) {
									if (allClasses[i].substr(0, 4) == 'cke_') {
										protectedClasses.push(allClasses[i]);
									} else {
										finalClasses.push(allClasses[i]);
									}
								}
							}
							if (finalClasses.length) {
								dialogArgs['img-class'] = finalClasses.join(' ');
							}
						}
						if (width) {
							dialogArgs['img-width'] = width;
						}
						if (height) {
							dialogArgs['img-height'] = height;
						}
						if (captioned) {
							dialogArgs['is-captioned'] = true;
						}
						if (alignment && alignment != 'none') {
							dialogArgs['img-align'] = alignment;
						}
						if (margin) {
							dialogArgs['img-margin'] = margin;
						}
						if (borderWidth) {
							dialogArgs['img-borderwidth'] = borderWidth;
							if (borderColor) {
								dialogArgs['img-bordercolor'] = borderColor;
							}
						}
					}

					var Dialog = editor.config.Dialog;
					var onFinishId = Dialog.off('imgSaved').on('imgSaved', function (info) {
						var widgetData = {
							src: info.url,
							alt: info.alt || '',
							height: null,
							width: null,
							resizedWidth: null,
							resizedHeight: null,
							lock: info.locked || true,
							hasCaption: !!info.captioned,
							align: info.alignment || 'none'
						},
							imgAttributes = {
                                'data-ref': info.type == 'Image' && info.guid ? 'image:' + info.guid : null,
                                'data-preset': info.type == 'Image' && info.guid && Array.isArray(info.presets) && info.presets.map(function (preset) { return preset.Code; }).join('/') || null,
								'title': info.title || null
							},
							imgStyles = {};

						if (info.hasOwnProperty('classname')) {
							//in case the user has not loaded the latest version of marketpath CMS yet
							if (info.classname) {
								protectedClasses.push(info.classname);
							}
							if (protectedClasses.length) {
								imgAttributes['class'] = protectedClasses.join(' ');
							} else {
								imgAttributes['class'] = null;
							}
						}
						

						var height = info.height,
							heightIsPct = height && height[height.length - 1] == '%',
							width = info.width,
							widthIsPct = width && width[width.length - 1] == '%';
						if (heightIsPct || widthIsPct) {
							//if either height or width is %, use style and unset widget data
							imgStyles['height'] = height ? heightIsPct ? height : height + 'px' : null;
							imgStyles['width'] = width ? widthIsPct ? width : width + 'px' : null;
						} else {
							imgStyles['height'] = null;
							imgStyles['width'] = null;
							//otherwise use attributes and clear the styles
							if (height) {
								height = parseInt(height);
								if (height) {
									widgetData.resizedHeight = widgetData.height = height;
								}
							}
							if (width) {
								width = parseInt(width);
								if (width) {
									widgetData.resizedWidth = widgetData.width = width;
								}
							}
						}

						var margin = info.marginTop && parseInt(info.marginTop);
						if (margin && margin == info.marginRight && margin == info.marginBottom && margin == info.marginLeft) {
							imgStyles['margin'] = margin + 'px';
						} else {
							imgStyles['margin-top'] = margin ? margin + 'px' : null;

							margin = info.marginRight && parseInt(info.marginRight);
							imgStyles['margin-right'] = margin ? margin + 'px' : null;

							margin = info.marginBottom && parseInt(info.marginBottom);
							imgStyles['margin-bottom'] = margin ? margin + 'px' : null;

							margin = info.marginLeft && parseInt(info.marginLeft);
							imgStyles['margin-left'] = margin ? margin + 'px' : null;
						}

						if (info.showBorderControls) {
							var border = null;
							if (info.borderWidth) {
								var borderWidth = parseInt(info.borderWidth);
								if (borderWidth) {
									border = borderWidth + 'px ' + (img && img.getStyle('border-style') || 'solid') + (info.borderColor ? ' ' + info.borderColor : '');
								}
							}
							imgStyles['border'] = border;
						}


						var setImgInfo = function (img) {
							for (var prop in imgAttributes) {
								var val = imgAttributes[prop];
								if (val == null) {
									img.removeAttribute(prop);
								} else {
									img.setAttribute(prop, val);
								}
							}
							for (var prop in imgStyles) {
								var val = imgStyles[prop];
								if (val == null) {
									img.removeStyle(prop);
								} else {
									img.setStyle(prop, val);
								}
							}
						};

						if (img) {
							setImgInfo(img);
							widget.setData(widgetData);
						} else {
							img = editor.document.createElement('img');
							img.setAttribute('src', info.url);
							var widgetElem;
							if (info.captioned) {
								widgetElem = editor.document.createElement('figure');
								widgetElem.addClass(editor.config.image2_captionedClass);
								widgetElem.append(img);
								var caption = editor.document.createElement('figcaption');
								caption.setText('Image Caption');
								widgetElem.append(caption);
							} else {
								widgetElem = img;
							}
							editor.insertElement(widgetElem);
							setImgInfo(img);
							widget = editor.widgets.initOn(widgetElem, 'image', widgetData);
						}
						if (info.captioned && widget.parts.caption) {
							//force the caption's left and right margin to equal the image's margins
							var caption = widget.parts.caption;
							margin = info.marginRight && parseInt(info.marginRight);
							if (margin) {
								caption.setStyle('margin-right', margin + 'px');
							} else {
								caption.removeStyle('margin-right');
							}
							margin = info.marginLeft && parseInt(info.marginLeft);
							if (margin) {
								caption.setStyle('margin-left', margin + 'px');
							} else {
								caption.removeStyle('margin-left');
							}
						}
						editor.fire('saveSnapshot');
					});

					var finish = function () {
						Dialog.off('imgSaved', onFinishId);
					};

					editor.mpdialog.openDialog('img-editor', dialogArgs, finish);
				}
			});
		}
	});
})();
