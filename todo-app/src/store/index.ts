import {configureStore} from "@reduxjs/toolkit";
import {todoReducer} from "./todoSlice";

export const store = configureStore({
  reducer: {
    todosStore: todoReducer,
  }
});

export type TodoStateType = ReturnType<typeof store.getState>

export type TodoDispatchType = typeof store.dispatch;