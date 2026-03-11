import type {Todo} from "../types/todo.tsx";
import {TodoItem} from "../TodoItem/TodoItem.tsx";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import {TodoPagination} from "../Pagination/PaginationTodo.tsx";
import {useDispatch, useSelector} from "react-redux";
import type {sortType, filterType} from "../types/todo.tsx";
import type { TodoStateType, TodoDispatchType} from "../../Store";
import {sortTodos, pageTodos, filterTodos} from "../../Store/todoSlice";
import {CircularProgress, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";

interface TodoListProps {
  todos: Array<Todo>;
  onDeleteTodoClick: (id: number) => void;
  onCheckboxStatusChange: (id : number, completed: boolean) => void
  isEditing: number | null;

  setIsEditing:(value: number | null) => void;
}

export function TodoList({todos, onDeleteTodoClick, onCheckboxStatusChange, isEditing, setIsEditing}: TodoListProps) {

  const navigate = useNavigate();
  const {status} = useSelector((state: TodoStateType) => state.todosStore);

  const dispatch = useDispatch<TodoDispatchType>();
  const { limit, filter, sort, page} = useSelector((state:TodoStateType) => state.todosStore  );

  const newFilterTodo = (newFilter: filterType ) =>{
    dispatch(filterTodos(newFilter))
    dispatch(pageTodos({page: 1, limit, filter: newFilter, sort}));
  }

  const newSortTodos = (newSort: sortType) => {
    dispatch(sortTodos(newSort));
    dispatch(pageTodos({page, limit, filter, sort: newSort, }));
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "80vh",
          width: "100%",
        }}
      >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          width: '100%',
          '& > *': {
            mt: 1,
          },
        }}
      >
        <ButtonGroup
          size="small"
          aria-label="Small button group"
          fullWidth
        >
          <Button
            sx={{display: 'flex', flex: 1}}
            onClick={() => {newFilterTodo('all')}}
          >
            Все
          </Button>
          <Button
            sx={{display: 'flex', flex: 1}}
            onClick={() => {newFilterTodo('active')  } }

          >
            Активные
          </Button>
          <Button
            sx={{display: 'flex', flex: 1}}
            onClick={() => {newFilterTodo('completed')}}
          >
            Выполненные
          </Button>
        </ButtonGroup>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          width: '100%',

          '& > *': {
            mt: 1,
          },
        }}
      >
        <ButtonGroup
          size="small"
          aria-label="Small button group"
          fullWidth
        >
          <Button
            sx={{display: 'flex', flex: 1}}
            onClick={() => newSortTodos('new')}

          >
            Новые
          </Button>
          <Button
            sx={{display: 'flex', flex: 1}}
            onClick={() =>newSortTodos('old')}
          >
            Старые
          </Button>
        </ButtonGroup>
      </Box>

        <Box sx={{ mt: 2 }}>
          {todos?.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDeleteTodoClick={() => onDeleteTodoClick(todo.id)}
              onCheckboxStatusChange={onCheckboxStatusChange}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
          ))}
        </Box>

        <Box
          sx={{
            mt: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 3,
            gap: 1
          }}
        >
        {status === 'loading' && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
              py: 2
            }}
          >
            <CircularProgress size={20} />
            <Typography>Загрузка...</Typography>
          </Box>
        )}
          <TodoPagination />
        </Box>

        <Button
          onClick={() => {
            // localStorage.removeItem('accToken');
            // localStorage.removeItem('refToken');
            navigate('/profile')
          }}
        >
           ПРОФИЛЬ
        </Button>
      </Box>
    </>
  );
}



