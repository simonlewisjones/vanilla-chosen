(function (factory, global) {

	'use strict';

	if (typeof define === 'function' && define.amd) {
		define('chosen', [], factory);
	} else {
		factory.call(global, global.module);
	}

})(function (module) {

	'use strict';

	// #region helpers declarations

	var extendObject;

	// #endregion

	var Chosen = function ($element, options) {

		this.$element = $element;

		this.options.isMultiple = $element.getAttribute('multiple') === 'multiple';

		extendObject(this.options, options);

		this.items = this.getItems(this.$element);

		this.htmlComponents = [];

		this.resultsElements = [];

		this.$selectedResult = null;

		this.buildHtml(this.items, this.$element, this.options);

		this.registerEvents();
	};

	// #region properties

	Chosen.prototype.options = {};

	Chosen.prototype.selectors = {};

	// #endregion properties

	// #region initialization

	Chosen.prototype.buildHtml = function (items, $element, options) {

		var elementBoundingRectangle = $element.getBoundingClientRect();

		if (typeof options.width === 'undefined') {
			options.width = elementBoundingRectangle.width;
		}

		if (typeof options.height === 'undefined') {
			options.height = elementBoundingRectangle.height;
		}

		var $dropdownContainer = this.buildChosenContainer(options),
			$dropdownMask = options.isMultiple
				? this.buildMultipleDropdownMask(options)
				: this.buildSingleDropdownMask(options),
			$dropdown = this.buildDropdown(options, items);

		this.$dropdownContainer = $dropdownContainer;
		this.$dropdownMask = $dropdownMask;
		this.$dropdown = $dropdown;

		$dropdownContainer.appendChild($dropdownMask);
		$dropdownContainer.appendChild($dropdown);

		$element.style.display = 'none';

		$element.parentNode.insertBefore($dropdownContainer, $element.nextSibling);
	};

	Chosen.prototype.buildChosenContainer = function (options) {

		var $chosenContainer = document.createElement('div');

		$chosenContainer.classList.add('chosen-container');
		$chosenContainer.classList.add('chosen-container-single');

		$chosenContainer.style.width = options.width;

		this.htmlComponents.push($chosenContainer);

		return $chosenContainer;
	};

	Chosen.prototype.buildSingleDropdownMask = function (options) {

		var $dropdownMaskContainer = document.createElement('a'),
			$selectedValueContainer = document.createElement('span'),
			$caretContainer = document.createElement('div'),
			$caret = document.createElement('b');

		$dropdownMaskContainer.classList.add('chosen-single');
		$dropdownMaskContainer.setAttribute('tabindex', -1);

		$caretContainer.appendChild($caret);
		$dropdownMaskContainer.appendChild($selectedValueContainer);
		$dropdownMaskContainer.appendChild($caretContainer);

		this.htmlComponents.push($dropdownMaskContainer);
		this.htmlComponents.push($selectedValueContainer);
		this.htmlComponents.push($caretContainer);
		this.htmlComponents.push($caret);

		this.$selectedValueContainer = $selectedValueContainer;

		return $dropdownMaskContainer;
	};

	Chosen.prototype.buildMultipleDropdownMask = function (options) {

	};

	Chosen.prototype.buildDropdown = function (options, items) {

		var $dropdownContainer = document.createElement('div'),
			$searchInputContainer = document.createElement('div'),
			$searchInput = document.createElement('input'),
			$resultsContainer = document.createElement('ul'),
			$results = this.buildResults(items);

		$dropdownContainer.classList.add('chosen-drop');
		$searchInputContainer.classList.add('chosen-search');
		$resultsContainer.classList.add('chosen-results');

		$searchInput.setAttribute('type', 'text');
		$searchInput.setAttribute('autocomplete', 'off');
		$searchInput.setAttribute('tabindex', '2');

		for (var i = 0; i < $results.length; i++) {
			$resultsContainer.appendChild($results[i]);
		}

		$searchInputContainer.appendChild($searchInput);

		$dropdownContainer.appendChild($searchInputContainer);
		$dropdownContainer.appendChild($resultsContainer);

		this.htmlComponents.push($dropdownContainer);
		this.htmlComponents.push($searchInputContainer);
		this.htmlComponents.push($searchInput);
		this.htmlComponents.push($resultsContainer);
		this.htmlComponents.push($results);

		return $dropdownContainer;
	};

	Chosen.prototype.buildResults = function (items) {

		if (!items) {
			return [];
		}

		var htmlComponents = this.htmlComponents,
			resultsElements = this.resultsElements;

		return items.map(function (item, index) {

			var $result = document.createElement('li');

			$result.classList.add(item.disabled ? 'inactive-result' : 'active-result');
			$result.setAttribute('data-option-array-index', index + 1);
			$result.setAttribute('data-option-value', item.value || '');

			$result.innerText = item.text;

			htmlComponents.push($result);

			resultsElements.push($result);

			return $result;
		});
	};

	Chosen.prototype.registerEvents = function () {

		// document.addEventListener('click', this.evOnOuterClick.bind(this));

		this.$dropdownMask.addEventListener('click', this.evOnContainerClick.bind(this));
		this.$dropdownMask.addEventListener('focus', this.evOnContainerFocus.bind(this));

		for (var i = 0; i < this.resultsElements.length; i++) {
			this.resultsElements[i].addEventListener('click', this.evResultClick.bind(this));
		}
	};

	// #endregion initialization

	// #region event handlers

	Chosen.prototype.evOnContainerFocus = function (e) {

		this.focused = true;

		this.$dropdownContainer.classList.add('chosen-container-active');

		this.$dropdown.focus();
	};

	Chosen.prototype.evOnOuterClick = function (e) {

		if (this.isChosenComponent(e.currentTarget)) {

			this.evOnContainerClick(e);

			return;
		}

		this.focused = false;

		this.closeDropdown();

		this.$dropdownContainer.classList.remove('chosen-container-active');	
	};

	Chosen.prototype.evOnContainerClick = function (e) {

		e.preventDefault();

		this.opened = !this.opened;

		if (this.opened) {
			this.openDropdown();
		} else {
			this.closeDropdown();
		}
	};

	Chosen.prototype.evResultClick = function (e) {

		e.preventDefault();

		this.$selectedResult = e.currentTarget;

		var selectedItem = this.getItemByResultIndex(this.$selectedResult.getAttribute('data-option-array-index')),
			selectedValue = selectedItem.value;

		this.setSelectedValue(selectedValue);
	};

	// #endregion event handlers

	// #region internal methods

	Chosen.prototype.openDropdown = function () {

		this.opened = true;

		this.$dropdownContainer.classList.add('chosen-with-drop');
	};

	Chosen.prototype.closeDropdown = function () {

		this.opened = false;

		this.$dropdownContainer.classList.remove('chosen-with-drop');
	};

	Chosen.prototype.isChosenComponent = function ($element) {

		return this.htmlComponents.indexOf($element) !== -1;
	};

	Chosen.prototype.getItems = function ($select) {
		
		var $options = $select.querySelectorAll('option'),
			items = [];

		for (var i = 0; i < $options.length; i++) {

			items.push({
				value: $options[i].getAttribute('value'),
				text: $options[i].innerText
			});
		}

		return items;
	};

	Chosen.prototype.getItemByResultIndex = function (index) {

		if (typeof index !== 'number') {
			index = parseInt(index);
		}

		index = index - 1;

		return this.items[index];
	};

	Chosen.prototype.getItemByValue = function (value) {

		var matches = this.items.filter(function (item) {
			return item.value === value;
		});

		return matches[0];
	};

	Chosen.prototype.setSelectedValue = function (value) {

		this.selectedValue = value;

		var selectedItem = this.getItemByValue(value),
			selectedItemText = selectedItem.text || '';

		this.$selectedValueContainer.innerText = selectedItemText;
	};

	// #endregion

	if (typeof module !== 'undefined' && module !== null) {
		module.exports = Chosen;
	} else {
		this.Chosen = Chosen;
	}

	// #region helpers definitions

	extendObject = function (target, source) {

		if (!target) {
			return target;
		}

		if (!source) {
			return source;
		}

		for (var prop in source) {
			if (source.hasOwnProperty(prop)) {

				if (typeof source[prop] !== 'undefined') {

					if (typeof source[prop] !== 'object') {
						target[prop] = source[prop];
					} else {

						if (typeof target[prop] !== 'object') {
							target[prop] = {};
						}

						extendObject(target[prop], source[prop]);
					}
				}
			}
		}

		return target;
	};

	// #endregion helpers definitions

	return Chosen;

}, this);
