class DataTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lab: '',
      preserve: false,
      isDone: false,
    };
    this.onChangeLab = this.onChangeLab.bind(this);
    this.onChangePreserve = this.onChangePreserve.bind(this);
    this.sendLab = this.sendLab.bind(this);
  }

  onChangeLab(e) {
    this.setState({ lab: e.target.value });
  }

  onChangePreserve(e) {
    this.setState({ preserve: e.target.checked });
  }

  sendLab(f) {
    f.preventDefault();
    const { lab, preserve } = this.state;
    this.props.assignLab(lab, preserve);
    this.setState({ lab: '', isDone: true }, () => setTimeout(() => {
      this.setState({ isDone: false });
    }, 5000));
  }

  render() {
    const { sort, entries, updateSort } = this.props;
    const { isDone } = this.state;
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
          <th>
            {name === 'lab' &&
              <div className='dropdown is-hoverable'>
                <div className='dropdown-trigger'>
                  <a className='tooltip' data-tooltip='Assign lab'>
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
                            <input className='input is-small' type='text' placeholder='Example: quacks lab' onChange={this.onChangeLab} required />
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
                            {isDone && <span className='has-text-success'>&nbsp;Done!</span>}
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
          <DataRow {...entry} />
        ))}
      </tbody>
    </table>;
  }
}
