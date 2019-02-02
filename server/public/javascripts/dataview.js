var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DataView = function (_React$Component) {
  _inherits(DataView, _React$Component);

  function DataView(props) {
    _classCallCheck(this, DataView);

    var _this = _possibleConstructorReturn(this, (DataView.__proto__ || Object.getPrototypeOf(DataView)).call(this, props));

    _this.state = {
      error: null,
      isLoaded: false,
      entries: [],
      filters: {
        good: true
      },
      sort: {
        date: -1
      },
      modalActive: false,
      downloadData: '',
      downloadType: ''
    };
    _this.getData = _this.getData.bind(_this);
    _this.downloadData = _this.downloadData.bind(_this);
    _this.toggleModal = _this.toggleModal.bind(_this);
    _this.deleteData = _this.deleteData.bind(_this);
    _this.updateFilters = _this.updateFilters.bind(_this);
    _this.updateSort = _this.updateSort.bind(_this);
    _this.assignLab = _this.assignLab.bind(_this);
    return _this;
  }

  _createClass(DataView, [{
    key: 'getData',
    value: function getData() {
      var _this2 = this;

      axios.post('/admin/rawdata', {
        filters: this.state.filters,
        sort: this.state.sort
      }).then(function (res) {
        return _this2.setState({
          isLoaded: true,
          entries: res.data
        });
      }, function (err) {
        return _this2.setState({
          isLoaded: true,
          error: err
        });
      });
    }
  }, {
    key: 'downloadData',
    value: function downloadData(type) {
      var _this3 = this;

      if (type === 'csv') {
        axios.post('/admin/getcsv', {
          filters: this.state.filters,
          sort: this.state.sort
        }).then(function (res) {
          return _this3.setState({
            downloadData: res.data,
            downloadType: type
          }, _this3.toggleModal);
        }, function (err) {
          return _this3.setState({ error: err });
        });
      }
      if (type === 'json') {
        this.setState({
          downloadData: JSON.stringify(this.state.entries.map(function (entry) {
            var newEntry = entry;
            delete newEntry.__v;
            delete newEntry._id;
            return newEntry;
          }), null, 2),
          downloadType: type
        }, this.toggleModal);
      }
    }
  }, {
    key: 'toggleModal',
    value: function toggleModal() {
      this.setState(function (state) {
        return { modalActive: !state.modalActive };
      });
    }
  }, {
    key: 'deleteData',
    value: function deleteData() {
      var _this4 = this;

      axios.post('/admin/delete', {
        filters: this.state.filters
      }).then(function () {
        return _this4.setState({
          entries: []
        });
      }, function (err) {
        return _this4.setState({ error: err });
      });
    }
  }, {
    key: 'updateFilters',
    value: function updateFilters(e) {
      console.log(e);
      if (['all', 'flags', 'good'].includes(e)) {
        this.setState(function (state) {
          var filters = state.filters;

          if (e === 'all') {
            delete filters.flags;
            delete filters.good;
          }
          if (e === 'flags') {
            filters.flags = true;
            delete filters.good;
          }
          if (e === 'good') {
            filters.good = true;
            delete filters.flags;
          }
          return { filters: filters };
        }, this.getData);
      } else if (e) {
        var _e$target = e.target,
            name = _e$target.name,
            value = _e$target.value;

        this.setState(function (state) {
          var filters = state.filters;

          if (value === '') delete filters[name];else filters[name] = value;
          return { filters: filters };
        });
      } else {
        this.setState({ filters: {} }, this.getData);
      }
    }
  }, {
    key: 'updateSort',
    value: function updateSort(field) {
      this.setState(function (state) {
        var sort = state.sort;

        if (sort[field]) sort[field] *= -1;else {
          sort = {};
          sort[field] = 1;
        }
        return { sort: sort };
      }, this.getData);
    }
  }, {
    key: 'assignLab',
    value: function assignLab(lab, preserve) {
      var _this5 = this;

      axios.post('/admin/assignlab', {
        filters: this.state.filters,
        lab: lab,
        preserve: preserve
      }).then(this.getData, function (err) {
        return _this5.setState({ error: err });
      });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.getData();
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state,
          error = _state.error,
          isLoaded = _state.isLoaded,
          entries = _state.entries,
          filters = _state.filters,
          sort = _state.sort,
          modalActive = _state.modalActive,
          downloadData = _state.downloadData,
          downloadType = _state.downloadType;

      if (error) {
        return React.createElement(
          'div',
          null,
          'Error: ',
          error.message
        );
      }
      if (!isLoaded) {
        return React.createElement(
          'div',
          { className: 'has-text-centered' },
          'Loading...'
        );
      }
      return React.createElement(
        'div',
        null,
        React.createElement(FilterPane, { filters: filters, updateFilters: this.updateFilters, getData: this.getData }),
        React.createElement(DataViewBar, { entriesCount: entries.length, filters: filters, updateFilters: this.updateFilters, getData: this.getData, downloadData: this.downloadData, deleteData: this.deleteData }),
        React.createElement(DataDownload, { isActive: modalActive, toggleModal: this.toggleModal, data: downloadData, type: downloadType }),
        React.createElement(DataTable, { sort: sort, entries: entries, updateSort: this.updateSort, assignLab: this.assignLab })
      );
    }
  }]);

  return DataView;
}(React.Component);

ReactDOM.render(React.createElement(DataView, null), document.getElementById('root'));