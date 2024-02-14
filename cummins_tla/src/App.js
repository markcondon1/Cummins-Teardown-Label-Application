import axios from 'axios';
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
      <header className="App-header">
        <button onClick={apiCall}> Making API call</button>
      </header>
    </div>
  );
}

export default App;
