import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";
import type {Todo} from "../components/types/todo.tsx";
import type {filterType, sortType} from "../components/types/todo.tsx";
import type { TodoStateType} from "./index.ts";

interface TodoSliceType {
  todos: Todo[],
  filter: filterType,
  sort: sortType,
  status:'loading' | 'success' | 'err' | null,
  error: string |null,
  page: number;
  limit: number;
  totalPages: number;
  total: number;
}

const initialState: TodoSliceType = {
  todos: [],
  filter: "all",
  sort: "new",
  status: null,
  error: null,
  page: 1,
  totalPages: 0,
  limit: 5,
  total: 0,
};



const apiUrl = 'https://todolist-backend-w7ch.onrender.com';

export const pageTodos = createAsyncThunk<
  { todos: Todo[], totalPages: number, total: number, limit: number, page: number },
  { page: number, limit: number, filter?: filterType, sort?: sortType },
  { rejectValue: string, state: TodoStateType }
>(
  'todos/page',
  async ({ page, limit, filter, sort }, thunkAPI) => {
       const state = thunkAPI.getState();
    const actualFilter = filter ?? state.todosStore.filter;
    const actualSort = sort ?? state.todosStore.sort;

    const response = await fetch(
      `${apiUrl}/todos?page=${page}&limit=${limit}&filter=${actualFilter}&sort=${actualSort}`
    );

    if (!response.ok) {
      return thunkAPI.rejectWithValue('server error');
    }

    const data: { data: Todo[], total: number, page: number, limit: number, totalPages: number } = await response.json();

    const sortData = data.data.slice();
    if (actualSort === 'new') {
      sortData.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      })
    } else {
      sortData.sort((a, b) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      })
    }
    console.log('STATE', state.todosStore.sort, state.todosStore.filter);
    console.log('ACTUAL', actualSort, actualFilter);

    return {
      todos: sortData,
      total: data.total,
      totalPages: data.totalPages,
      limit: data.limit,
      page: data.page,
    };
  }
);

export const deleteTodoThunk = createAsyncThunk<number, number, {rejectValue: string} >(
  'todos/delete',
  async function (id, { rejectWithValue }) {

    console.log( id);
    console.log(`${apiUrl}/todos/${id}`);
    const response = await fetch(`${apiUrl}/todos/${id}`,{
      method: 'DELETE'
    })

    if (!response.ok) {
      return rejectWithValue('serverr');
    }
    return id;
  }
);

export const addTodoThunk = createAsyncThunk<Todo, string, {rejectValue: string}>(
  'todos/add',
  async function (text,{ rejectWithValue } ) {

    const todo = {
      id: Date.now(),
      text: text,
      completed: false,
      createdAt: Date.now(),
    }

    const response = await fetch(`${apiUrl}/todos`, {
      method: 'POST',
      headers: {'Content-type': 'application/json'},
      body: JSON.stringify(todo),
    })

    if (!response.ok) {
      return rejectWithValue('serverr');
    }

    const data = await response.json();

    return data;
  }
);

export const checkboxStatusThunk = createAsyncThunk<Todo,  number , {rejectValue: string} >(
 'todos/checkboxStatus',
  async function (id, {  rejectWithValue }) {

    const response = await fetch(`${apiUrl}/todos/${id}/toggle`, {
      method: 'PATCH',
    })

    if (!response.ok) {
      return rejectWithValue('serverr');
    }

    const data = await response.json();

    return data;
  }
);

export const newEditingThunk = createAsyncThunk<Todo, {id: number, newText: string}, {rejectValue: string}>(
  'todos/newEditing',
  async function ({id, newText}, {rejectWithValue}) {
    const response = await fetch(`${apiUrl}/todos/${id}`,{
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({text: newText})
    })

    if (!response.ok) {
      return rejectWithValue('serverr');
    }

    const data = await response.json();

    return data;
  }
)

const statusLoading = (state: TodoSliceType) => {
  state.status = 'loading';
  state.error = null;
}

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {

    filterTodos(state, action: PayloadAction<filterType>) {
      state.filter = action.payload;
      state.page = 1;
    },
    sortTodos(state, action: PayloadAction<sortType>) {
      state.sort = action.payload;
      state.page = 1;
    },
  },
  extraReducers: (build) => {

    // build.addCase(fetchTodos.pending, (state) => {
    //   state.status = 'loading';
    //   state.error = null;
    // })
    //
    // build.addCase(fetchTodos.fulfilled, (state, action) => {
    //
    //   state.status = 'success';
    //   state.todos = action.payload;
    //
    // })
    //
    // build.addCase(fetchTodos.rejected, (state, action) => {
    //   state.status = 'err';
    //   state.error = action.payload ?? 'сервер споткнулся и не принес задачи';
    // })

    build.addCase(deleteTodoThunk.pending, statusLoading)

    build.addCase(deleteTodoThunk.fulfilled, (state, action) =>{
      state.status =  'success';
      state.todos = state.todos.filter((item) => item.id !== action.payload)
    })

    build.addCase(deleteTodoThunk.rejected, (state, action) =>{
      state.status = 'err';
      state.error = action.payload ?? 'сервер не может ее сейчас удалить';
    })

    build.addCase(addTodoThunk.pending, statusLoading)

    build.addCase(addTodoThunk.fulfilled, (state, action) =>{
      state.status =   'success';
      state.todos.push(action.payload);
    })

    build.addCase(checkboxStatusThunk.pending, statusLoading)

    build.addCase(checkboxStatusThunk.fulfilled, (state, action) =>{
      state.status =   'success';
       state.todos = state.todos.map((todo) => {
         if (todo.id === action.payload.id) {
           return  action.payload
         } else {
           return todo
         }
       });
    })

    build.addCase(newEditingThunk.pending, statusLoading)

    build.addCase(newEditingThunk.fulfilled, (state, action) =>{
      console.log('fulfilled', action.payload);
      state.status = 'success';
      state.todos = state.todos.map(todo => {
        if (todo.id === action.payload.id) {
          return  action.payload
        } else {
          return todo
        }
      })
    })

    build.addCase(newEditingThunk.rejected, (state, action) =>{
      console.log( action);
      state.status = 'err';
      state.error = action.payload ?? 'не удалось отправить изменения на сервер';
    })

    build.addCase(pageTodos.pending, (state: TodoSliceType) => {
      state.status = 'loading';
      state.error = null;
    })

    build.addCase(pageTodos.fulfilled, (state, action) => {
      state.status = 'success';
      state.todos = action.payload.todos;
      state.total = action.payload.total
      state.totalPages = action.payload.totalPages;
      state.page = action.payload.page;
      // console.log( action.meta.arg.page);
      // state.limit = action.meta.arg.limit;
    });

    build.addCase(pageTodos.rejected, (state, action) =>{
      state.status = 'err'
      state.error = action.payload ?? 'загрузки задач';
    })
  },
})

export const todoReducer = todoSlice.reducer;
export const { filterTodos, sortTodos} =  todoSlice.actions;

