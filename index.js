(function (factory) {

	'use strict';

	if (typeof this.define === 'function' && this.define.amd) {
		this.define('chosen', [], factory);
	} else {
		factory.call(this, this.module);
	}

})(function (module) {

	'use strict';

	// #region helpers declarations

	var extendObject;

	// #endregion

	var Chosen = function ($element, options) {

		this.$element = $element;

		extendObject(this.options, options);
	};

	// #region properties

	Chosen.prototype.options = {};

	Chosen.prototype.selectors = {};

	// #endregion properties

	// #region initialization

	Chosen.prototype.buildDropdown = function ($parentContainer) {

	};

	// #endregion initialization

	if (typeof module !== 'undefined' && module !== null) {
		module.exports = Chosen;
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

				
			}
		}

		return target;
	};

	// #endregion helpers definitions

	return Chosen;

});
