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
				allowedContent: 'div[!data-oembed-url]',
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
					if (el.name == 'div' && el.attributes['data-oembed-url']) {
						var url = el.attributes['data-oembed-url']
						data.url = url == 'custom' ? '' : url;
						data.original_code = el.getHtml();
						return true;
					} else if (el.name == 'iframe') {
						data.url = 'custom';
						data.original_code = el.getOuterHtml();
						return true;
					}
				},
				downcast: function (el) {
					el.attributes['data-oembed-url'] = this.data.url || 'custom';
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
						scriptElement = new CKEDITOR.dom.element('script'),
						nextCbNum = CKEDITOR._.mpembedCallbacks.length,
						url = widget.providerUrl.replace('{url}', encodeURIComponent(newUrl)).replace('{callback}', encodeURIComponent('CKEDITOR._.mpembedCallbacks[' + nextCbNum + ']'));

					widget.data.original_code = false;

					var request = {
						url: newUrl,
						cancel: cleanup
					};

					CKEDITOR._.mpembedCallbacks[nextCbNum] = function (response) {
						setTimeout(function () {
							cleanup();

							var html;
							if (response.type == 'photo') {
								html = '<img src="' + CKEDITOR.tools.htmlEncodeAttr(response.url) + '" ' + 'alt="' + CKEDITOR.tools.htmlEncodeAttr(response.title || '') + '" style="max-width:100%;height:auto" />';
							} else if (response.type == 'video' || response.type == 'rich') {
								// Embedded iframes are added to page's focus list. Adding negative tabindex attribute
								// removes their ability to be focused by user. (https://dev.ckeditor.com/ticket/14538)
								html = response.html.replace(/<iframe/g, '<iframe tabindex="-1"');

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
								widget.data.url = newUrl;
								widget.element.setHtml(html);
							}

							if (typeof opts.callback == 'function') {
								opts.callback(newUrl, html);
							}

							widget.data.original_code = html;
						});
					};

					scriptElement.setAttribute('src', url);
					scriptElement.on('error', function () {
						cleanup();

						if (typeof opts.errorCallback == 'function') {
							opts.errorCallback();
						}
					});
					CKEDITOR.document.getBody().append(scriptElement);


					return request;

					function cleanup() {
						if (scriptElement) {
							scriptElement.remove();
							delete CKEDITOR._.mpembedCallbacks[nextCbNum];
							scriptElement = null;
						}
					}
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
