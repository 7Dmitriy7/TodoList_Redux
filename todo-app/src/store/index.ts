import {configureStore} from "@reduxjs/toolkit";
import {todoReducer} from "./todoSlice";
import {authReducer} from "./authSlice.ts";

export const store = configureStore({
  reducer: {
    todosStore: todoReducer,
    authStore: authReducer,
  }
});



export type TodoStateType = ReturnType<typeof store.getState>
export type TodoDispatchType = typeof store.dispatch;

