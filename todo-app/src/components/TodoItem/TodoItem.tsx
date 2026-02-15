import type {Todo} from "../types/todo.tsx";
import styled from 'styled-components';
import Checkbox from '@mui/material/Checkbox';
import CreateIcon from '@mui/icons-material/Create';
import {IconButton} from "@mui/material";
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import {EditTodo} from "../EditTodo/EditTodo.tsx";
const label = { slotProps: { input: { 'aria-label': 'Checkbox demo' } } };

const ItemContainer = styled.div`
  display: flex;
  padding: 1px;
  margin-top: 10px;
  align-items: center;
  gap: 8px;
  justify-content: space-between;
  border: 1px solid rgba(119, 119, 106, 0.4);
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
`;

const TodoText = styled.span<{ $completed: boolean }>`
  flex: 1;
  transform: translateY(-3px);
  font-size: 20px;      
  line-height: 1.3;     
  position: relative;
  transition: color 0.2s ease;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 50%;
    width: ${props => props.$completed ? '100%' : '0%'};
    height: 2px;
    background: #6a0dad;
    transform: translateY(3px);
    transition: width 0.3s ease;
  }

  ${props => props.$completed && `
    color: #888;
  `}
`

interface TodoItemProps {
  todo: Todo
  onDeleteTodoClick: (id: number) => void
  onCheckboxStatusChange: (id : number, completed: boolean) => void
  isEditing: number | null;

  setIsEditing:(value: number | null) => void;
}

export function TodoItem({onDeleteTodoClick, todo,  onCheckboxStatusChange, isEditing, setIsEditing }: TodoItemProps) {

  return (
    <ItemContainer>
      {isEditing === todo.id ? (
        <EditTodo
          todo={todo}
          setIsEditing={setIsEditing}
        />
      ) : (
        <>
          <Checkbox
            {...label}
            checked={todo.completed}
            sx={{
              color: '#6a0dad',
              '&.Mui-checked': {
                color: '#af4ef6'
              },
            }}
            onChange={(event) =>
              onCheckboxStatusChange(todo.id, event.target.checked)}
          />
          <TodoText
            $completed={todo.completed}
          >
            {todo.text}
          </TodoText>
          <IconButton
            size="small"
            onClick={() => setIsEditing(todo.id)}
          >
            <CreateIcon sx={{color: '#425fd7', fontSize: 20}} />
          </IconButton>
          <IconButton
            onClick={() => onDeleteTodoClick(todo.id)}
            size='small'
          >
            <RestoreFromTrashIcon sx={{color: 'green', fontSize: 20}} />
          </IconButton>
        </>
      )}
    </ItemContainer>
  );
}
