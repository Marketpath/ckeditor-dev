(function () {
	var mpstyle = CKEDITOR.style.addCustomHandler({
		type: 'mpstyle',
		setup: function (definition) {
			//required fields: title, classname, appliesTo
			this.title = definition.title;
			this.appliesTo = definition.appliesTo;
			this.classname = definition.classname;
		}
		//applyToRange: function (range) {
		//	if (range.collapsed) {
		//		//
		//	}
		//	this.applyToRange =
		//	this.type == CKEDITOR.STYLE_INLINE ? applyInlineStyle :
		//	this.type == CKEDITOR.STYLE_BLOCK ? applyBlockStyle :
		//	this.type == CKEDITOR.STYLE_OBJECT ? applyObjectStyle :
		//	function (range) {
		//	};

		//	return this.applyToRange(range);
		//},
		//removeFromRange: function () {
		//	this.removeFromRange =
		//	this.type == CKEDITOR.STYLE_INLINE ? removeInlineStyle :
		//	this.type == CKEDITOR.STYLE_BLOCK ? removeBlockStyle :
		//	this.type == CKEDITOR.STYLE_OBJECT ? removeObjectStyle :
		//	function (range) {
		//	};

		//	return this.removeFromRange(range);
		//},
		//checkApplicable: function () {
			
		//},
		////applyToObject is OK
		//checkActive: function (elementPath, editor) {
		//	this.removeFromRange =
		//	this.type == CKEDITOR.STYLE_INLINE ? removeInlineStyle :
		//	this.type == CKEDITOR.STYLE_BLOCK ? removeBlockStyle :
		//	this.type == CKEDITOR.STYLE_OBJECT ? removeObjectStyle :
		//	function (range) {
		//	};
		//}
	});
	CKEDITOR.mpStyle = mpstyle;

	CKEDITOR.plugins.add('mpstyles', {
		requires: 'richcombo',
		//lang: 'en', // %REMOVE_LINE_CORE%
		//onLoad: function () {
		//},
		init: function (editor) {
			var styles = {},
				initCombo = false;

			if (editor.config.mpstyles) {
				var inlineStyles = editor.config.mpstyles.filter(function (style) {
					return style.type == CKEDITOR.STYLE_INLINE;
				});
				if (inlineStyles.length) {
					inlineStyles.forEach(function (style) {
						var definition = style._.definition;
						var stylename = definition.name + '.' + definition.attributes['class'];
						styles[stylename] = style;
					});
					initCombo = true;
				}
			}

			if (initCombo) {
				//adapted from stylescombo plugin
				editor.ui.addRichCombo('Styles', {
					label: 'Styles',
					title: 'Formatting Styles',
					toolbar: 'styles,10',
					panel: {
						css: [CKEDITOR.skin.getPath('editor')].concat(editor.config.contentsCss),
						multiSelect: true,
						attributes: { 'aria-label': 'Formatting Styles' }
					},
					init: function () {
						for (var style in styles) {
							this.add(style, styles[style].buildPreview(), styles[style]._.definition.name);
						}
						if (editor.getCommand('advprops')) {
							this.add('mpadv', '<span>Advanced</span>', 'Advanced Tag Properties');
						}
						this.commit();
					},
					onClick: function (value) {
						editor.focus();

						if (value == 'mpadv') {
							editor.execCommand('advprops');
						} else {
							editor.fire('saveSnapshot');
							var style = styles[value],
								elementPath = editor.elementPath();
							editor[style.checkActive(elementPath, editor) ? 'removeStyle' : 'applyStyle'](style);
							editor.fire('saveSnapshot');
						}
					},
					onRender: function () {
						editor.on('selectionChange', function (ev) {
							var elementPath = ev.data.path,
								elements = elementPath.elements;
							for (var i = elements.length - 1; i >= 0; i--) {
								if (elements[i].getName() == 'liquid-markup') {
									this.disable();
									return;
								}
							}
							this.enable();
						}, this);
					},
					onOpen: function () {
						var selection = editor.getSelection(),
							element = selection.getSelectedElement() || selection.getStartElement() || editor.editable(),
							elementPath = editor.elementPath(element);

						this.showAll();
						this.unmarkAll();
						for (var name in styles) {
							var style = styles[name];

							if (!style.checkApplicable(elementPath, editor, editor.activeFilter)) {
								this.hideItem(name);
							}

							if (style.checkActive(elementPath, editor)) {
								this.mark(name);
							}
						}
					},
					refresh: function () {
						var elementPath = editor.elementPath();

						if (!elementPath) {
							return;
						}

						for (var name in styles) {
							var style = styles[name];

							if (style.checkApplicable(elementPath, editor, editor.activeFilter)) {
								return;
							}
						}
						this.setState(CKEDITOR.TRISTATE_DISABLED);
					}
				});
			}
		}
	});
})();
