import { useNavigate } from 'react-router-dom';

import { LogOut , ArrowBigLeft} from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="relative">
          <div className="absolute -inset-4 bg-indigo-600/10 dark:bg-indigo-400/10 rounded-lg blur opacity-75"></div>
          <div className="relative bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
            <h1 className="text-9xl font-extrabold text-gray-900 dark:text-gray-100">
              4<span className="text-indigo-600 dark:text-indigo-400">0</span>4
            </h1>
            <h2 className="mt-2 text-2xl font-medium text-gray-900 dark:text-gray-100">
              Page not found
            </h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              Sorry, we couldn't find the page you're looking for.
            </p>
          </div>
        </div>
        
        <div className="mt-10">
          <button
            onClick={() => navigate('/')}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow hover:shadow-md"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <ArrowBigLeft className="h-5 w-5 text-indigo-300 group-hover:text-indigo-200 dark:text-indigo-200 dark:group-hover:text-indigo-100" />
            </span>
            Back to Home
          </button>
        </div>

        <div className="pt-8 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Login</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;