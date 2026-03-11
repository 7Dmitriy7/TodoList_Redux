import {useState, } from "react";
import type {Ref}  from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import SunnyIcon from '@mui/icons-material/Sunny';
import NightlightIcon from '@mui/icons-material/Nightlight';
import { addTodoThunk,} from "../../Store/todoSlice";
import {useDispatch, useSelector} from "react-redux";
import type {TodoDispatchType} from "../../Store";
import type {TodoStateType} from "../../Store";
import {pageTodos} from "../../Store/todoSlice";

interface AddTodoProps {

  onThemeClick:() => void;
  newTodosInputRef: Ref<HTMLInputElement>;
}

export function AddTodo({ onThemeClick, newTodosInputRef}:AddTodoProps) {

  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const { error, limit,     page  } = useSelector((state: TodoStateType) => state.todosStore);
  const dispatch = useDispatch<TodoDispatchType>();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!text.trim() || loading) return;
    setLoading(true);
    await dispatch(addTodoThunk(text))
    dispatch(pageTodos({ page, limit, }))
    setText('');
    setLoading(false);
  };

  return (
    <>
      <form  onSubmit={onSubmit}>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ width: "100%" }}
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
          <Stack direction="row" spacing={1} sx={{ width: "50%" }}>
            <Button
              variant="contained"
              type="submit"
              fullWidth
            >
              {loading ? 'загрузка...' : 'Добавить'}
            </Button>
            <Button
              onClick={() =>onThemeClick()}
              variant="contained"
              fullWidth
              sx={{ width: "40%" }}
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

