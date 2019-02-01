var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FlagDropdown = function (_React$Component) {
  _inherits(FlagDropdown, _React$Component);

  function FlagDropdown() {
    _classCallCheck(this, FlagDropdown);

    return _possibleConstructorReturn(this, (FlagDropdown.__proto__ || Object.getPrototypeOf(FlagDropdown)).apply(this, arguments));
  }

  _createClass(FlagDropdown, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          _id = _props._id,
          flags = _props.flags,
          good = _props.good,
          toggleGood = _props.toggleGood;

      return React.createElement(
        'div',
        { className: 'dropdown-menu' },
        React.createElement(
          'div',
          { className: 'dropdown-content' },
          flags.ghost && React.createElement(
            'div',
            null,
            React.createElement(
              'div',
              { className: 'dropdown-item' },
              React.createElement(
                'p',
                null,
                React.createElement(
                  'span',
                  { className: 'icon is-small has-text-info' },
                  React.createElement('i', { className: 'fas fa-ghost' })
                ),
                '\xA0 Not registered for course at check-in.'
              )
            ),
            React.createElement('hr', { className: 'dropdown-divider' })
          ),
          flags.attempt && React.createElement(
            'div',
            null,
            React.createElement(
              'div',
              { className: 'dropdown-item' },
              React.createElement(
                'p',
                null,
                React.createElement(
                  'span',
                  { className: 'icon is-small has-text-info' },
                  React.createElement('i', { className: 'fas fa-redo' })
                ),
                '\xA0 Student was checked in ',
                flags.attempt.diff,
                ' prior',
                this.flags.attempt.section && ' to section ' + flags.attempt.section,
                ' for ',
                flags.attempt.score,
                ' points.'
              )
            ),
            React.createElement('hr', { className: 'dropdown-divider' })
          ),
          flags.section && React.createElement(
            'div',
            null,
            React.createElement(
              'div',
              { className: 'dropdown-item' },
              React.createElement(
                'p',
                null,
                React.createElement(
                  'span',
                  { className: 'icon is-small has-text-info' },
                  React.createElement('i', { className: 'fas fa-clock' })
                ),
                '\xA0 Wrong section time.'
              )
            ),
            React.createElement('hr', { className: 'dropdown-divider' })
          ),
          React.createElement(
            'div',
            { className: 'dropdown-item' },
            (flags.ghost || flags.attempts) && React.createElement(
              'p',
              { className: 'help' },
              React.createElement(
                'span',
                { className: 'icon is-small has-text-link' },
                React.createElement('i', { className: 'fas fa-lightbulb' })
              ),
              '\xA0 Go to the ',
              React.createElement(
                'a',
                { href: '/admin/students' },
                'students page'
              ),
              ' to update student registration data.'
            ),
            (flags.attempts || flags.section) && React.createElement(
              'p',
              { className: 'help' },
              React.createElement(
                'span',
                { className: 'icon is-small has-text-link' },
                React.createElement('i', { className: 'fas fa-lightbulb' })
              ),
              '\xA0 Update section and time slot data ',
              React.createElement(
                'a',
                { href: '/admin/settings' },
                'in settings'
              ),
              '.'
            )
          ),
          React.createElement('hr', { className: 'dropdown-divider' }),
          React.createElement(
            'a',
            { onClick: toggleGood, className: 'dropdown-item' },
            React.createElement(
              'span',
              { className: 'icon is-small has-text-primary' },
              React.createElement('i', { className: 'fas fa-gavel' })
            ),
            '\xA0 Mark as ',
            React.createElement(
              'strong',
              null,
              React.createElement(
                'span',
                { id: _id + '-valid', className: good ? 'has-text-danger' : 'has-text-success' },
                good && 'in',
                'valid'
              )
            ),
            !good && ' anyway'
          )
        )
      );
    }
  }]);

  return FlagDropdown;
}(React.Component);

var FlagMark = function (_React$Component2) {
  _inherits(FlagMark, _React$Component2);

  function FlagMark() {
    _classCallCheck(this, FlagMark);

    return _possibleConstructorReturn(this, (FlagMark.__proto__ || Object.getPrototypeOf(FlagMark)).apply(this, arguments));
  }

  _createClass(FlagMark, [{
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          _id = _props2._id,
          flags = _props2.flags,
          good = _props2.good,
          toggleGood = _props2.toggleGood,
          toggleDropdown = _props2.toggleDropdown,
          isActive = _props2.isActive;

      return React.createElement(
        'div',
        { className: 'dropdown is-right ' + (isActive ? 'is-active' : '') },
        React.createElement(
          'div',
          { className: 'dropdown-trigger' },
          React.createElement(
            'a',
            { className: 'tooltip', onClick: toggleDropdown, 'data-tooltip': 'Suspicious activity detected' },
            React.createElement(
              'span',
              { className: 'icon has-text-danger' },
              React.createElement('i', { className: 'fas fa-exclamation-triangle' })
            )
          )
        ),
        React.createElement(FlagDropdown, { _id: _id, flags: flags, good: good, isActive: isActive, toggleGood: toggleGood })
      );
    }
  }]);

  return FlagMark;
}(React.Component);