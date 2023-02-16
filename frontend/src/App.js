import './App.css';
import { Route } from 'react-router-dom';
import Home from './Pages/HomePage';
import Chat from './Pages/ChatPage';

function App() {
  return (
    <div className="App">
      
      <Route path="/" component={Home} exact/>
      <Route path="/chats" component={Chat}/>
    
    </div>
  );
}

export default App;
