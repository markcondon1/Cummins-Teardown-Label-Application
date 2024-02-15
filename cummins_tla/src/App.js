import axios from 'axios';

import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './logo.png';
import './App.css';

function App() {

//connect express
//data will be the string we send from our server
  const apiCall = () => {
    axios.get('http://localhost:8080').then((data) => {
      //this console.log will be in our frontend console
      console.log(data)
    })

  }
  return (
    <div className="App">
      <div class="row">
        <div class="col-12 col-lg-6">
        <h1><img src={logo} width={75} height ={75}/>Cummins Unified Teardown Label Application <Button>Logout</Button>{' '}</h1>
        
        </div>
      </div>
      <header className="App-header">
        <button onClick={apiCall}> Making API call</button>
      </header>
    </div>
  );
}

export default App;
