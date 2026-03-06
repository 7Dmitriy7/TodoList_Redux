import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface AuthState {
  accessToken: string | null,
  status:'loading' | 'success' | 'err' | null,
  error: string | null,
}

const initialState: AuthState = {
  accessToken:  null,
  status: null,
  error:  null,
}
const apiUrl = 'https://serverrouter-9nqh.onrender.com'

export const registrationAuth = createAsyncThunk<{accessToken: string,},{email: string, password: string}, {rejectValue: string}>(
  'auth/register',

  async function ({email, password}, {rejectWithValue}) {
    console.log( { email, password });
    const response = await fetch(`${apiUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email, password})
    })

    const data = await response.json().catch(() => ({}));
    console.log( data);
    if (!response.ok) {
      console.log("Ошибка сервера", data);
      return rejectWithValue('serverr');
    }

    localStorage.setItem('refToken', data.refreshToken);
    localStorage.setItem('accToken', data.accessToken);
    return data
  }
)

export const loginAuth = createAsyncThunk<{accessToken: string, refreshToken: string}, {email: string, password: string}, {rejectValue: string}>(
  'auth/login',
  async function ({email, password}, {rejectWithValue}) {
    console.log( { email, password });
    const response = await fetch(`${apiUrl}/auth/login`,{
      method: 'POST',
      headers:  { 'Content-Type': 'application/json' },
      body: JSON.stringify({email, password})
    })

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.log("Ошибка сервера", data);
      return rejectWithValue('serverr');}

    localStorage.setItem('accToken', data.accessToken)
    localStorage.setItem('refToken', data.refreshToken);

    return data
  }
)

const statusLoading = (state: AuthState) => {
  state.status = 'loading';
  state.error = null;
}

const authSlice = createSlice({
  name: 'authorisation',
  initialState,
  reducers: {

  },
  extraReducers: (build) => {
    build.addCase(registrationAuth.pending, statusLoading)

    build.addCase(registrationAuth.fulfilled, (state, action) =>{
      state.status = 'success'
      state.accessToken = action.payload.accessToken
      state.error = null
    })

    build.addCase(registrationAuth.rejected, (state, action) => {
      state.status = 'err'
      state.error = action.payload ?? 'ошибка сервера'
    })

    build.addCase(loginAuth.pending, statusLoading)
    build.addCase(loginAuth.fulfilled, (state, action) =>{
      state.status = 'success'
      state.accessToken = action.payload.accessToken
    })

    build.addCase(loginAuth.rejected, (state, action) =>{
      state.status = 'err'
      state.error = action.payload ?? 'ошибка логина'
    })
  }
})

export const authReducer = authSlice.reducer;
