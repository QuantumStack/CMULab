var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DataTable = function (_React$Component) {
  _inherits(DataTable, _React$Component);

  function DataTable() {
    _classCallCheck(this, DataTable);

    return _possibleConstructorReturn(this, (DataTable.__proto__ || Object.getPrototypeOf(DataTable)).apply(this, arguments));
  }

  _createClass(DataTable, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          sort = _props.sort,
          entries = _props.entries,
          updateSort = _props.updateSort;

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
                { onClick: function onClick() {
                    return updateSort(name);
                  } },
                title,
                sort[name] && React.createElement(
                  'span',
                  { className: 'icon' },
                  React.createElement('i', { className: 'fas fa-caret-' + (sort[name] > 0 ? 'down' : 'up') })
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