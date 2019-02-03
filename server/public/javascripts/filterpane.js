var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FilterPane = function (_React$Component) {
  _inherits(FilterPane, _React$Component);

  function FilterPane() {
    _classCallCheck(this, FilterPane);

    return _possibleConstructorReturn(this, (FilterPane.__proto__ || Object.getPrototypeOf(FilterPane)).apply(this, arguments));
  }

  _createClass(FilterPane, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      flatpickr('.datepicker', {
        onChange: function onChange(selectedDates, dateStr, instance) {
          _this2.props.updateFilters({
            target: {
              name: instance.input.name,
              value: dateStr
            }
          });
        }
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          filters = _props.filters,
          updateFilters = _props.updateFilters,
          getData = _props.getData;

      return React.createElement(
        'div',
        { id: 'quickviewDefault', className: 'quickview' },
        React.createElement(
          'header',
          { className: 'quickview-header' },
          React.createElement(
            'p',
            { className: 'title' },
            'Filter Data',
            React.createElement(
              'span',
              { className: 'icon' },
              React.createElement('i', { className: 'fas fa-filter' })
            )
          ),
          React.createElement('span', { className: 'delete', 'data-dismiss': 'quickview' })
        ),
        React.createElement(
          'div',
          { className: 'quickview-body' },
          React.createElement(
            'div',
            { className: 'quickview-block' },
            React.createElement(
              'section',
              { className: 'section' },
              React.createElement(
                'article',
                { className: 'message is-info' },
                React.createElement(
                  'div',
                  { className: 'message-body' },
                  'Note you ',
                  React.createElement(
                    'i',
                    null,
                    'must'
                  ),
                  ' use start and end dates together, and end dates are ',
                  React.createElement(
                    'i',
                    null,
                    'not'
                  ),
                  ' inclusive.'
                )
              ),
              React.createElement(
                'div',
                { className: 'field' },
                React.createElement(
                  'label',
                  { className: 'label' },
                  'Start Date:'
                ),
                React.createElement(
                  'div',
                  { className: 'control' },
                  React.createElement('input', { className: 'input datepicker', name: 'startDate', type: 'date', placeholder: 'Example: 2019-01-20', value: filters.startDate, onChange: updateFilters })
                )
              ),
              React.createElement(
                'div',
                { className: 'field' },
                React.createElement(
                  'label',
                  { className: 'label' },
                  'End Date:'
                ),
                React.createElement(
                  'div',
                  { className: 'control' },
                  React.createElement('input', { className: 'input datepicker', name: 'endDate', type: 'date', placeholder: 'Example: 2019-01-21', value: filters.endDate, onChange: updateFilters })
                )
              ),
              React.createElement(
                'div',
                { className: 'field' },
                React.createElement(
                  'label',
                  { className: 'label' },
                  'Section:'
                ),
                React.createElement(
                  'div',
                  { className: 'control' },
                  React.createElement('input', { className: 'input', name: 'section', type: 'text', placeholder: 'Example: A', value: filters.section, onChange: updateFilters })
                )
              ),
              React.createElement(
                'div',
                { className: 'field' },
                React.createElement(
                  'label',
                  { className: 'label' },
                  'Lab:'
                ),
                React.createElement(
                  'div',
                  { className: 'control' },
                  React.createElement('input', { className: 'input', name: 'lab', type: 'text', placeholder: 'Example: quacks lab', value: filters.lab, onChange: updateFilters })
                )
              ),
              React.createElement(
                'div',
                { className: 'field' },
                React.createElement(
                  'label',
                  { className: 'label' },
                  'TA:'
                ),
                React.createElement(
                  'div',
                  { className: 'control' },
                  React.createElement('input', { className: 'input', name: 'ta', type: 'text', placeholder: 'Example: iliano', value: filters.ta, onChange: updateFilters })
                )
              ),
              React.createElement(
                'div',
                { className: 'field' },
                React.createElement(
                  'label',
                  { className: 'label' },
                  'Student:'
                ),
                React.createElement(
                  'div',
                  { className: 'control' },
                  React.createElement('input', { className: 'input', name: 'student_id', type: 'text', placeholder: 'Example: aditya', value: filters.student_id, onChange: updateFilters })
                )
              )
            )
          )
        ),
        React.createElement(
          'footer',
          { className: 'quickview-footer' },
          React.createElement(
            'div',
            { className: 'control' },
            React.createElement(
              'a',
              { className: 'button is-info', onClick: getData },
              React.createElement(
                'span',
                { className: 'icon' },
                React.createElement('i', { className: 'fa fa-table' })
              ),
              React.createElement(
                'span',
                null,
                'View Data'
              )
            )
          ),
          React.createElement(
            'div',
            { className: 'control' },
            React.createElement(
              'a',
              { className: 'button', onClick: function onClick() {
                  return updateFilters();
                } },
              React.createElement(
                'span',
                { className: 'icon' },
                React.createElement('i', { className: 'fa fa-broom' })
              ),
              React.createElement(
                'span',
                null,
                'Clear Filters'
              )
            )
          )
        )
      );
    }
  }]);

  return FilterPane;
}(React.Component);