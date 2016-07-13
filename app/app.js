import React from 'react';
import ReactDOM from 'react-dom';
import AppContainer from './containers/app.container.js';

class Main extends React.Component {
  render () {
    return (
      <AppContainer />
    );
  }
}

ReactDOM.render(<Main />, document.getElementById('content'));
