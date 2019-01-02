CKEDITOR.dialog.add('advprops', function (editor) {
	var tabs = ['main:Basic Properties', 'accessibility:Accessibility', 'data:Data', 'other:Other Attributes'];
	var tabContent = {
		main: ['id', 'class', 'style'],
		accessibility: ['name', 'alt?', 'title?', 'aria-'],
		data: ['data-'],
		other: ['*']
	};
	var labelMap = {
		'id': 'ID',
		'class': 'Classes',
		'style': 'Inline Styles'
	};
	var attrIsAllowed = function (attr) {
		return attr.substr(0, 9) != 'data-cke-' && ['data-ref', 'data-preset', 'data-widget'].indexOf(attr) == -1;
	};
	var attrIsValid = function (attr) {
		return /^[:_a-z][-:_.a-z0-9]*$/i.test(attr);
	};
	var lastId = 0;

	var buildFullContentDefinition = function () {
		return tabs.map(function (tabdef) {
			var parts = tabdef.split(':'),
				id = parts[0],
				label = parts[1];

			var doneAdding = function () {
				var dialog = this.getDialog();
				var addName = dialog.getContentElement(id, 'addname');
				var addValue = dialog.getContentElement(id, 'addvalue');
				var updateMap = dialog.updateElements[dialog.mpIndex];

				var name = addName.getValue();
				if (!name) {
					return false;
				}
				if (!attrIsValid(name)) {
					alert('The attribute "' + name + '" contains one or more characters that are not supported by this dialog. Please try a different name.');
					return false;
				} else if (!attrIsAllowed(name)) {
					alert('The attribute "' + name + '" may not be added or edited by this dialog.');
					return false;
				}
				var value = addValue.getValue() || 'true';
				updateMap[name] = value;

				var contents = dialog.getContentElement(id, 'elementcontents');
				var el = contents.getElement().$;
				var div = el.getElementsByClassName('elementInputOuter')[0];
				if (div) {
					var inputs = div.getElementsByTagName('input');
					var newNode = createAttributeDOM(div, name, inputs[inputs.length - 1].tabIndex + 1, dialog.mpElements[dialog.mpIndex], updateMap);
					addName.setValue('');
					addValue.setValue('');
					addName.focus();
					jQuery(newNode).css('background-color', '#FFFF9C').animate({ 'background-color': '#FFFFFF' }, 1500);
				} else {
					setupContent(id, dialog);
				}
			};

			return {
				id: id,
				label: label,
				elements: [{
					id: 'elementlabel',
					type: 'html',
					html: '<div><h3>loading...</h3></div>'
				}, {
					id: 'elementcontents',
					type: 'html',
					html: '<div><h4>loading...</h4></div>'
				}, {
					id: 'addbtn',
					type: 'button',
					label: 'New Attribute',
					onClick: function () {
						var dialog = this.getDialog();
						var addBtn = this;
						var addName = dialog.getContentElement(id, 'addname');
						var addValue = dialog.getContentElement(id, 'addvalue');
						var addbox = dialog.getContentElement(id, 'addbox');
						//var doneAdd = dialog.getContentElement(id, 'doneadd');

						addName.setValue('');
						addValue.setValue('');

						addBtn.getElement().hide();
						addbox.getElement().show();
						addName.getElement().show();
						addValue.getElement().show();
						//doneAdd.getElement().show();

						addName.focus();
					}
				}, {
					type: 'vbox',
					id: 'addbox',
					children: [{
						type: 'hbox',
						widths: ['30%', '70%'],
						//styles: ['vertical-align:top'],
						children: [{
							id: 'addname',
							type: 'text',
							label: 'New Attribute Name',
							onKeydown: function (evt) {
								//override 'enter' functionality here
								if (evt.data.getKey() == 13) {
									doneAdding.call(this);
									evt.data.preventDefault(true);
									evt.data.stopPropagation();
									evt.stop();
									evt.cancel();
									return false;
								}
							}
						}, {
							id: 'addvalue',
							type: 'text',
							label: 'New Attribute Value',
							onKeydown: function (evt) {
								//override 'enter' functionality here
								if (evt.data.getKey() == 13) {
									doneAdding.call(this);
									evt.data.preventDefault(true);
									evt.data.stopPropagation();
									evt.stop();
									evt.cancel();
									return false;
								}
							}
						}]
					}, {
						id: 'doneadd',
						type: 'button',
						label: 'Add',
						onClick: doneAdding
					}]
				}]
			};
		});
	};

	var getElementLabelText = function (element, updateMap) {
		var name = element.getName();
		var id = updateMap['id'] || element.getAttribute('id');
		var classes = updateMap['class'] || element.getAttribute('class');
		return name
			+ (id ? '#' + id : '')
			+ (classes ? classes.split(' ').map(function (classname) {
				return '.' + classname.trim();
			}).filter(function (classname) {
				return classname != '.' && classname.substr(0, 5) != '.cke_';
			}).join('') : '');
	};
	var setupLabel = function (tab, dialog) {
		var tabElement = dialog.getContentElement(tab, 'elementlabel');
		var selected = dialog.mpElements[dialog.mpIndex];
		var container = document.createElement('div');
		if (dialog.mpElements.length > 1) {
			var path = document.createElement('p');
			for (var i = 0; i < dialog.mpElements.length; i++) {
				if (i > 0) {
					var sep = document.createTextNode(' \u203A ');
					path.appendChild(sep);
				}

				var element = dialog.mpElements[i],
					newItem;

				if (element == selected) {
					newItem = document.createElement('span');
				} else {
					newItem = document.createElement('a');
					newItem.href = 'javascript:void(0)';
					newItem.className = 'link';
					newItem.dataset.idx = i;
					newItem.onclick = function () {
						var idx = this.dataset.idx;
						resetContent(dialog, idx);

						if (event) {
							event.stopPropagation();
							event.preventDefault();
						}
						return false;
					}
					newItem.style.fontWeight = 'bold';
					//newItem.style.color = 'blue';
					//newItem.style.textDecoration = 'underline';
					//newItem.style.cursor = 'pointer';
				}
				newItem.innerText = element.getName();
				path.appendChild(newItem);
			}
			//path.style.marginBottom = '10px';
			container.appendChild(path);
		}

		var curName = document.createElement('h3');
		curName.innerText = selected ? getElementLabelText(selected, dialog.updateElements[dialog.mpIndex]) : 'invalid selection';
		//curName.style.fontSize = '2em';
		//curName.style.margin = '0.5em 0';
		container.appendChild(curName);

		var curElement = tabElement.getElement().$;
		curElement.innerHTML = '';
		curElement.appendChild(container);
	};

	var getAttributeLabel = function (name) {
		if (labelMap[name]) {
			return labelMap[name];
		}
		return name.replace(/[-_]/g, ' ');
	};

	var nextId = function () {
		return 'cke_' + (++lastId) + '_propElement';
	};

	var getKeystrokeListener = function (container) {
		return function (evt) {
			if (evt.which == 9) {
				var shiftPressed = evt.shiftKey;
				var inputs = [].slice.call(container.getElementsByTagName('input')).filter(function (input) {
					return input.type == 'text' && input.tabIndex > 0;
				});
				var idx = inputs.indexOf(this);
				if (idx == -1 || (idx == 0 && shiftPressed) || (idx == inputs.length - 1 && !shiftPressed)) {
					return;
				}
				evt.stopPropagation();
				evt.stopPropagation();
				(inputs[idx + (shiftPressed ? -1 : 1)]).focus();
				return false;
			}
			//else if (keystroke == 13) {
			//	//PREVENT CKEDITOR ENTER HIJACK
			//	evt.stopPropagation();
			//}
		};
	};
	var createTextInput = function (container, value, tabIdx, labelledby, onChange, onKeyup) {
		var input = document.createElement('input');
		input.type = 'text';
		input.value = value;
		input.id = nextId();
		input.className = 'cke_dialog_ui_input_text';
		if (tabIdx) {
			input.tabIndex = tabIdx;
		}
		if (labelledby) {
			input.setAttribute('aria-labelledby', labelledby);
		}
		if (typeof onChange == 'function') {
			input.onchange = onChange;
		}
		input.onkeydown = getKeystrokeListener(container);
		if (typeof onKeyup == 'function') {
			input.onkeyup = onKeyup;
		}
		return input;
	};

	var createAttributeInput = function (container, parent, name, element, tabIdx, updateMap) {
		var label = document.createElement('label'),
			labelId = nextId(),
			span = document.createElement('span'),
			input = createTextInput(container, updateMap[name] || element.getAttribute(name), tabIdx, labelId, function () {
				updateMap[name] = this.value;
			});

		span.innerText = getAttributeLabel(name);
		label.title = name;
		label.id = labelId;
		span.style.cursor = 'pointer';
		span.style.textTransform = 'capitalize';
		//span.style.display = 'block';
		//span.style.margin = '10px 0 5px 6px';
		span.className = 'cke_dialog_ui_labeled_label';

		label.appendChild(span);
		label.appendChild(input);
		parent.appendChild(label);
	};

	var createClassesInput = function (container, parent, element, tabIdx, updateMap) {
		var label = document.createElement('label'),
			labelId = nextId(),
			span = document.createElement('span');
		span.innerText = getAttributeLabel('class');
		label.title = 'class';
		label.id = labelId;
		label.style.display = 'block';
		label.style.cursor = 'default';
		span.style.cursor = 'pointer';
		span.style.textTransform = 'capitalize';
		//span.style.display = 'block';
		//span.style.margin = '10px 0 5px 6px';
		span.className = 'cke_dialog_ui_labeled_label';
		label.appendChild(span);

		var curValue = updateMap['class'] || element.getAttribute('class') || '',
			curClasses = curValue.split(' '),
			protectedClasses = [],
			selectableClasses = [];

		//get our list of selectable classes
		if (editor.config.mpstyles) {
			var elementName = element.getName();
			editor.config.mpstyles.forEach(function (style) {
				if (style.type == 'mpstyle') {
					if (style.appliesTo.indexOf(elementName) >= 0) {
						selectableClasses.push([style.title, style.classname]);
					}
				} else {
					if (style.element == elementName) {
						selectableClasses.push([style._.definition.name, style._.definition.attributes['class']]);
					}
				}
			});
		}

		//process the classes currently assigned to the element
		for (var i = curClasses.length, classname; i >= 0; i--) {
			classname = curClasses[i];
			if (!classname) {
				//ignore empty classnames (extra spaces in the class attribute)
				curClasses.splice(i, 1);
			} else if (classname.substr(0, 4) == 'cke_') {
				//silently pass through any classnames starting with cke_
				protectedClasses.push(curClasses.splice(i, 1)[0]);
			} else {
				//if this is a selectable class then we can remove it from
				//our list of selectable classes since it is already present
				var selectedIdx = selectableClasses.indexOf(classname);
				if (selectedIdx >= 0) {
					selectableClasses.splice(selectedIdx, 1);
				}
			}
		}

		var doUpdate = function () {
			var thisVal = input.value.trim();
			var sep = protectedClasses.length && thisVal ? ' ' : '';
			updateMap['class'] = protectedClasses.join(' ') + sep + thisVal;
		};

		var input = createTextInput(container, curClasses.join(' '), tabIdx, labelId, doUpdate);

		label.appendChild(input);
		parent.appendChild(label);

		var selectElement = false;
		if (selectableClasses.length) {
			selectElement = document.createElement('select');

			selectElement.className = 'cke_dialog_ui_input_select';
			var noneOption = document.createElement('option');
			noneOption.value = '';
			noneOption.innerText = '--select a style to add it';
			noneOption.selected = true;
			selectElement.appendChild(noneOption);
			for (var i = 0; i < selectableClasses.length; i++) {
				var styleOption = document.createElement('option');
				styleOption.value = selectableClasses[i][1];
				styleOption.innerText = selectableClasses[i][0];
				selectElement.appendChild(styleOption);
			}

			selectElement.onchange = function () {
				if (this.value) {
					var newVal = input.value.trim() ? input.value.trim() + ' ' + this.value : this.value;
					input.value = newVal;
					doUpdate();

					var options = this.getElementsByTagName('option');
					if (options.length > 2) {
						for (var i = options.length - 1; i >= 0; i--) {
							if (options[i].value == this.value) {
								options[i].remove();
								this.value = '';
								break;
							}
						}
					} else {
						this.remove();
					}
				}
			};
			parent.appendChild(selectElement);
		}
	};

	var createStyleInput = function (container, parent, element, tabIdx, updateMap) {
		var label = document.createElement('label'),
			labelId = nextId();
		label.innerText = getAttributeLabel('style');
		label.title = 'style';
		label.id = labelId;
		label.style.cursor = 'pointer';
		label.style.textTransform = 'capitalize';
		//label.style.display = 'block';
		//label.style.margin = '10px 0 5px 6px';
		label.className = 'cke_dialog_ui_labeled_label';
		parent.appendChild(label);

		var curValue = updateMap['style'] || element.getAttribute('style') || '',
			curStyles = [],
			lastRow = ['',''];

		//setup and cleanup
		var styles = curValue.split(';');
		styles.forEach(function (style) {
			style = style.trim();
			var cPos = style.indexOf(':');
			if (cPos > 2) {
				var lPart = style.substr(0, cPos).trim(),
					rPart = style.substr(cPos + 1).trim();
				if (lPart.length > 2 && rPart.length) {
					curStyles.push([lPart, rPart]);
				}
			}
		});
		curStyles.push(lastRow);

		var doUpdate = function () {
			var updateStyles = [];
			curStyles.forEach(function (style) {
				var prop = style[0].trim(),
					val = style[1].trim();
				if (prop.length > 2 && val.length) {
					var newVal = prop + ':' + val;
					var colonPos = newVal.indexOf(';');
					if (colonPos == -1) {
						updateStyles.push(newVal);
					} else if (colonPos == newVal.length - 1) {
						updateStyles.push(newVal.substr(0, newVal.length - 1));
					}
				}
			});
			updateMap['style'] = updateStyles.join(';');
		};

		//styleDef = [name, value];
		var createAttrRow = function (styleDef) {
			var styleRow = document.createElement('tr'),
				nameCell = document.createElement('td'),
				valueCell = document.createElement('td'),
				removeCell = document.createElement('td'),
				removeInput = document.createElement('a'),
				removeSpan = document.createElement('span'),
				nameInput = createTextInput(container, styleDef[0], tabIdx, labelId, function () {
					styleDef[0] = this.value;
					doUpdate();
				}),
				createNewRow = function () {
					var newRow = ['', ''];
					curStyles.push(newRow);
					lastRow = newRow;
					var newAttrRow = createAttrRow(newRow);

					styleRow.parentNode.insertBefore(newAttrRow, styleRow.nextSibling);
					removeInput.classList.remove('cke_disabled');
					removeSpan.classList.remove('cke_disabled');
					removeInput.style.cursor = 'pointer';
				},
				valueInput = createTextInput(container, styleDef[1], tabIdx, labelId, function () {
					styleDef[1] = this.value;
					doUpdate();
					if (this.value && styleDef == lastRow) {
						createNewRow();
					}
				}, function () {
					if (styleDef == lastRow) {
						if (this.value) {
							createNewRow();
						}
					}
				});

			nameCell.style.width = '100px';
			nameCell.style.paddingRight = '20px';
			removeCell.style.width = '100px';
			removeCell.style.paddingLeft = '20px';

			removeInput.href = 'javascript:void(0)';
			removeInput.style.userSelect = 'none';
			removeInput.style.width = '100%';
			removeInput.title = 'Remove';
			//removeInput.hideFocus = true;
			removeInput.className = 'cke_dialog_ui_button';
			removeInput.role = 'button';

			removeSpan.className = 'cke_dialog_ui_button';
			removeSpan.innerText = 'Remove';
			removeInput.appendChild(removeSpan);

			removeInput.onclick = function () {
				if (styleDef != lastRow) {
					var idx = curStyles.indexOf(styleDef);
					if (idx >= 0) {
						curStyles.splice(idx, 1);
					}
					styleRow.remove();
				}
			};

			if (styleDef == lastRow) {
				removeInput.classList.add('cke_disabled');
				removeSpan.classList.add('cke_disabled');
				removeInput.style.cursor = 'default';
			}

			nameCell.appendChild(nameInput);
			valueCell.appendChild(valueInput);
			removeCell.appendChild(removeInput);

			styleRow.appendChild(nameCell);
			styleRow.appendChild(valueCell);
			styleRow.appendChild(removeCell);

			return styleRow;
		};

		var table = document.createElement('table');
		table.style.width = '100%';

		curStyles.forEach(function (styleDef) {
			table.appendChild(createAttrRow(styleDef));
		});
		parent.appendChild(table);
	};

	var createAttributeDOM = function (container, name, tabIdx, element, updateMap) {
		var outer = document.createElement('div');
		outer.className = 'cke_dialog_ui_hbox_child';

		//outer.style.display = 'block';
		switch (name) {
			case 'class':
				createClassesInput(container, outer, element, tabIdx, updateMap);
				break;
			case 'style':
				createStyleInput(container, outer, element, tabIdx, updateMap);
				break;
			default:
				createAttributeInput(container, outer, name, element, tabIdx, updateMap);
				break;
		}
		container.appendChild(outer);
		return outer;
	};

	var setupContent = function (tab, dialog) {
		var selected = dialog.mpElements[dialog.mpIndex];
		var updateMap = dialog.updateElements[dialog.mpIndex];

		var tabElement = dialog.getContentElement(tab, 'elementcontents');

		var container = document.createElement('div');
		container.className = 'elementInputOuter';
		if (selected) {
			for (var i = 0; i < tabContent[tab].length; i++) {
				var name = tabContent[tab][i],
					matching = false;

				switch (name[name.length - 1]) {
					case '?':
						name = name.substr(0, name.length - 1);
						var val = updateMap[name] || selected.getAttribute(name);
						if (val) {
							matching = [name];
						}
						break;
					case '-':
						var nameLen = name.length;
						var attributes = selected.getAttributes();
						var attrs = Object.keys(attributes).concat(Object.keys(updateMap));
						attrs.sort();
						matching = attrs.filter(function (attr, idx, arr) {
							return (idx == 0 || attr != arr[idx - 1]) && attr.substr(0, nameLen) == name && attrIsAllowed(attr);
						});
						break;
					case '*':
						//special case
						var ignoreName = [],
							ignorePrefix = [];
						for (var tab in tabContent) {
							for (var j = tabContent[tab].length - 1; j >= 0; j--) {
								var tabName = tabContent[tab][j];
								switch (tabName[tabName.length - 1]) {
									case '?':
										ignoreName.push(tabName.substr(0, tabName.length - 1));
										break;
									case '-':
										ignorePrefix.push(tabName);
										break;
									case '*':
										//ignore
										break;
									default:
										ignoreName.push(tabName);
								}
							}
						}
						var attributes = selected.getAttributes();
						var attrs = Object.keys(attributes).concat(Object.keys(updateMap));
						attrs.sort();
						matching = attrs.filter(function (attr, idx, arr) {
							if (idx > 0 && attr == arr[idx - 1]) {
								return false;
							}
							if (ignoreName.indexOf(attr) >= 0) {
								return false;
							}
							for (var i = ignorePrefix.length - 1; i >= 0; i--) {
								if (attr.substr(0, ignorePrefix[i].length) == ignorePrefix[i]) {
									return false;
								}
							}
							return attrIsAllowed(attr);
						});
						break;
					default:
						matching = [name];
						break;
				}
				if (matching) {
					matching.forEach(function (attr, idx) {
						createAttributeDOM(container, attr, idx + 1, selected, updateMap)
					});
				}
			}
		}

		var curElement = tabElement.getElement().$;
		curElement.innerHTML = '';
		curElement.appendChild(container);
	};

	var setupTab = function (dialog) {
		var tab = dialog.curTab;
		setupLabel(tab, dialog);
		setupContent(tab, dialog);

		var addBtn = dialog.getContentElement(tab, 'addbtn');
		var addbox = dialog.getContentElement(tab, 'addbox');
		//var addName = dialog.getContentElement(tab, 'addname');
		//var addValue = dialog.getContentElement(tab, 'addvalue');
		//var doneAdd = dialog.getContentElement(tab, 'doneadd');

		if (dialog.mpElements[dialog.mpIndex]) {
			addBtn.getElement().show();
		} else {
			addBtn.getElement().hide();
		}
		addbox.getElement().hide();
		//addName.getElement().hide();
		//addValue.getElement().hide();
		//doneAdd.getElement().hide();
	};
	var prepUpdateElements = function (dialog) {
		var idx = dialog.mpIndex;
		if (!dialog.updateElements[idx]) {
			dialog.updateElements[idx] = {};
		}
	};
	var resetContent = function (dialog, idx) {
		dialog.mpIndex = idx;
		prepUpdateElements(dialog);
		setupTab(dialog);
	};

    return {
        title: 'Element Properties',
		onLoad: function () {
			var dialog = this;
			dialog.on('selectPage', function (e) {
				if (e.data.page != dialog.curTab) {
					dialog.curTab = e.data.page;
					setupTab(dialog);
				}
			});
		},
		onShow: function () {
			var selection = editor.getSelection(),
				element = selection.getSelectedElement() || selection.getStartElement() || editor.editable(),
				elementPath = editor.elementPath(element),
				elements = elementPath.elements.filter(function (element) {
					return element.getName() != 'liquid-markup';
				});

			if (editor.widgets.focused) {
				var widget = editor.widgets.focused,
					widgetName = widget.name;

				if (widgetName == 'image' && ['div', 'span', 'figure'].indexOf(element.getName()) >= 0) {
					element = widget.parts.image;
					elementPath = editor.elementPath(element);
					elements = elementPath.elements.filter(function (element) {
						return element.$ != widget.wrapper.$ && !element.hasClass('cke_image_resizer_wrapper');
					});
				} else if (widgetName == 'mpembed') {
					//&& widget.element.getName() == 'iframe') {
					element = widget.element;
					for (var embedChildren = [], childNo = element.getChildCount() - 1, child; childNo >= 0; childNo--) {
						child = element.getChild(childNo);
						if (child.type != CKEDITOR.NODE_TEXT) {
							embedChildren.push(child);
						}
					}
					if (embedChildren.length == 1) {
						element = embedChildren[0];
					}
					elementPath = editor.elementPath(element);
					elements = elementPath.elements.filter(function (element) {
						return element.$ != widget.wrapper.$;
					});
				}
			}

			elements.pop(); //remove the 'body' element
			elements.reverse();

			this.mpElements = elements;
			this.mpIndex = elements.length - 1;
			this.updateElements = elements.map(function (el) {
				return false;
			});
			this.curTab = 'main';

			prepUpdateElements(this);
			setupTab(this);
		},
		onOk: function () {
			var dialog = this;
			for (var i = dialog.updateElements.length - 1; i >= 0; i--) {
				if (dialog.updateElements[i]) {
					var element = dialog.mpElements[i],
						updateMap = dialog.updateElements[i]
					for (var attr in updateMap) {
						var value = updateMap[attr];
						if (value) {
							element.setAttribute(attr, value);
						} else {
							element.removeAttribute(attr);
						}
					}
				}
			}
        },
		contents: buildFullContentDefinition()
    };
});
