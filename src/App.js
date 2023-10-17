import logo from './logo.svg';
import './App.css';
import {Route, Routes} from "react-router-dom";
import SignInRegister from "./SignInRegister/SignInRegister";
import Register from "./SignInRegister/Register";
import Chat from "./User/Chat";
function App() {
  return (
    <>
      <Routes>
          <Route path="SignIn" element={SignInRegister}></Route>
          <Route path="SignUp" element={Register}></Route>
          <Route path="Chat" element={Chat}></Route>
      </Routes>
    </>
  );
}

export default App;
