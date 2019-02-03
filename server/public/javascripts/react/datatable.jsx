class DataTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lab: '',
      labActive: false,
      preserve: false,
    };
    this.toggleLab = this.toggleLab.bind(this);
    this.onChangeLab = this.onChangeLab.bind(this);
    this.onChangePreserve = this.onChangePreserve.bind(this);
    this.sendLab = this.sendLab.bind(this);
  }

  toggleLab() {
    this.setState(({ labActive }) => ({ labActive: !labActive }));
  }

  onChangeLab(e) {
    this.setState({ lab: e.target.value });
  }

  onChangePreserve(e) {
    this.setState({ preserve: e.target.checked });
  }

  sendLab(f) {
    this.toggleLab();
    f.preventDefault();
    const { lab, preserve } = this.state;
    this.props.assignLab(lab, preserve);
    this.setState({ lab: '' });
  }

  render() {
    const { sort, entries, updateSort } = this.props;
    const { labActive } = this.state;
    const columns = [
      ['Section', 'section'],
      ['Student ID', 'student_id'],
      ['Score', 'score'],
      ['Lab', 'lab'],
      ['Date', 'date'],
      ['TA', 'ta'],
      ['Flags', 'flags'],
    ];
    return <table className='table is-hoverable is-fullwidth'>
      <thead>
        <tr>
        {columns.map(([title, name]) => (
          <th key={name}>
            {name === 'lab' &&
              <div className={`dropdown ${labActive ? 'is-active' : ''}`}>
                <div className='dropdown-trigger'>
                  <a className='tooltip' data-tooltip='Assign lab' onClick={this.toggleLab}>
                    <span className='icon has-text-info'>
                      <i className='fas fa-pencil-alt'></i>
                    </span>
                  </a>
                </div>
                <div className='dropdown-menu' role='menu'>
                  <div className='dropdown-content'>
                    <div className='dropdown-item'>
                      <form onSubmit={this.sendLab}>
                        <div className='field'>
                          <div className='control'>
                            <input className='input is-small' type='text' placeholder='Example: quacks lab' onChange={this.onChangeLab} />
                          </div>
                        </div>
                        <div className='field'>
                          <label className='checkbox'>
                            <input type='checkbox' onChange={this.onChangePreserve} />
                            &nbsp;
                            Preserve existing lab designations
                          </label>
                        </div>
                        <div className='field'>
                          <div className='control'>
                            <button type='submit' className='button is-info is-small'>
                              <span className='icon'>
                                <i className='fa fa-flask'></i>
                                </span>
                              <span>Submit</span>
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            }
            <span onClick={() => updateSort(name)}>
              {title}
              {sort[name] &&
                <span className='icon'>
                  <i className={`fas fa-caret-${sort[name] > 0 ? 'down' : 'up'}`}></i>
                </span>
              }
            </span>
          </th>
        ))}
        </tr>
      </thead>
      <tbody>
        {entries.map(entry => (
          <DataRow key={entry._id} {...entry} />
        ))}
      </tbody>
    </table>;
  }
}
