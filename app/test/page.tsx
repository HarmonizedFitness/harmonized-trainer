'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../src/lib/supabase'

export default function TestPage() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const testConnection = async () => {
    setLoading(true)
    setError('')
    setResult('')

    try {
      const { data, error } = await supabase
        .from('pg_tables')
        .select('schemaname')
        .limit(1)

      if (error) {
        setError(`Error: ${error.message}`)
      } else {
        setResult(`Success! Data: ${JSON.stringify(data)}`)
      }
    } catch (err) {
      setError(`Unexpected error: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Supabase Connection Test</h1>
          
          <button
            onClick={testConnection}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {loading ? 'Testing...' : 'Test Connection'}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
              {error}
            </div>
          )}

          {result && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
              {result}
            </div>
          )}

          <div className="mt-6 text-sm text-gray-600">
            <p>This page tests the Supabase connection by querying the pg_tables view.</p>
            <p>If successful, it means your environment variables are correctly configured.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
