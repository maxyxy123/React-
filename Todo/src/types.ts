export type  Todo = {
    id: number
    todo: string
    completed: boolean
    userId: number
}
export type UserTodo = Todo
  


export type TodoResponse = {
    todos : Todo[],
    total :number
}