import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Harmonized Trainer
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A Next.js app with Supabase authentication
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Link
              href="/signin"
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-medium"
            >
              Sign Up
            </Link>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quick Links</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/dashboard"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/test"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Test Connection
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
