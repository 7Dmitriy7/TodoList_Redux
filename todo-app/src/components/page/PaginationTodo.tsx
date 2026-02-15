import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import type {TodoStateType, TodoDispatchType} from "../../store";
import {useSelector, useDispatch} from "react-redux";
import {pageTodos} from "../../store/todoSlice.ts";

export function TodoPagination() {

  const { page,  limit, totalPages, filter, sort } = useSelector((state: TodoStateType ) => state.todosStore);

  // console.log(page);
  // console.log( total);
  // console.log( limit);

  const dispatch = useDispatch<TodoDispatchType>();

  const onChanges = (_event: React.ChangeEvent<unknown>, value: number) => {

    dispatch(pageTodos({ page: value, limit, filter, sort }))
  }

  return (
    <>
      <Stack spacing={2}>
        <Pagination  size="large"
          count={totalPages}
          page={page || 1}
          onChange={onChanges}
          variant="outlined"
          shape="rounded"
          showFirstButton
          showLastButton
        />
      </Stack>
    </>
  )
}