import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Main from "./views/MainPage";
import SignUp from "./views/SignUpPage";
import SignIn from "./views/SignInPage";
import GamePage from "./views/GamePage";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate replace to="/main" />} />
        <Route path="/main" element={<Main />} />
        <Route path="/Signup" element={<SignUp />} />
        <Route path="/Signin" element={<SignIn />} />
        <Route path="/Game" element={<GamePage />} />
      </Routes>
    </Router>
  );
}

export default App;
