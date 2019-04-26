class DataRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      good: this.props.good,
      isActive: false,
    };
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.toggleGood = this.toggleGood.bind(this);
  }

  toggleDropdown() {
    this.setState(state => ({ isActive: !state.isActive }));
  }

  toggleGood() {
    axios.post('/admin/togglegood', {
      _id: this.props._id,
      good: !this.state.good,
    }).then((res) => {
      if (res.status === 200) {
        this.setState(state => ({ good: !state.good }));
        this.toggleDropdown();
      }
    }, () => {
      window.location = '/error';
    });
  }

  render() {
    const { showStudent, _id, section, student_id, score, lab, date, ta, flags } = this.props;
    const { good, isActive } = this.state;
    return <tr>
      <td>
        {section}
      </td>
      <td>
        {showStudent ? student_id : '••••••'}
      </td>
      <td>
        {score}
      </td>
      <td>
        {lab}
      </td>
      <td>
        {date}
      </td>
      <td>
        {ta}
      </td>
      <td>
        {flags &&
          <FlagMark {...{ _id, flags, good, isActive }} toggleDropdown={this.toggleDropdown} toggleGood={this.toggleGood} />
        }
        {good &&
          <span id={`${this._id}-check`} className='icon has-text-success tooltip' data-tooltip={flags ? 'Marked as valid' : 'Everything checks out!'}>
            <i className='fas fa-check'></i>
          </span>
        }
      </td>
    </tr>;
  }
}
