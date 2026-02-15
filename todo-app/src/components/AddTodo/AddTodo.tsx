import {useState, } from "react";
import type {Ref}  from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import SunnyIcon from '@mui/icons-material/Sunny';
import NightlightIcon from '@mui/icons-material/Nightlight';
import { addTodoThunk,} from "../../store/todoSlice";
import {useDispatch, useSelector} from "react-redux";
import type {TodoDispatchType} from "../../store";
import type {TodoStateType} from "../../store";

interface AddTodoProps {

  onThemeClick:() => void;
  newTodosInputRef: Ref<HTMLInputElement>;
}

export function AddTodo({ onThemeClick, newTodosInputRef}:AddTodoProps) {

  const [text, setText] = useState('');
  const { error} = useSelector((state: TodoStateType) => state.todosStore);
  const dispatch = useDispatch<TodoDispatchType>();
  const addTodos = (text: string) => {
    dispatch(addTodoThunk(text));
  }

  // useEffect(() => {
  //   dispatch(pageTodos({ page: page || 1, limit: limit}))
  // }, [dispatch, page, limit ]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addTodos(text);
    setText('');
  };

  return (
    <>
      <form  onSubmit={onSubmit}>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ minWidth: 450 }}
        >
          <TextField
            fullWidth
            color='secondary'
            label="Добавь задачу"
            id="fullWidth"
            size="small"
            value={text}
            onChange={
            (event) => setText(event.target.value)}
            required
            inputRef={newTodosInputRef}
            multiline={false}
          />
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              type="submit"
            >
              Добавить
            </Button>
            <Button
              onClick={() =>onThemeClick()}
              variant="contained"
              startIcon={<NightlightIcon/>}
            >
              <SunnyIcon />
            </Button>
          </Stack>
        </Stack>

      </form>
      {error && <p>ОШИБКА🔴: {error}</p>}
    </>
  )
}

