var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DataViewBar = function (_React$Component) {
  _inherits(DataViewBar, _React$Component);

  function DataViewBar() {
    _classCallCheck(this, DataViewBar);

    return _possibleConstructorReturn(this, (DataViewBar.__proto__ || Object.getPrototypeOf(DataViewBar)).apply(this, arguments));
  }

  _createClass(DataViewBar, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      bulmaQuickview.attach();
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          filters = _props.filters,
          updateFilters = _props.updateFilters,
          getData = _props.getData,
          downloadData = _props.downloadData,
          deleteData = _props.deleteData;

      return React.createElement(
        'nav',
        { className: 'level' },
        React.createElement(
          'div',
          { className: 'level-left' },
          React.createElement(
            'div',
            { className: 'level-item' },
            React.createElement(
              'a',
              { className: 'button is-small is-outlined is-dark', onClick: getData },
              React.createElement(
                'span',
                { className: 'icon' },
                React.createElement('i', { className: 'fa fa-sync-alt' })
              ),
              React.createElement(
                'span',
                null,
                'Refresh'
              )
            )
          ),
          React.createElement(
            'div',
            { className: 'level-item' },
            React.createElement(
              'div',
              { className: 'field has-addons' },
              React.createElement(
                'p',
                { className: 'control' },
                React.createElement(
                  'a',
                  { className: 'button is-small is-static' },
                  React.createElement(
                    'span',
                    { className: 'icon' },
                    React.createElement('i', { className: 'fa fa-download' })
                  ),
                  React.createElement(
                    'span',
                    null,
                    'Download'
                  )
                )
              ),
              React.createElement(
                'p',
                { className: 'control' },
                React.createElement(
                  'a',
                  { className: 'button is-small', onClick: function onClick() {
                      return downloadData('csv');
                    } },
                  'CSV'
                )
              ),
              React.createElement(
                'p',
                { className: 'control' },
                React.createElement(
                  'a',
                  { className: 'button is-small', onClick: function onClick() {
                      return downloadData('json');
                    } },
                  'JSON'
                )
              )
            )
          ),
          React.createElement(
            'div',
            { className: 'level-item' },
            React.createElement(
              'p',
              { className: 'subtitle is-6' },
              React.createElement(
                'strong',
                null,
                this.props.entriesCount
              ),
              ' entries'
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'level-right' },
          React.createElement(
            'p',
            { className: 'level-item', onClick: function onClick() {
                return updateFilters('all');
              } },
            !filters.flags && !filters.good ? React.createElement(
              'strong',
              null,
              'All'
            ) : React.createElement(
              'a',
              null,
              'All'
            )
          ),
          React.createElement(
            'p',
            { className: 'level-item', onClick: function onClick() {
                return updateFilters('flags');
              } },
            filters.flags ? React.createElement(
              'strong',
              null,
              'Flags'
            ) : React.createElement(
              'a',
              null,
              'Flags'
            )
          ),
          React.createElement(
            'p',
            { className: 'level-item', onClick: function onClick() {
                return updateFilters('good');
              } },
            filters.good ? React.createElement(
              'strong',
              null,
              'Valid'
            ) : React.createElement(
              'a',
              null,
              'Valid'
            )
          ),
          React.createElement(
            'p',
            { className: 'level-item' },
            React.createElement(
              'a',
              { className: 'button is-small is-link', 'data-show': 'quickview', 'data-target': 'quickviewDefault' },
              React.createElement(
                'span',
                { className: 'icon' },
                React.createElement('i', { className: 'fa fa-filter' })
              ),
              React.createElement(
                'span',
                null,
                'More Filters'
              )
            )
          ),
          React.createElement(
            'p',
            { className: 'level-item' },
            React.createElement(
              'div',
              { className: 'dropdown is-hoverable is-right' },
              React.createElement(
                'a',
                { className: 'button is-small is-danger dropdown-trigger' },
                React.createElement(
                  'span',
                  { className: 'icon' },
                  React.createElement('i', { className: 'fa fa-eraser' })
                ),
                React.createElement(
                  'span',
                  null,
                  'Delete'
                )
              ),
              React.createElement(
                'div',
                { className: 'dropdown-menu', role: 'menu' },
                React.createElement(
                  'div',
                  { className: 'dropdown-content' },
                  React.createElement(
                    'div',
                    { className: 'dropdown-item' },
                    React.createElement(
                      'p',
                      null,
                      'Are you sure? You will ',
                      React.createElement(
                        'strong',
                        null,
                        'never'
                      ),
                      ' be able to recover this data.'
                    )
                  ),
                  React.createElement(
                    'a',
                    { className: 'dropdown-item has-text-danger', onClick: deleteData },
                    React.createElement(
                      'span',
                      { className: 'icon' },
                      React.createElement('i', { className: 'fa fa-trash' })
                    ),
                    React.createElement(
                      'span',
                      null,
                      React.createElement(
                        'strong',
                        null,
                        'Permanently Delete'
                      )
                    )
                  )
                )
              )
            )
          )
        )
      );
    }
  }]);

  return DataViewBar;
}(React.Component);