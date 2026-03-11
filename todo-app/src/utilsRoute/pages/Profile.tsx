import styled from "styled-components";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
// import React from "react";
import { Link } from "react-router-dom";

const Title = styled.h1`
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  color: rgba(5, 204, 186, 0.8);
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
function Profile () {

  return (
    <>
      <BoxStyle>
        <Wrapper>
          <Title style={{display: "flex", alignItems: 'center', }}>Ваш профиль</Title>
          <Stack sx={{ display: 'flex', justifyContent: 'center', }} direction="column" spacing={1}>
            <Button component={Link} to="/changePass" type='submit'  size="large" sx={{ borderRadius: '10px' }} variant="outlined">
              Сменить пароль
            </Button>
            <Button component={Link} to="/login" type='button'   size="large" sx={{ borderRadius: '10px' }} variant="outlined" disableElevation>
              Выйти из аккаунта
            </Button>
            <Button component={Link} to="/" type='button'   size="large" sx={{ borderRadius: '10px' }} variant="outlined" disableElevation>
              на главную
            </Button>
          </Stack>
        </Wrapper>
      </BoxStyle>
    </>
  )
}

export default Profile
