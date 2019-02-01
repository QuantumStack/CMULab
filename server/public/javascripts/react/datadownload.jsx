class DataDownload extends React.Component {
  render() {
    const { data, isActive, toggleModal } = this.props;
    return <div className={`modal ${isActive ? 'is-active' : ''}`}>
      <div className='modal-background'></div>
      <div className='modal-content'>
        <div className='box'>
          <pre>
            {data}
          </pre>
        </div>
      </div>
      <button className='modal-close is-large' onClick={toggleModal}></button>
    </div>;
  }
}
