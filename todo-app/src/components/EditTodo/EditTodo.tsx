import type {Todo} from "../types/todo.tsx";
import TextField from "@mui/material/TextField";
import {useState} from "react";
import CloseIcon from '@mui/icons-material/Close';
import {Box} from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';
import Checkbox from "@mui/material/Checkbox";
import {useDispatch} from "react-redux";
import type {TodoDispatchType} from "../../store";
import {newEditingThunk} from "../../store/todoSlice.ts";

interface EditTodoProps {
  todo: Todo;
  setIsEditing:(value: number | null) => void;
}

export function EditTodo({todo, setIsEditing}: EditTodoProps) {

  const dispatch = useDispatch<TodoDispatchType>();

  const [text, setText] = useState(todo.text);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(newEditingThunk({id: todo.id, newText: text}));
    setIsEditing(null)
  };

  const oneClick = () => {
    dispatch(newEditingThunk({ id: todo.id, newText: text }));
    setIsEditing(null);
  };

  const onExitButton = () => {
    setIsEditing(null)
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: '100%',
        gap: '15px',
      }}
    >

      <Checkbox
        checked={todo.completed}
        sx={{
          color: '#6a0dad',
          '&.Mui-checked': {
            color: '#af4ef6'
          }
        }}
      />

      <form
        onSubmit={onSubmit}
        style={{width: '70%'}}
      >
        <TextField
          sx={{
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            '& .MuiInputBase-input': {
              fontSize: '19px',

            },
            transform: 'translateX(-22px)'
          }}
          fullWidth
          variant="outlined"
          color='secondary'
          id="fullWidth"
          size="small"
          value={text}
          onChange={
            (event) => setText(event.target.value)}
          required
          multiline={false}
        />
      </form>
      <DoneIcon
        sx={{
          color: 'rgba(0,255,255,0.8)'
        }}
        onClick={oneClick}
      />
      <CloseIcon
        sx={{color: 'red', transform: 'translateX(-4px)'}}
        onClick={() => onExitButton()}
      />
    </Box>
  );
}


