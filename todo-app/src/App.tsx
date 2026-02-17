import {useState, useEffect, useRef} from 'react';
import  {AddTodo} from './components/AddTodo/AddTodo.tsx';
// import type { filterType, sortType} from "./components/types/todo.tsx";
import {TodoList} from './components/TodoList/TodoList.tsx';
import styled from 'styled-components';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {Paper} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import type {TodoStateType, TodoDispatchType} from "./store";
// import { filterTodos, sortTodos} from "./store/todoSlice.ts";
import {  deleteTodoThunk, checkboxStatusThunk, pageTodos } from "./store/todoSlice.ts";

const BoxStyle = styled.div`
  display: flex;
  min-height: 100dvh;
  width: 100vw;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  max-width: 600px;
  min-width: 300px;
  min-height: 40vw;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 3px 8px 50px 20px rgba(92, 13, 105, 0.23);
  border: 1px #4f3172 solid;
  max-height: 90dvh;
  overflow-y: auto;
`;

function App() {

  const todos = useSelector((state:TodoStateType ) => state.todosStore.todos);

  const {  page, limit } = useSelector((state: TodoStateType) => state.todosStore);

  // const setFilterTodos = useSelector((state: TodoStateType) => state.todosStore.filter);

    const [isEditing, setIsEditing] = useState<number | null>(null);

    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const [mode, setMode] = useState(() => {

      const saveMode: string | null = localStorage.getItem('mode');

      if(saveMode !== null){
        return JSON.parse(saveMode)
      }
      if(prefersDarkMode !== undefined){
        return prefersDarkMode;
      }
      return  false;
    });

    useEffect(() => {
      localStorage.setItem('mode', JSON.stringify(mode));
   }, [mode]);

    useEffect(() => {
      newTodosInputRef.current?.focus();
    }, []);

    const toggleTheme= () => {
      setMode((prev:boolean) => !prev);
    };

    const appTheme = createTheme({
      palette: {
        mode: mode ? 'dark' : 'light',
      },
    });

     const newTodosInputRef = useRef<HTMLInputElement>(null);

     const dispatch = useDispatch<TodoDispatchType>();

  useEffect(() => {
    dispatch(pageTodos({ page, limit, }));
  }, [dispatch, page, limit, ]);

     const deleteDispatch = (id: number) => {
       dispatch(deleteTodoThunk(id));
     }

     const checkboxDispatch = (id: number) => {
       dispatch(checkboxStatusThunk(id ))
     }

   return (
     <>
       <ThemeProvider theme={appTheme}>
          <Paper elevation={0} square>
            <BoxStyle>
              <Wrapper>
                  < AddTodo
                    onThemeClick={toggleTheme}
                    newTodosInputRef={newTodosInputRef}
                  />
                  <TodoList
                     todos={todos}
                     onDeleteTodoClick={deleteDispatch}
                     onCheckboxStatusChange={checkboxDispatch}
                     isEditing={isEditing}

                     setIsEditing={setIsEditing}
                     // setFilterTodo={setFilterDispatch}
                     // setSortTodos={setSortDispatch}
                  />
              </Wrapper>
            </BoxStyle>
          </Paper>
       </ThemeProvider>
    </>
   )
}

export default App



