class DataViewBar extends React.Component {
  componentDidMount() {
    bulmaQuickview.attach();
  }

  render() {
    const {
      filters, updateFilters, getData, downloadData, deleteData,
    } = this.props;
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
          <a className='button is-small is-link' data-show='quickview' data-target='quickviewDefault'>
            <span className='icon'>
              <i className='fa fa-filter'></i>
              </span>
            <span>More Filters</span>
          </a>
        </p>
        <p className='level-item'>
          <div className='dropdown is-hoverable is-right'>
            <a className='button is-small is-danger dropdown-trigger'>
              <span className='icon'>
                <i className='fa fa-eraser'></i>
                </span>
              <span>Delete</span>
            </a>
            <div className='dropdown-menu' role='menu'>
              <div className='dropdown-content'>
                <div className='dropdown-item'>
                  <p>Are you sure? You will <strong>never</strong> be able to recover this data.</p>
                </div>
                <a className='dropdown-item has-text-danger' onClick={deleteData}>
                  <span className='icon'>
                    <i className='fa fa-trash'></i>
                    </span>
                  <span><strong>Permanently Delete</strong></span>
                </a>
              </div>
            </div>
          </div>
        </p>
      </div>
    </nav>;
  }
}
