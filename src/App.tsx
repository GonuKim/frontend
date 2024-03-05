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
import TypingPage from "./views/TypingPage"
import SocialCallback from "./views/CallBack";


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
        <Route path="/social/callback/google" element={<SocialCallback provider="google" />}></Route>
        <Route path="/social/callback/kakao" element={<SocialCallback provider="kakao"/>}></Route>
        <Route path="/social/callback/naver" element={<SocialCallback provider="naver" />}></Route>
        <Route path="/social/callback/github" element={<SocialCallback provider="github" />}></Route>

        <Route path="/Game" element={<GamePage />} />
        <Route path="/Typing" element={<TypingPage />} />

      </Routes>
    </Router>
  );
}

export default App;
