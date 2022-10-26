import React, { useState, useEffect } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import DBDisplay from "./pages/DBDisplay";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import  "./styles/index.css"
import Shared from "./pages/Shared";
// import { Dashboard } from "tabler-icons-react";
import ProtectedRoute from "./pages/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import useCredentialsStore from "./store/credentialsStore";

export default function App() {
  //STATE DECLARATION (dbSpy3.0)
    const user = useCredentialsStore(state => state.user);
    const setUser = useCredentialsStore(state => state.setUser);
  //END: STATE DECLARATION

  /*
  States Declaration:
  "user" - object that describes the user data coming back from OAuth2.0;
  */
  // const [user, setUser] = useState({
  //   name: null,
  //   email: null,
  //   id: null,
  //   picture: null,
  // });

  /*
  UseEffect to fetch user data from "/protected" route;
  "fetchData" - a function that fetches user data from "/protected" route;
  setUser with data come back from fetch request;
  */
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const data = await fetch("/protected");
  //     const result = await data.json();
  //     if (result !== null) {
  //       setUser({
  //         name: result.given_name,
  //         email: result.email,
  //         id: result.id,
  //         picture: result.picture,
  //       });
  //     } else {
  //       setUser({ name: null, email: null, id: null, picture: null });
  //     }
  //   };

  //   /* invocation of "fetchData" with error handling with catch */
  //   fetchData().catch((err) => {
  //     console.error;
  //     setUser({ name: null, email: null, id: null, picture: null });
  //   });
  // }, []);

  /*
    React Router, a library for Client-Side Rendering, with 4 different paths:
    1. "/" - main launch page
    2. "/signup" - sign up page
    3. "/login" - login page
    4. "/display" | "/display/" - database visualization application page; only accessible when user is authorized;
  */


  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Shared/>}>
          {/* index renders root directory */}
          <Route index element={<Home />}/>
          <Route path='login' element={<Login/>}/>
          <Route path='signup' element={<Signup/>}/>
          <Route path='display' element={
            <ProtectedRoute user={user}>
              <DBDisplay/>
            </ProtectedRoute>
          }/>
        </Route>
      </Routes>
    </BrowserRouter>

  );
}
