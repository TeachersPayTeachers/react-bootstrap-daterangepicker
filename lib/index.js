'use strict';
/**
 * react-bootstrap-daterangepicker.js
 *
 * A slightly modified version of bootstrap-daterangepicker.js for use in react and npm.
 * Original copyright in: ./lib/daterangepicker.js
 */
var React = require('react');
var DateRangePicker = require('./daterangepicker.js');
var getOptions = require('./get-options.js');
var $ = require('fakequery');

/* this is our export React class */
module.exports = React.createClass({
	picker: null,
	options: getOptions(),
	makeEventHandler: function (eventType) {
		return function (event, picker) {
			if (typeof this.props.onEvent === 'function') {
				this.props.onEvent(event, picker);
			}
			if (typeof this.props[eventType] === 'function') {
				this.props[eventType](event, picker);
			}
		}.bind(this);
	},
	getOptionsFromProps: function () {
		var options, props = this.props;
		this.options.forEach(function (option) {
			if (props.hasOwnProperty(option)) {
				options = options || {};
				options[option] = props[option];
			}
		});
		return options || {};
	},
	setOptionsFromProps: function () {
		var currentOptions = this.getOptionsFromProps();
		var keys = Object.keys(currentOptions);
		var _this = this;
		if (_this.picker) {
			if (currentOptions) {
        var instance = _this.picker.daterangepicker;
				keys.forEach(function (key) { instance[key] = currentOptions[key]; });
        _this.picker.daterangepicker = instance;
			}
		}
	},
	componentDidMount: function () {
		this.initializeDateRangePicker();
	},
	componentWillUnmount: function () {
		this.removeDateRangePicker();
	},
	removeDateRangePicker: function() {
    delete this.picker.daterangepicker;
	},
	initializeDateRangePicker: function() {
		var _this = this;
		this.$picker = $(this.refs.picker);
    this.picker = this.$picker[0];
		// initialize
    this.picker.daterangepicker = new DateRangePicker(this.picker, this.getOptionsFromProps());
		// attach event listeners
		['Show', 'Hide', 'ShowCalendar', 'HideCalendar', 'Apply', 'Cancel'].forEach(function (event) {
			var lcase = event.toLowerCase();

			_this.$picker.on(lcase + '.daterangepicker', _this.makeEventHandler('on' + event));
		});
	},
	render: function () {
		this.setOptionsFromProps();
		return React.createElement(
			'div',
      Object.assign({}, {ref: 'picker'},  this.props),
			this.props.children
		);
	}
});
