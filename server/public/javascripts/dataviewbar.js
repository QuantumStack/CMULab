var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DataViewBar = function (_React$Component) {
  _inherits(DataViewBar, _React$Component);

  function DataViewBar(props) {
    _classCallCheck(this, DataViewBar);

    var _this = _possibleConstructorReturn(this, (DataViewBar.__proto__ || Object.getPrototypeOf(DataViewBar)).call(this, props));

    _this.state = {
      deleteConfirmation: false,
      deleteActive: false
    };
    _this.onDeleteConfirmationChange = _this.onDeleteConfirmationChange.bind(_this);
    _this.toggleDelete = _this.toggleDelete.bind(_this);
    _this.toggleThenDelete = _this.toggleThenDelete.bind(_this);
    return _this;
  }

  _createClass(DataViewBar, [{
    key: 'onDeleteConfirmationChange',
    value: function onDeleteConfirmationChange(e) {
      this.setState({ deleteConfirmation: e.target.checked });
    }
  }, {
    key: 'toggleDelete',
    value: function toggleDelete() {
      this.setState(function (_ref) {
        var deleteActive = _ref.deleteActive;
        return { deleteActive: !deleteActive };
      });
    }
  }, {
    key: 'toggleThenDelete',
    value: function toggleThenDelete() {
      if (this.state.deleteConfirmation) {
        this.toggleDelete();
        this.setState({ deleteConfirmation: false });
        this.props.deleteData();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          showDelete = _props.showDelete,
          filters = _props.filters,
          toggleFilters = _props.toggleFilters,
          updateFilters = _props.updateFilters,
          getData = _props.getData,
          downloadData = _props.downloadData;
      var _state = this.state,
          deleteConfirmation = _state.deleteConfirmation,
          deleteActive = _state.deleteActive;

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
              { className: 'button is-small is-link', onClick: toggleFilters },
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
          showDelete && React.createElement(
            'p',
            { className: 'level-item' },
            React.createElement(
              'div',
              { className: 'dropdown is-right ' + (deleteActive ? 'is-active' : '') },
              React.createElement(
                'a',
                { className: 'button is-small is-danger dropdown-trigger', onClick: this.toggleDelete },
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
                      'div',
                      { className: 'field' },
                      React.createElement(
                        'label',
                        { className: 'checkbox' },
                        React.createElement('input', { type: 'checkbox', checked: deleteConfirmation, onChange: this.onDeleteConfirmationChange }),
                        '\xA0 I\'m sure about this'
                      )
                    )
                  ),
                  React.createElement(
                    'a',
                    { className: 'dropdown-item has-text-danger', onClick: this.toggleThenDelete },
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