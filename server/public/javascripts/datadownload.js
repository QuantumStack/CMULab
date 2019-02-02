var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DataDownload = function (_React$Component) {
  _inherits(DataDownload, _React$Component);

  function DataDownload(props) {
    _classCallCheck(this, DataDownload);

    var _this = _possibleConstructorReturn(this, (DataDownload.__proto__ || Object.getPrototypeOf(DataDownload)).call(this, props));

    _this.fullData = React.createRef();
    _this.selectAll = _this.selectAll.bind(_this);
    _this.download = _this.download.bind(_this);
    return _this;
  }

  _createClass(DataDownload, [{
    key: 'selectAll',
    value: function selectAll() {
      var node = this.fullData.current;

      if (document.body.createTextRange) {
        var range = document.body.createTextRange();
        range.moveToElementText(node);
        range.select();
      } else if (window.getSelection) {
        var selection = window.getSelection();
        var _range = document.createRange();
        _range.selectNodeContents(node);
        selection.removeAllRanges();
        selection.addRange(_range);
      }
    }
  }, {
    key: 'download',
    value: function (_download) {
      function download() {
        return _download.apply(this, arguments);
      }

      download.toString = function () {
        return _download.toString();
      };

      return download;
    }(function () {
      download(this.props.data, 'data.csv', 'text/' + this.props.type);
    })
  }, {
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
              'a',
              { className: 'button is-small is-outlined is-dark', onClick: this.selectAll },
              React.createElement(
                'span',
                { className: 'icon' },
                React.createElement('i', { className: 'fa fa-mouse-pointer' })
              ),
              React.createElement(
                'span',
                null,
                'Select All'
              )
            ),
            '\xA0',
            React.createElement(
              'a',
              { className: 'button is-small is-outlined is-dark', onClick: this.download },
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
            ),
            React.createElement('br', null),
            React.createElement('br', null),
            React.createElement(
              'pre',
              { ref: this.fullData },
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