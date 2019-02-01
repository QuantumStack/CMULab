var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DataTable = function (_React$Component) {
  _inherits(DataTable, _React$Component);

  function DataTable(props) {
    _classCallCheck(this, DataTable);

    var _this = _possibleConstructorReturn(this, (DataTable.__proto__ || Object.getPrototypeOf(DataTable)).call(this, props));

    _this.state = {
      lab: '',
      preserve: false,
      isDone: false
    };
    _this.onChangeLab = _this.onChangeLab.bind(_this);
    _this.onChangePreserve = _this.onChangePreserve.bind(_this);
    _this.sendLab = _this.sendLab.bind(_this);
    return _this;
  }

  _createClass(DataTable, [{
    key: 'onChangeLab',
    value: function onChangeLab(e) {
      this.setState({ lab: e.target.value });
    }
  }, {
    key: 'onChangePreserve',
    value: function onChangePreserve(e) {
      this.setState({ preserve: e.target.checked });
    }
  }, {
    key: 'sendLab',
    value: function sendLab(f) {
      var _this2 = this;

      f.preventDefault();
      var _state = this.state,
          lab = _state.lab,
          preserve = _state.preserve;

      this.props.assignLab(lab, preserve);
      this.setState({ lab: '', isDone: true }, function () {
        return setTimeout(function () {
          _this2.setState({ isDone: false });
        }, 5000);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props = this.props,
          sort = _props.sort,
          entries = _props.entries,
          updateSort = _props.updateSort;
      var isDone = this.state.isDone;

      var columns = [['Section', 'section'], ['Student ID', 'student_id'], ['Score', 'score'], ['Lab', 'lab'], ['Date', 'date'], ['TA', 'ta'], ['Flags', 'flags']];
      return React.createElement(
        'table',
        { className: 'table is-hoverable is-fullwidth' },
        React.createElement(
          'thead',
          null,
          React.createElement(
            'tr',
            null,
            columns.map(function (_ref) {
              var _ref2 = _slicedToArray(_ref, 2),
                  title = _ref2[0],
                  name = _ref2[1];

              return React.createElement(
                'th',
                null,
                name === 'lab' && React.createElement(
                  'div',
                  { className: 'dropdown is-hoverable' },
                  React.createElement(
                    'div',
                    { className: 'dropdown-trigger' },
                    React.createElement(
                      'a',
                      { className: 'tooltip', 'data-tooltip': 'Assign lab' },
                      React.createElement(
                        'span',
                        { className: 'icon has-text-info' },
                        React.createElement('i', { className: 'fas fa-pencil-alt' })
                      )
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
                          'form',
                          { onSubmit: _this3.sendLab },
                          React.createElement(
                            'div',
                            { className: 'field' },
                            React.createElement(
                              'div',
                              { className: 'control' },
                              React.createElement('input', { className: 'input is-small', type: 'text', placeholder: 'Example: quacks lab', onChange: _this3.onChangeLab, required: true })
                            )
                          ),
                          React.createElement(
                            'div',
                            { className: 'field' },
                            React.createElement(
                              'label',
                              { className: 'checkbox' },
                              React.createElement('input', { type: 'checkbox', onChange: _this3.onChangePreserve }),
                              '\xA0 Preserve existing lab designations'
                            )
                          ),
                          React.createElement(
                            'div',
                            { className: 'field' },
                            React.createElement(
                              'div',
                              { className: 'control' },
                              React.createElement(
                                'button',
                                { type: 'submit', className: 'button is-info is-small' },
                                React.createElement(
                                  'span',
                                  { className: 'icon' },
                                  React.createElement('i', { className: 'fa fa-flask' })
                                ),
                                React.createElement(
                                  'span',
                                  null,
                                  'Submit'
                                )
                              ),
                              isDone && React.createElement(
                                'span',
                                { className: 'has-text-success' },
                                '\xA0Done!'
                              )
                            )
                          )
                        )
                      )
                    )
                  )
                ),
                React.createElement(
                  'span',
                  { onClick: function onClick() {
                      return updateSort(name);
                    } },
                  title,
                  sort[name] && React.createElement(
                    'span',
                    { className: 'icon' },
                    React.createElement('i', { className: 'fas fa-caret-' + (sort[name] > 0 ? 'down' : 'up') })
                  )
                )
              );
            })
          )
        ),
        React.createElement(
          'tbody',
          null,
          entries.map(function (entry) {
            return React.createElement(DataRow, entry);
          })
        )
      );
    }
  }]);

  return DataTable;
}(React.Component);