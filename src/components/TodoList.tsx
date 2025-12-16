import { TodoItem } from './TodoItem'

interface Todo {
    id: string
    title: string
    completed: boolean
}

interface TodoListProps {
    todos: Todo[]
}

export function TodoList({ todos }: TodoListProps) {
    if (todos.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 
                        flex items-center justify-center">
                    <svg className="w-12 h-12 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Brak zadań</h3>
                <p className="text-gray-400">Dodaj swoje pierwsze zadanie powyżej!</p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {todos.map((todo) => (
                <TodoItem
                    key={todo.id}
                    id={todo.id}
                    title={todo.title}
                    completed={todo.completed}
                />
            ))}
        </div>
    )
}
