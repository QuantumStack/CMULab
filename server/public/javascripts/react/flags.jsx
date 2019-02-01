class FlagDropdown extends React.Component {
  render() {
    const { _id, flags, good, toggleGood } = this.props;
    return <div className='dropdown-menu'>
      <div className='dropdown-content'>
        {flags.ghost &&
          <div>
            <div className='dropdown-item'>
              <p>
                <span className='icon is-small has-text-info'>
                  <i className='fas fa-ghost'></i>
                </span>
                &nbsp;
                Not registered for course at check-in.
              </p>
            </div>
            <hr className='dropdown-divider' />
          </div>
        }
        {flags.attempt &&
          <div>
            <div className='dropdown-item'>
              <p>
                <span className='icon is-small has-text-info'>
                  <i className='fas fa-redo'></i>
                </span>
                &nbsp;
                Student was checked in {flags.attemptDiff} prior{flags.attemptSection && ` to section ${flags.attemptSection}`} for {flags.attemptScore} points.
              </p>
            </div>
            <hr className='dropdown-divider' />
          </div>
        }
        {flags.section &&
          <div>
            <div className='dropdown-item'>
              <p>
                <span className='icon is-small has-text-info'>
                  <i className='fas fa-clock'></i>
                </span>
                &nbsp;
                Wrong section time.
              </p>
            </div>
            <hr className='dropdown-divider' />
          </div>
        }
        <div className='dropdown-item'>
          {(flags.ghost || flags.section) &&
            <p className='help'>
              <span className='icon is-small has-text-link'>
                <i className='fas fa-lightbulb'></i>
              </span>
              &nbsp;
               Go to the <a href='/admin/students'>students page</a> to update student registration data.
            </p>
          }
          {(flags.attempt || flags.section) &&
            <p className='help'>
              <span className='icon is-small has-text-link'>
                <i className='fas fa-lightbulb'></i>
              </span>
              &nbsp;
              Update section and time slot data <a href='/admin/settings'>in settings</a>.
            </p>
          }
        </div>
        <hr className='dropdown-divider' />
        <a onClick={toggleGood} className='dropdown-item'>
          <span className='icon is-small has-text-primary'>
            <i className='fas fa-gavel'></i>
          </span>
          &nbsp;
          Mark as <strong><span id={`${_id}-valid`} className={good ? 'has-text-danger' : 'has-text-success'}>{good && 'in'}valid</span></strong>{!good && ' anyway'}
        </a>
      </div>
    </div>;
  }
}

class FlagMark extends React.Component {
  render() {
    const { _id, flags, good, toggleGood, toggleDropdown, isActive } = this.props;
    return <div className={`dropdown is-right ${isActive ? 'is-active' : ''}`}>
      <div className='dropdown-trigger'>
        <a className='tooltip' onClick={toggleDropdown} data-tooltip='Suspicious activity detected'>
          <span className='icon has-text-danger'>
            <i className='fas fa-exclamation-triangle'></i>
          </span>
        </a>
      </div>
      <FlagDropdown {...{ _id, flags, good, isActive, toggleGood }} />
    </div>;
  }
}
