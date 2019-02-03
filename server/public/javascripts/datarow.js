var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DataRow = function (_React$Component) {
  _inherits(DataRow, _React$Component);

  function DataRow(props) {
    _classCallCheck(this, DataRow);

    var _this = _possibleConstructorReturn(this, (DataRow.__proto__ || Object.getPrototypeOf(DataRow)).call(this, props));

    _this.state = {
      good: _this.props.good,
      isActive: false
    };
    _this.toggleDropdown = _this.toggleDropdown.bind(_this);
    _this.toggleGood = _this.toggleGood.bind(_this);
    return _this;
  }

  _createClass(DataRow, [{
    key: 'toggleDropdown',
    value: function toggleDropdown() {
      this.setState(function (state) {
        return { isActive: !state.isActive };
      });
    }
  }, {
    key: 'toggleGood',
    value: function toggleGood() {
      var _this2 = this;

      axios.post('/admin/togglegood', {
        _id: this.props._id,
        good: !this.state.good
      }).then(function (res) {
        if (res.status === 200) {
          _this2.setState(function (state) {
            return { good: !state.good };
          });
          _this2.toggleDropdown();
        }
      }, function () {
        window.location = '/error';
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          _id = _props._id,
          section = _props.section,
          student_id = _props.student_id,
          score = _props.score,
          lab = _props.lab,
          date = _props.date,
          ta = _props.ta,
          flags = _props.flags;
      var _state = this.state,
          good = _state.good,
          isActive = _state.isActive;

      return React.createElement(
        'tr',
        null,
        React.createElement(
          'td',
          null,
          section
        ),
        React.createElement(
          'td',
          null,
          student_id
        ),
        React.createElement(
          'td',
          null,
          score
        ),
        React.createElement(
          'td',
          null,
          lab
        ),
        React.createElement(
          'td',
          null,
          date
        ),
        React.createElement(
          'td',
          null,
          ta
        ),
        React.createElement(
          'td',
          null,
          flags && React.createElement(FlagMark, Object.assign({ _id: _id, flags: flags, good: good, isActive: isActive }, { toggleDropdown: this.toggleDropdown, toggleGood: this.toggleGood })),
          good && React.createElement(
            'span',
            { id: this._id + '-check', className: 'icon has-text-success tooltip', 'data-tooltip': flags ? 'Marked as valid' : 'Everything checks out!' },
            React.createElement('i', { className: 'fas fa-check' })
          )
        )
      );
    }
  }]);

  return DataRow;
}(React.Component);