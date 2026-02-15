import {useEffect} from "react";
import type {Todo} from "../components/types/todo.tsx";

interface saveTodoAndMode {
  todos: Todo[],
  mode: boolean
}

export function localStorageEffect({todos, mode}: saveTodoAndMode) {
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
    localStorage.setItem('mode', JSON.stringify(mode))
  }, [todos, mode]);
}

