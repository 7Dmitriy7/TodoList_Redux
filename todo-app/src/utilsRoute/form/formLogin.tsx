import React, {type ChangeEvent} from "react";
import {useState} from "react";
import styled from "styled-components";
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
// import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from "@mui/material/Button";
// import { useNavigate } from "react-routerPrivate-dom";

const Title = styled.h1`
margin: 0;
padding: 0;
box-sizing: border-box;
color: #535bf2;
`
const BoxStyle = styled.div`
  display: flex;
  min-height: 100dvh;
  width: 100vw;
  align-items: center;
  justify-content: center;
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  max-width: 600px;
  min-width: 400px;
  min-height: 20vw;
  padding: 30px;
  border-radius: 8px;
  max-height: 90dvh;
`


interface LoginProps {
  title: string;
  authSubmit: (email: string, password: string) => Promise<void>;
  // logButton?: () => void;
  regButton?: ()  => void;
}

function FormLogin ({title, authSubmit, regButton }: LoginProps) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const checkEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }
  const checkPassword = (value: string) => {
    return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/.test(value);
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if(loading) return;

    if (!checkEmail(email)) {
      setError('неверный формат email')
      return;
    }
    if(password.length < 6) {
      setError('минимум 6 символов')
      return;
    }

    if (!checkPassword(password)) {
      setError('введите хотя бы один спец символ и одну заглавную')
    }

    try {
      setLoading(true);
      setError('')
      await authSubmit(email, password)
    }finally {
      setLoading(false);
    }
  }

  const changeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value) ;
  }

  const changePassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value) ;
  }

  return (
    <>
      <BoxStyle>
        <form
          onSubmit={handleSubmit}>
          <Wrapper>

            <Stack sx={{ display: "flex", gap: "20px", margin: "0", padding: "0" }}>

              <Title>{title}</Title>
              <TextField
                label="Email"
                variant="outlined"
                value={email}
                onChange={changeEmail}

              />

              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={changePassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onMouseDown={handleMouseDownPassword} onClick={handleClickShowPassword}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>

            {error && <p style={{ margin: '0', padding: '5px', border: '1px solid red',color: 'red', borderRadius: '10px' }}>{error}</p>}

            <Stack sx={{ display: 'flex', justifyContent: 'center', }} direction="column" spacing={1}>

              <Button type='submit' disabled={loading} size="large" sx={{ borderRadius: '10px' }} variant="outlined">
                {loading ? 'загрузка...' : 'Войти'}
              </Button>

              <Button type='button' onClick={regButton}  size="large" sx={{ borderRadius: '10px' }} variant="outlined" color="success" disableElevation>
                СОЗДАТЬ АККАУНТ
              </Button>
            </Stack>
          </Wrapper>
        </form>
      </BoxStyle>
    </>
  )
}

export default FormLogin