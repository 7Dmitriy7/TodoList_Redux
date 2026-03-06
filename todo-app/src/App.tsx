import HomePage from "./utilsRoute/pages/Home.tsx";
import {Routes, Route} from "react-router-dom";
import Login from "./utilsRoute/pages/Login.tsx";
import PrivateRoute from "./utilsRoute/routerPrivate/PrivateRoute.tsx";
import Profile from "./utilsRoute/pages/Profile.tsx";
import Register from "./utilsRoute/pages/Register.tsx";
import NotFound from "./utilsRoute/pages/NotFound.tsx";

function App() {
  return (
    <>
      <Routes>
        <Route element={<PrivateRoute/>}>
        <Route path='/' element={ <HomePage />} />
        <Route path='/profile' element={<Profile/>} />
        </Route>

        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='*' element={<NotFound/>}/>
      </Routes>
    </>
  )
}

export default App



