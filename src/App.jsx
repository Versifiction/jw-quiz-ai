import { BrowserRouter } from "react-router-dom";
import { GoogleAuthProvider } from "firebase/auth";
import { Link } from "react-router-dom";

import Router from "./Router";

function App() {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
}

export default App;
