import FormRegistration from "../form/formRegistration.tsx";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {registrationAuth} from "../../store/authSlice";
import type {TodoDispatchType} from "../../store";

function Register () {
  const dispatch = useDispatch<TodoDispatchType>();
  const navigate = useNavigate();
  const handleRegistration = async (email: string, password: string) => {
    const res = await dispatch(registrationAuth({email, password}));
    if(registrationAuth.fulfilled.match(res)) {
      navigate("/login");
    }
  }
  return (
    <>
      <FormRegistration
        title='РЕГИСТРАЦИЯ'
        regSubmit={handleRegistration}
        />
    </>
  )
}

export default Register
