import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'

interface Todo {
  id: number
  name: string
}

export default function SupabaseExample() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function getTodos() {
      try {
        setLoading(true)
        const { data: todos, error } = await supabase
          .from('todos')
          .select('*')

        if (error) throw error
        if (todos) setTodos(todos)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    getTodos()
  }, [])

  if (loading) return <div>Cargando...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h2>Todos desde Supabase</h2>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.name}</li>
        ))}
      </ul>
    </div>
  )
}

