import { Mail, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { forgotForm, handleChangeEmail, selectSimpleAuth ,setIsSubmitted , clearErrors } from "../../features/auth/simpleAuthSlice";

export default function ForgotPassword() {
  const dispatch = useDispatch();
  const {email , isSubmitting , errors , backendError , successMessage ,isSubmitted} = useSelector(selectSimpleAuth);

  

  
 
  const handleSubmit = async (e) => {
    e.preventDefault();
   dispatch(forgotForm());
    
  };

  useEffect(() => {
    // Clear errors when component unmounts
    return () => {
      dispatch(clearErrors());
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 text-center">
          {/* Back button */}
          <Link 
            to="/login" 
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to login
          </Link>

          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
              Forgot your password?
            </h2>
            <p className="text-gray-600 mb-8">
              {isSubmitted 
                ? "Check your email for a password reset link"
                : "Enter your email to reset your password"}
            </p>
          </div>

           {successMessage && (
            <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-lg border border-green-200 flex items-center animate-fade-in">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {successMessage}
            </div>
          )}

          {/* Backend Error */}
          {backendError && (
            <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-lg border border-red-200 flex items-center animate-fade-in">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {backendError}
            </div>
          )}

          {!isSubmitted ? (
            <form className="space-y-6" noValidate onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left mb-1">
                  Email address
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => dispatch(handleChangeEmail(e.target.value))}
                   className={`block w-full pl-10 pr-3 py-2 border ${errors?.email ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="you@example.com"
                  />
                </div>
                 {errors?.email && (
                <p className="mt-2 text-sm text-red-600">{errors?.email}</p>
              )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-md font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Sending..." : "Send reset link"}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-gray-600 mb-6">
                We've sent instructions to <span className="font-medium">{email}</span>. 
                Please check your inbox.
              </p>
              <p className="text-sm text-gray-500">
                Didn't receive the email?{" "}
                <button 
                  onClick={() => {dispatch(setIsSubmitted(false)) ,  dispatch(clearErrors())}}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Try again
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}