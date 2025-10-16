import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()

  const { data, error } = await supabase.from('todos').select('*').limit(5)

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start max-w-2xl w-full">
        <div className="flex flex-col gap-4 w-full">
          <h1 className="text-4xl font-bold">Next.js + Supabase</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Your Next.js app is now connected to Supabase!
          </p>
        </div>

        <div className="w-full bg-black/[.05] dark:bg-white/[.06] rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Update your <code className="bg-black/[.05] dark:bg-white/[.06] px-2 py-1 rounded">.env.local</code> file with your Supabase credentials</li>
            <li>Create a table in your Supabase project (e.g., &quot;todos&quot;)</li>
            <li>Refresh this page to see data from Supabase</li>
          </ol>
        </div>

        <div className="w-full bg-black/[.05] dark:bg-white/[.06] rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Supabase Connection Status</h2>
          {error ? (
            <div className="text-red-500">
              <p className="font-semibold">Error connecting to Supabase:</p>
              <p className="text-sm mt-2">{error.message}</p>
              <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
                Make sure you have updated your .env.local file with valid credentials.
              </p>
            </div>
          ) : data ? (
            <div className="text-green-600 dark:text-green-400">
              <p className="font-semibold">Successfully connected to Supabase!</p>
              <p className="text-sm mt-2">Found {data.length} records in the todos table.</p>
              {data.length > 0 && (
                <pre className="mt-4 text-xs bg-black/[.05] dark:bg-white/[.06] p-4 rounded overflow-auto">
                  {JSON.stringify(data, null, 2)}
                </pre>
              )}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              Connecting to Supabase...
            </p>
          )}
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row w-full">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm h-10 px-5 w-full sm:w-auto"
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Supabase Dashboard
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm h-10 px-5 w-full sm:w-auto"
            href="https://supabase.com/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Supabase Docs
          </a>
        </div>
      </main>
    </div>
  )
}
