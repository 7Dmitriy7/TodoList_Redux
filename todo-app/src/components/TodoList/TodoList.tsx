import type {Todo} from "../types/todo.tsx";
import {TodoItem} from "../TodoItem/TodoItem.tsx";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import {TodoPagination} from "../page/PaginationTodo.tsx";
import {useDispatch, useSelector} from "react-redux";
import type {sortType, filterType} from "../types/todo.tsx";
import type { TodoStateType, TodoDispatchType} from "../../store";
import {sortTodos, pageTodos, filterTodos} from "../../store/todoSlice.ts";
import {CircularProgress, Typography} from "@mui/material";
// import {CircularProgress, Typography} from "@mui/material";

interface TodoListProps {
  todos: Array<Todo>;
  onDeleteTodoClick: (id: number) => void;
  onCheckboxStatusChange: (id : number, completed: boolean) => void
  isEditing: number | null;

  setIsEditing:(value: number | null) => void;
  // setFilterTodo: (filter: 'all' | 'active' | 'completed') => void;
  // setSortTodos:(value: 'new' | 'old') => void;
}

export function TodoList({todos, onDeleteTodoClick, onCheckboxStatusChange, isEditing, setIsEditing}: TodoListProps) {

  const {status} = useSelector((state: TodoStateType) => state.todosStore);

  const dispatch = useDispatch<TodoDispatchType>();
  const { limit, filter, sort} = useSelector((state:TodoStateType) => state.todosStore  );

  const newFilterTodo = (newFilter: filterType ) =>{
    dispatch(filterTodos(newFilter))
    dispatch(pageTodos({page: 1, limit, filter: newFilter, sort}));
  }

  const newSortTodos = (newSort: sortType) => {
    dispatch(sortTodos(newSort));
    dispatch(pageTodos({page: 1, limit, filter, sort: newSort, }));

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
          // setSortTodos={setSortTodos}
        />
      ))}
      </Box>
        {status === 'loading' && <Box
          sx={{
            mt: 2,
            p: 2,
            border: '1px #4f3172 solid',
            borderRadius: 2,
            // backgroundColor: '#e3f2fd',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: '#0d47a1',
          }}
        >
          <CircularProgress size={5} color="inherit" />
          <Typography variant="body1" fontWeight={700}>
            Загрузка...
          </Typography>
        </Box>}

      <Box
        sx={{
          mt: "auto",
          display: "flex",
          justifyContent: "center",
          py: 3,
        }}
      >
      <TodoPagination />
      </Box>
      </Box>
    </>
  );
}



