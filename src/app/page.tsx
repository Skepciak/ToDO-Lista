import { Suspense } from 'react'
import Link from 'next/link'
import { getTodos, getCategories, type FilterType } from '@/app/actions/todo'
import { AddTodoForm } from '@/components/AddTodoForm'
import { SortableTodoList } from '@/components/SortableTodoList'
import { FilterTabs } from '@/components/FilterTabs'
import { SearchInput } from '@/components/SearchInput'
import { ThemeToggle } from '@/components/ThemeToggle'
import { ExportButtons } from '@/components/ExportButtons'
import { NotificationPermission } from '@/components/NotificationPermission'
import { CalendarExport } from '@/components/CalendarExport'
import { AuthButtons } from '@/components/AuthButtons'
import { GoogleCalendarSync } from '@/components/GoogleCalendarSync'

interface PageProps {
  searchParams: Promise<{ filter?: FilterType; q?: string }>
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams
  const filter = params.filter || 'all'
  const searchQuery = params.q || ''

  const [todos, categories] = await Promise.all([
    getTodos(filter, undefined, searchQuery || undefined),
    getCategories()
  ])

  const todoCount = todos.length
  const completedCount = todos.filter((t: { completed: boolean }) => t.completed).length

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 dark:bg-indigo-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8 sm:py-12">
        <header className="text-center mb-8 sm:mb-12">
          {/* Top bar with auth and controls */}
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Link href="/stats" className="px-3 py-2 text-sm font-medium rounded-xl bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                📊 Statystyki
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <AuthButtons />
              <ThemeToggle />
            </div>
          </div>
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/30">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            ToDo Lista
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Zarządzaj swoimi zadaniami z łatwością</p>
        </header>

        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-3xl shadow-xl shadow-indigo-500/10 dark:shadow-none border border-white/20 dark:border-gray-700/50 p-6 sm:p-8">
          <section className="mb-6">
            <AddTodoForm categories={categories} />
          </section>

          <section className="mb-4">
            <Suspense fallback={null}>
              <SearchInput />
            </Suspense>
          </section>

          <section className="mb-6">
            <Suspense fallback={null}>
              <FilterTabs />
            </Suspense>
          </section>

          <div className="flex justify-between items-center mb-4 px-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {completedCount}/{todoCount} ukończone
            </span>
            {(filter !== 'all' || searchQuery) && (
              <div className="flex gap-2">
                {filter !== 'all' && (
                  <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
                    {filter === 'active' ? 'Aktywne' : 'Zakończone'}
                  </span>
                )}
                {searchQuery && (
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400">
                    &quot;{searchQuery}&quot;
                  </span>
                )}
              </div>
            )}
          </div>

          <section>
            <SortableTodoList todos={todos} categories={categories} />
          </section>
        </div>

        <footer className="mt-8 space-y-4">
          <div className="flex flex-wrap justify-center items-center gap-4">
            <ExportButtons />
            <CalendarExport />
            <GoogleCalendarSync />
            <NotificationPermission />
          </div>
          <p className="text-center text-sm text-gray-400 dark:text-gray-500">Zbudowane z ❤️ przy użyciu Next.js i Prisma</p>
        </footer>
      </div>
    </main>
  )
}
