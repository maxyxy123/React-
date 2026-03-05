import React, { useEffect, useMemo, useState } from 'react';

import axios from 'axios';
import type { TodoResponse, UserTodo, Todo } from './types.ts';
import './App.css';

function App() {
  const [todo, setTodo] = useState<TodoResponse | null>(null);
  const [userTodo, setUserTodo] = useState<UserTodo[]>([]);
  const [input, setInput] = useState<string>('');
  const [isEditting, setIsEditting] = useState<string>('');
  const [id, setId] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const fetchTodo = async () => {
    const res = await axios.get('https://dummyjson.com/todos/user/20');
    setTodo(res.data);
    console.log(res.data);
  };
  const addTodo = async () => {
    const userInput = input.trim();
    const res = await axios.post('https://dummyjson.com/todos/add', {
      todo: userInput,
      completed: false,
      userId: 100,
    });
    const data = await res.data;
    setUserTodo((prev: any) => [...prev, data]);
    setInput('');
    console.log(res.data);
  };
  function enterKey(event: any) {
    if (input === '') return;
    if (event.key === 'Enter') {
      addTodo();
    }
  }

  useEffect(() => {
    fetchTodo();
  }, []);

  const editButton = (t: any) => {
    setIsEditting(t.todo);
    setId(t.id);
  };
  const cancelButton = () => {
    setIsEditting('');
    setId(null);
  };
  const saveButton = (id: number) => {
    setTodo((prev: any) => {
      if (!prev) return;
      const newTodo = prev.todos.map((t: Todo) =>
        t.id === id ? { ...t, todo: isEditting } : t
      );

      return { ...prev, todos: newTodo };
    });
    setId(null);
    setIsEditting('');
  };

  const deleteButton = (id: number) => {
    setTodo((prev: any) => {
      if (!prev) return;
      const newTodo = prev.todos.filter((t: Todo) => t.id !== id);
      return { ...prev, todos: newTodo };
    });
  };

  function checkedFunction(event: any, id: number) {
    if (event.target.value === 'done') {
      setTodo((prev: any) => {
        if (!prev) return;
        const newTodo = prev?.todos.map((p: Todo) =>
          p.id === id ? { ...p, completed: true } : p
        );
        return { ...prev, todos: newTodo };
      });
    } else {
      setTodo((prev: any) => {
        if (!prev) return;
        const newTodo = prev?.todos.map((p: Todo) =>
          p.id === id ? { ...p, completed: false } : p
        );
        return { ...prev, todos: newTodo };
      });
    }
  }
  const todos = todo.todos ?? [];
  const visibleTodo = useMemo(() => {
    let result =
      filter === 'complete'
        ? todos.filter((t: Todo) => t.complete === true)
        : filter === 'not-complete'
        ? todos.filter((t: Todo) => t.complete === false)
        : todos;

    const q = search.trim().toLowerCase();
    if (q) {
      return (result = todos.filter((t: Todo) => t.todo.trim().includes(q)));
    }

    return result;
  }, [filter, todos]);

  return (
    <main>
      <input
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setSearch(e.target.value);
        }}
        onKeyDown={enterKey}
        type="text"
        placeholder="Enter Todo"
      />
      <button onClick={() => addTodo()}>Add</button>
      <button onClick={() => setFilter('complete')}>Done</button>
      <button onClick={() => setFilter('not-complete')}>NotC0mpleted</button>
      <button onClick={() => setFilter('all')}>All</button>
      <div className="Grid">
        {visibleTodo ? (
          visibleTodo.map((t: Todo) => {
            const isEdit = id === t.id;

            return (
              <React.Fragment key={t.id}>
                <div className={t.completed ? 'done' : 'not-done'}>
                  {' '}
                  ID : {t.id}
                </div>
                {isEdit ? (
                  <>
                    <input
                      type="text"
                      value={isEditting}
                      onChange={(e) => setIsEditting(e.target.value)}
                    />
                  </>
                ) : (
                  <div> Todo : {t.todo}</div>
                )}
                <button onClick={() => editButton(t)}>Edit</button>
                {isEdit && (
                  <>
                    <button onClick={() => cancelButton()}>Cancel</button>
                    <button onClick={() => saveButton(t.id)}>Save</button>
                  </>
                )}
                <button onClick={() => deleteButton(t.id)}>Delete</button>
                <div>
                  <input
                    type="radio"
                    name={`status-${t.id}`}
                    onChange={(e) => checkedFunction(e, t.id)}
                    checked={t.completed}
                    value="done"
                  />
                  <input
                    type="radio"
                    name={`status-${t.id}`}
                    onChange={(e) => checkedFunction(e, t.id)}
                    checked={!t.completed}
                    value="not-done"
                  />
                </div>
              </React.Fragment>
            );
          })
        ) : (
          <div>Loading...</div>
        )}

        {userTodo &&
          userTodo.map((t) => (
            <React.Fragment key={t.id}>
              <div className={t.completed ? 'done' : 'not-done'}>
                {' '}
                ID : {t.id}
              </div>
              <div> Todo : {t.todo}</div>
              <button>Edit</button>
              <button>Delete</button>
            </React.Fragment>
          ))}
      </div>
    </main>
  );
}

export default App;
