import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./views/MainPage";
import SignUp from "./views/SignUpPage";
import SignIn from "./views/SignInPage";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/main" element={<Main />} />
        <Route path="/Signup" element={<SignUp />} />
        <Route path="/Signin" element={<SignIn />}/>
     </Routes>
    </Router>
  );
}

export default App;
