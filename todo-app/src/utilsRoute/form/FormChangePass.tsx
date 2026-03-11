import React, {type ChangeEvent} from "react";
import {useState} from "react";
import styled from "styled-components";
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from "@mui/material/Button";

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


interface ChangeProps {
  title: string;
  ChangeSubmit: ( oldPassword: string, newPassword: string, ) => Promise<void>;
  // logButton?: () => void;
  regButton?: ()  => void;
}

export const FormChangePass = ({title, ChangeSubmit, regButton }: ChangeProps) => {
  const [loading, setLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const checkPassword = (value: string) => {
    return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/.test(value);
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if(loading) return;

    if(newPassword.length < 6) {
      setError('минимум 6 символов')
      return;
    }

    if (!checkPassword( newPassword)) {
      setError('введите хотя бы один спец символ и одну заглавную')
      return;
    }

    try {
      setLoading(true);
      setError('')
      await ChangeSubmit(oldPassword, newPassword)
    }finally {
      setLoading(false);
    }
  }


  const changeOldPassword = (event: ChangeEvent<HTMLInputElement>) => {
    setOldPassword(event.target.value)
  }

  const changeNewPassword = (event: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(event.target.value)
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
                label="Введите старый пароль"
                type={showPassword ? 'text' : 'password'}
                value={oldPassword}
                onChange={changeOldPassword}
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

              <TextField
                label="Придумайте новый пароль"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={changeNewPassword}
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

              <Button type='submit' disabled={loading}  size="large" sx={{ borderRadius: '10px' }} variant="outlined" color="success" disableElevation>
                {loading ? 'загрузка...' : 'сменить пароль'}
              </Button>
              <Button type='button' onClick={regButton}  size="large" sx={{ borderRadius: '10px' }} variant="outlined"  disableElevation>
                вернуться назад
              </Button>
            </Stack>
          </Wrapper>
        </form>
      </BoxStyle>
    </>
  )
}

