import React, { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import axios from 'axios'
import type { TodoResponse, UserTodo } from './types'
import './App.css'

function App() {
  const [todo, setTodo] = useState<TodoResponse | null>(null)
  const [userTodo, setUserTodo] = useState<UserTodo[] | null>([])
  const [input, setInput] = useState<string>('')
  const [isEditting, setIsEditting] = useState<string>('')
  const [id, setId] = useState<number | null>(null)
  const fetchTodo = async () => {
    const res = await axios.get('https://dummyjson.com/todos/user/20')
    setTodo(res.data)
    console.log(res.data)
  }
  const addTodo = async () => {
    const userInput = input.trim()
    const res = await axios.post('https://dummyjson.com/todos/add', {
      todo: userInput,
      completed: false,
      userId: 100,
    })
    const data = await res.data
    setUserTodo(prev => [...prev, data])
    setInput('')
    console.log(res.data)
  }
  function enterKey(event: any) {
    if (input === '') return;
    if (event.key === 'Enter') {
      addTodo()
    }
  }

  useEffect(() => {
    fetchTodo()
  }, [])

  const editButton = (t: any) => {
    setIsEditting(t.todo)
    setId(t.id)
  }
  const cancelButton = () => {
    setIsEditting('')
    setId(null)
  }
  const saveButton = (id : number) => {
    setTodo(prev=>{
      if(!prev) return 
      const newTodo = prev.todos.map(t=> t.id ===id ? {...t,todo : isEditting} : t)

      return {...prev,todos :newTodo}
    })
    setId(null)
    setIsEditting('')
  } 

  const deleteButton = (id : number)=>{
    setTodo((prev:any) => {
      if(!prev) return
      const newTodo = prev.todos.filter(t => t.id !== id )
      return {...prev , todos :newTodo}
    })
  }

  return (

    <main>
      
      <input value={input} onChange={(e) => setInput(e.target.value)
      } onKeyDown={enterKey} type="text" placeholder='Enter Todo' />
      <button onClick={() => addTodo()}>Add</button>


      <div className='Grid'>
        {todo ? todo?.todos.map(t => {
          const isEdit = id === t.id
          return (
            <React.Fragment key={t.id} >
              <div className={t.completed ? 'done' : 'not-done'}> ID : {t.id}</div>
              {isEdit
                ?
                <>
                  <input type='text'  value={isEditting} onChange={(e) => setIsEditting(e.target.value)} />

                </>
                : <div> Todo : {t.todo}</div>
              }
              <button onClick={() => editButton(t)}>Edit</button>
              {isEdit && (
                <>
                  <button onClick={() => cancelButton()}>Cancel</button>
                  <button onClick={() => saveButton(t.id)}>Save</button>
                </>
              )}
              <button onClick={()=> deleteButton(t.id)}>Delete</button>
            </React.Fragment>
          )
        }

        ) : <div>Loading...</div>}



        {userTodo && userTodo.map(t => (
          <React.Fragment key={t.id}>
            <div className={t.completed ? 'done' : 'not-done'}> ID : {t.id}</div>
            <div> Todo : {t.todo}</div>
            <button>Edit</button>
            <button>Delete</button>
          </React.Fragment>
        ))}

      </div>
    </main>
  )
}

export default App
