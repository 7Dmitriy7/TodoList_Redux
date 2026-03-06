import { useNavigate } from "react-router-dom";
import FormLogin from "../form/formLogin.tsx";
import {useDispatch} from "react-redux";
import type {TodoDispatchType} from "../../store";
import {loginAuth} from "../../store/authSlice.ts";

function Login () {
  const navigate = useNavigate();
  const dispatch = useDispatch<TodoDispatchType>();
  const handleLogin = async (email: string, password: string) => {
    const result = await dispatch(loginAuth({email, password}))

    if (loginAuth.fulfilled.match(result)){
      navigate("/");
    } else if (loginAuth.rejected.match(result)) {
      console.log("Ошибка логина:", result.payload);
    }
  }

  return (
    <>
      <FormLogin
        title="ВОЙТИ в ToDoLiSt"
        authSubmit={handleLogin}
        regButton={() => navigate("/register")}

      />
    </>
  )
}

export default Login

