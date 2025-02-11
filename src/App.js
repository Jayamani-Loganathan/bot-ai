import "./App.css";
import Chatbot from "./Chatbot";

function App() {
  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT;
  const pendingListEndpoint = process.env.REACT_APP_PENDING_API;

  return (
    <div className="App">
      <Chatbot apiEndpoint={apiEndpoint} pendingListEndpoint={pendingListEndpoint}/>
    </div>
  );
}

export default App;
