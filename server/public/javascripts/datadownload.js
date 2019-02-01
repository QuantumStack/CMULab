var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DataDownload = function (_React$Component) {
  _inherits(DataDownload, _React$Component);

  function DataDownload() {
    _classCallCheck(this, DataDownload);

    return _possibleConstructorReturn(this, (DataDownload.__proto__ || Object.getPrototypeOf(DataDownload)).apply(this, arguments));
  }

  _createClass(DataDownload, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          data = _props.data,
          isActive = _props.isActive,
          toggleModal = _props.toggleModal;

      return React.createElement(
        'div',
        { className: 'modal ' + (isActive ? 'is-active' : '') },
        React.createElement('div', { className: 'modal-background' }),
        React.createElement(
          'div',
          { className: 'modal-content' },
          React.createElement(
            'div',
            { className: 'box' },
            React.createElement(
              'pre',
              null,
              data
            )
          )
        ),
        React.createElement('button', { className: 'modal-close is-large', onClick: toggleModal })
      );
    }
  }]);

  return DataDownload;
}(React.Component);