class DataViewBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteConfirmation: false,
      deleteActive: false,
    };
    this.onDeleteConfirmationChange = this.onDeleteConfirmationChange.bind(this);
    this.toggleDelete = this.toggleDelete.bind(this);
    this.toggleThenDelete = this.toggleThenDelete.bind(this);
  }

  onDeleteConfirmationChange(e) {
    this.setState({ deleteConfirmation: e.target.checked });
  }

  toggleDelete() {
    this.setState(({ deleteActive }) => ({ deleteActive: !deleteActive }));
  }

  toggleThenDelete() {
    if (this.state.deleteConfirmation) {
      this.toggleDelete();
      this.setState({ deleteConfirmation: false });
      this.props.deleteData();
    }
  }

  render() {
    const {
      showDelete, filters, toggleFilters, updateFilters, getData, downloadData,
    } = this.props;
    const { deleteConfirmation, deleteActive } = this.state;
    return <nav className='level'>
      <div className='level-left'>
        <div className='level-item'>
          <a className='button is-small is-outlined is-dark' onClick={getData}>
            <span className='icon'>
              <i className='fa fa-sync-alt'></i>
              </span>
            <span>Refresh</span>
          </a>
        </div>
        <div className='level-item'>
          <div className='field has-addons'>
            <p className='control'>
              <a className='button is-small is-static'>
                <span className='icon'>
                  <i className='fa fa-download'></i>
                  </span>
                <span>Download</span>
              </a>
            </p>
            <p className='control'>
              <a className='button is-small' onClick={() => downloadData('csv')}>
                CSV
              </a>
            </p>
            <p className='control'>
              <a className='button is-small' onClick={() => downloadData('json')}>
                JSON
              </a>
            </p>
          </div>
        </div>
        <div className='level-item'>
          <p className='subtitle is-6'>
            <strong>{this.props.entriesCount}</strong> entries
          </p>
        </div>
      </div>

      <div className='level-right'>
        <p className='level-item'  onClick={() => updateFilters('all')}>
          {(!filters.flags && !filters.good) ?
            <strong>All</strong>
            : <a>All</a>
          }
        </p>
        <p className='level-item' onClick={() => updateFilters('flags')}>
          {filters.flags ?
            <strong>Flags</strong>
            : <a>Flags</a>
          }
        </p>
        <p className='level-item' onClick={() => updateFilters('good')}>
          {filters.good ?
            <strong>Valid</strong>
            : <a>Valid</a>
          }
        </p>
        <p className='level-item'>
          <a className='button is-small is-link' onClick={toggleFilters}>
            <span className='icon'>
              <i className='fa fa-filter'></i>
              </span>
            <span>More Filters</span>
          </a>
        </p>
        {showDelete && 
          <p className='level-item'>
            <div className={`dropdown is-right ${deleteActive ? 'is-active' : ''}`}>
              <a className='button is-small is-danger dropdown-trigger' onClick={this.toggleDelete}>
                <span className='icon'>
                  <i className='fa fa-eraser'></i>
                  </span>
                <span>Delete</span>
              </a>
              <div className='dropdown-menu' role='menu'>
                <div className='dropdown-content'>
                  <div className='dropdown-item'>
                    <div className='field'>
                      <label className='checkbox'>
                        <input type='checkbox' checked={deleteConfirmation} onChange={this.onDeleteConfirmationChange} />
                        &nbsp;
                        I'm sure about this
                      </label>
                    </div>
                  </div>
                  <a className='dropdown-item has-text-danger' onClick={this.toggleThenDelete}>
                    <span className='icon'>
                      <i className='fa fa-trash'></i>
                      </span>
                    <span><strong>Permanently Delete</strong></span>
                  </a>
                </div>
              </div>
            </div>
          </p>
        }
      </div>
    </nav>;
  }
}
