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

		this.buildHtml(this.items, this.$element, this.options);
	};

	// #region properties

	Chosen.prototype.options = {};

	Chosen.prototype.selectors = {};

	// #endregion properties

	// #region initialization

	Chosen.prototype.getItems = function ($select) {
		return [];
	};

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

		$dropdownContainer.appendChild($dropdownMask);
		$dropdownContainer.appendChild($dropdown);

		$element.style.display = 'none';

		$element.parentNode.insertBefore($dropdownContainer, $element.nextSibling);
	};

	Chosen.prototype.buildChosenContainer = function (options) {

		var $chosenContainer = document.createElement('div');

		$chosenContainer.classList.add('chosen-container');
		$chosenContainer.classList.add('chosen-container-single');

		$chosenContainer.style.height = options.height;
		$chosenContainer.style.width = options.width;

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

		$dropdownContainer.style.height = options.height;
		$dropdownContainer.style.width = options.width;

		return $dropdownContainer;
	};

	Chosen.prototype.buildResults = function (items) {

		if (!items) {
			return [];
		}

		return items.map(function (item, index) {

			var $result = document.createElement('li');

			$result.classList.add(item.disabled ? 'inactive-result' : 'active-result');
			$result.setAttribute('data-option-array-index', index + 1);
			$result.setAttribute('data-option-value', item.value || '');

			$result.innerText = item.text;

			return $result;
		});
	};

	// #endregion initialization

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
