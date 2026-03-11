import {FormChangePass} from "../form/FormChangePass.tsx";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import type {TodoDispatchType} from "../../Store";
import {changePass} from "../../Store/authSlice";

export const ChangePassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<TodoDispatchType>();
  const handleCklick = async (oldPassword: string, newPassword: string) => {
    const res = await dispatch(changePass({oldPassword ,newPassword}))

    if (changePass.fulfilled.match(res)){
      alert('УСПЕШНО')
    } else {
      alert('НЕ УДАЛОСЬ СМЕНИТЬ');
    }
  }

  return (
    <>
      <FormChangePass
        title='Смена пароля'
        ChangeSubmit={handleCklick}
        regButton={() => navigate("/profile")}
        />
    </>
  )
}
