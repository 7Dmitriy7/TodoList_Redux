import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";
import type {Todo} from "../components/types/todo.tsx";
import type {filterType, sortType} from "../components/types/todo.tsx";

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

// export const fetchTodos = createAsyncThunk< Todo[], undefined, {rejectValue: string}>(
//   'todos/fetch',
//   async function (_, { rejectWithValue}) {
//
//       const response = await fetch('http://localhost:3001/todos?page=1&limit=10');
//
//       if (!response.ok) {
//         return rejectWithValue('serverr');
//       }
//       const data = await response.json();
//
//     return data.data
//   }
// );

const apiUrl = 'https://todolist-backend-w7ch.onrender.com';

export const pageTodos = createAsyncThunk<{ todos: Todo[], totalPages: number, total: number, limit: number, page: number }, {page: number, limit: number, filter?: filterType, sort?: sortType}, {rejectValue: string}>(
  'todos/page',
  async function ({page, limit, filter = 'all', sort = 'new'}, { rejectWithValue}) {

    const response = await fetch(`${apiUrl}/todos?page=${page}&limit=${limit}`);
    if (!response.ok) {
      return rejectWithValue('serverr');
    }
    const data: { data: Todo[], total: number, page: number, limit: number, totalPages: number } = await response.json();

    let todosFilter: Todo[] = data.data

    if (filter === 'active') {
      todosFilter = todosFilter.filter((todo)=> todo.completed === false);
    }  else if (filter === 'completed') {
      todosFilter = todosFilter.filter((todo)=> todo.completed === true);
    }

    if (sort === 'new') {
      todosFilter = todosFilter.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sort === 'old') {
      todosFilter = todosFilter.sort((a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    return {
      todos: todosFilter,
      total: data.total,
      totalPages: data.totalPages,
      limit:limit,
      page: page,
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
      state.page = action.meta.arg.page;
      console.log( action.meta.arg.page);
      state.limit = action.meta.arg.limit;
    });

    build.addCase(pageTodos.rejected, (state, action) =>{
      state.status = 'err'
      state.error = action.payload ?? 'загрузки задач';
    })
  },
})

export const todoReducer = todoSlice.reducer;
export const { filterTodos, sortTodos} =  todoSlice.actions;

