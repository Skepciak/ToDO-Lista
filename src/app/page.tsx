import { Suspense } from 'react'
import { getTodos, type FilterType } from '@/app/actions/todo'
import { AddTodoForm } from '@/components/AddTodoForm'
import { TodoList } from '@/components/TodoList'
import { FilterTabs } from '@/components/FilterTabs'

interface PageProps {
  searchParams: Promise<{ filter?: FilterType }>
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams
  const filter = params.filter || 'all'
  const todos = await getTodos(filter)

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 
                          rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 
                          shadow-xl shadow-indigo-500/30">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 
                         bg-clip-text text-transparent mb-2">
            ToDo Lista
          </h1>
          <p className="text-gray-500">Zarządzaj swoimi zadaniami z łatwością</p>
        </header>

        {/* Main Card */}
        <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl shadow-indigo-500/10 
                        border border-white/20 p-6 sm:p-8">
          {/* Add Todo Form */}
          <section className="mb-8">
            <AddTodoForm />
          </section>

          {/* Filter Tabs */}
          <section className="mb-6">
            <Suspense fallback={null}>
              <FilterTabs />
            </Suspense>
          </section>

          {/* Todo Count */}
          <div className="flex justify-between items-center mb-4 px-2">
            <span className="text-sm text-gray-500">
              {todos.length} {todos.length === 1 ? 'zadanie' : todos.length < 5 ? 'zadania' : 'zadań'}
            </span>
            {filter !== 'all' && (
              <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-600">
                {filter === 'active' ? 'Aktywne' : 'Zakończone'}
              </span>
            )}
          </div>

          {/* Todo List */}
          <section>
            <TodoList todos={todos} />
          </section>
        </div>

        {/* Footer */}
        <footer className="text-center mt-8 text-sm text-gray-400">
          <p>Zbudowane z ❤️ przy użyciu Next.js i Prisma</p>
        </footer>
      </div>
    </main>
  )
}
