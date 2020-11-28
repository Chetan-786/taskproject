import React from 'react';
import './App.css';
import './sass/App.scss';
import Routes from './routes';
import SideBar from './components/sidebar';
import CommonFile from './common';
import constants from './constants';

function App() {
  return (
    <div className="App">
      {sessionStorage.getItem(constants.sessionStorageUserDetails) ? <SideBar /> : ""}
      <CommonFile />
      <Routes sessionValuesProps={sessionStorage.getItem(constants.sessionStorageUserDetails)} />
    </div>
  );
}

export default App;
