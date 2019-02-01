class DataTable extends React.Component {
  render() {
    const { sort, entries, updateSort } = this.props;
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
          <th onClick={() => updateSort(name)}>
            {title}
            {sort[name] &&
              <span className='icon'>
                <i className={`fas fa-caret-${sort[name] > 0 ? 'down' : 'up'}`}></i>
              </span>
            }
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
