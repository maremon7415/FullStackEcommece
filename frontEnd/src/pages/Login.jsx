import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../contexts/ShopContextsProvider";
import axios from "axios";

const Login = () => {
  const [currentState, setCurrentState] = useState("Sign Up");
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validMessage, setValidMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Validation logic
  const validateForm = () => {
    if (currentState === "Sign Up") {
      if (name.trim().length < 4) {
        return "Name must be at least 4 characters long";
      }
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        return "Please enter a valid email address";
      }
      if (password.length < 8) {
        return "Password must be at least 8 characters long";
      }
      if (password !== confirmPassword) {
        return "Passwords do not match";
      }
    } else {
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        return "Please enter a valid email address";
      }
      if (password.length < 8) {
        return "Password must be at least 8 characters long";
      }
    }
    return "";
  };

  //  Form submit
  const submitHandler = async (e) => {
    e.preventDefault();
    setValidMessage("");

    // run validation
    const error = validateForm();
    if (error) {
      setValidMessage(error);
      return;
    }

    setIsLoading(true);

    try {
      let response;
      if (currentState === "Sign Up") {
        response = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
        });
      } else {
        response = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });
      }

      if (response.data.success) {
        const userToken = response.data.token;
        const expiryTime = new Date().getTime() + 24 * 60 * 60 * 1000;

        localStorage.setItem("token", userToken);
        localStorage.setItem("expiryTime", expiryTime);

        setToken(userToken);
        // Keep loading state active - it will be cleared when component unmounts due to navigation
      } else {
        setValidMessage(response.data.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setValidMessage(error.response?.data?.message || "An error occurred");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  const labelStyle = [
    "absolute left-4 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-sm peer-focus:text-gray-900",
  ];
  const inputStyle = [
    "peer w-full px-4 pt-5 pb-2 border border-gray-600 focus:outline-1 placeholder-transparent",
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] w-full bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-xl shadow-md">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {currentState}
          </h2>
          <p className="text-sm text-gray-600">
            {currentState === "Login"
              ? "Welcome back! Please enter your details."
              : "Create an account to get started."}
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-2" onSubmit={submitHandler}>
          <div className="space-y-4">
            {/* Name input (Sign Up only) */}
            {currentState === "Sign Up" && (
              <div className="relative">
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  id="name"
                  type="text"
                  className={inputStyle}
                  disabled={isLoading}
                />
                <label htmlFor="name" className={labelStyle}>
                  Full Name
                </label>
              </div>
            )}

            {/* Email input */}
            <div className="relative">
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                id="email"
                type="email"
                className={inputStyle}
                disabled={isLoading}
              />
              <label htmlFor="email" className={labelStyle}>
                Email address
              </label>
            </div>

            {/* Password input */}
            <div className="relative">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                type={showPassword ? "text" : "password"}
                className={inputStyle}
                disabled={isLoading}
              />
              <label htmlFor="password" className={labelStyle}>
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-4 text-sm text-gray-500"
                disabled={isLoading}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Confirm Password (Sign Up only) */}
            {currentState === "Sign Up" && (
              <div className="relative">
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  className={inputStyle}
                  disabled={isLoading}
                />
                <label htmlFor="confirmPassword" className={labelStyle}>
                  Confirm Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-4 text-sm text-gray-500"
                  disabled={isLoading}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            )}
          </div>

          {/* Toggle Login / Sign Up */}
          <div className="flex items-center justify-between text-sm">
            <a
              href="#"
              className="font-medium text-gray-900 hover:text-gray-700"
            >
              Forgot password?
            </a>
            <button
              type="button"
              onClick={() =>
                setCurrentState(currentState === "Login" ? "Sign Up" : "Login")
              }
              className="font-medium text-gray-900 hover:text-gray-700"
              disabled={isLoading}
            >
              {currentState === "Login" ? "Sign Up" : "Login"}
            </button>
          </div>

          {/* Validation message */}
          <div className="w-full text-sm text-red-500 h-4">{validMessage}</div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full flex justify-center items-center py-3 px-4 text-md font-medium text-white bg-black hover:bg-gray-900 transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {currentState === "Sign Up"
                  ? "Creating Account..."
                  : "Signing In..."}
              </>
            ) : (
              currentState
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
