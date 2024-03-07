import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Main from "./views/MainPage";
import SignUp from "./views/SignUpPage";
import SignIn from "./views/SignInPage";
import GamePage from "./views/GamePage";
import SocialCallback from "./views/CallBack";
import Navbar from "./components/Navbar";
import CreateWordPage from "./views/CreateWordPage";
import TypingPage from "./views/TypingPage"
function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate replace to="/main" />} />
          <Route path="/main" element={<Main />} />
          <Route path="/Signup" element={<SignUp />} />
          <Route path="/Signin" element={<SignIn />} />
          <Route
            path="/social/callback/google"
            element={<SocialCallback provider="google" />}
          ></Route>
          <Route
            path="/social/callback/kakao"
            element={<SocialCallback provider="kakao" />}
          ></Route>
          <Route
            path="/social/callback/naver"
            element={<SocialCallback provider="naver" />}
          ></Route>
          <Route
            path="/social/callback/github"
            element={<SocialCallback provider="github" />}
          ></Route>
          <Route path="/Typing" element={<TypingPage />} />

          <Route path="/Game" element={<GamePage />} />
          <Route path="/CreateWord" element={<CreateWordPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
