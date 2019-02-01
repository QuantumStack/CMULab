class DataView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      entries: [],
      filters: {
        good: true,
      },
      sort: {
        date: -1,
      },
      modalActive: false,
      downloadData: '',
    };
    this.getData = this.getData.bind(this);
    this.downloadData = this.downloadData.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.deleteData = this.deleteData.bind(this);
    this.updateFilters = this.updateFilters.bind(this);
    this.updateSort = this.updateSort.bind(this);
    this.assignLab = this.assignLab.bind(this);
  }

  getData() {
    axios.post('/admin/rawdata', {
      filters: this.state.filters,
      sort: this.state.sort,
    }).then(res => this.setState({
      isLoaded: true,
      entries: res.data,
    }), err => this.setState({
      isLoaded: true,
      error: err,
    }));
  }

  downloadData(type) {
    if (type === 'csv') {
      axios.post('/admin/getcsv', {
        filters: this.state.filters,
        sort: this.state.sort,
      }).then(res => this.setState({
        downloadData: res.data,
      }, this.toggleModal), err => this.setState({ error: err }));
    }
    if (type === 'json') {
      this.setState({
        downloadData: JSON.stringify(this.state.entries.map((entry) => {
          const newEntry = entry;
          delete newEntry.__v;
          delete newEntry._id;
          return newEntry;
        }), null, 2),
      }, this.toggleModal);
    }
  }

  toggleModal() {
    this.setState(state => ({ modalActive: !state.modalActive }));
  }

  deleteData() {
    axios.post('/admin/delete', {
      filters: this.state.filters,
    }).then(() => this.setState({
      entries: [],
    }), err => this.setState({ error: err }));
  }

  updateFilters(e) {
    if (['all', 'flags', 'good'].includes(e)) {
      this.setState((state) => {
        const { filters } = state;
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
        return { filters };
      }, this.getData);
    } else if (e) {
      const { name, value } = e.target;
      this.setState((state) => {
        const { filters } = state;
        if (value === '') delete filters[name];
        else filters[name] = value;
        return { filters };
      });
    } else {
      this.setState({ filters: {} }, this.getData);
    }
  }

  updateSort(field) {
    this.setState((state) => {
      let { sort } = state;
      if (sort[field]) sort[field] *= -1;
      else {
        sort = {};
        sort[field] = 1;
      }
      return { sort };
    }, this.getData);
  }

  assignLab(lab, preserve) {
    axios.post('/admin/assignlab', {
      filters: this.state.filters,
      lab,
      preserve,
    }).then(this.getData, err => this.setState({ error: err }));
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    const {
      error, isLoaded, entries, filters, sort, modalActive, downloadData,
    } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    }
    if (!isLoaded) {
      return <div className='has-text-centered'>Loading...</div>;
    }
    return <div>
      <FilterPane filters={filters} updateFilters={this.updateFilters} getData={this.getData} />
      <DataViewBar entriesCount={entries.length} filters={filters} updateFilters={this.updateFilters} getData={this.getData} downloadData={this.downloadData} deleteData={this.deleteData} />
      <DataDownload isActive={modalActive} toggleModal={this.toggleModal} data={downloadData} />
      <DataTable sort={sort} entries={entries} updateSort={this.updateSort} assignLab={this.assignLab} />
    </div>;
  }
}

ReactDOM.render(
  <DataView />,
  document.getElementById('root'),
);
