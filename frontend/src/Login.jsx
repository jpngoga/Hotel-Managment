
import { useState } from "react";
import { BedDouble, Lock, User, Eye, EyeOff } from "lucide-react";
import { apiRequest } from "./services/api";
import "./Login.css";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiRequest("/accounts/login/", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      sessionStorage.setItem("hotel_token", data.token);
      sessionStorage.setItem("hotel_user", JSON.stringify(data.user));

      onLogin(data.user);
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-icon">
            <BedDouble size={30} />
          </div>
          <h1>GrandStay</h1>
          <p>Hotel Management System</p>
        </div>

        <div className="login-heading">
          <h2>Welcome Back</h2>
          <p>Sign in to access your hotel dashboard.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <div className="login-input">
            <User size={19} />
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </div>

          <label>Password</label>
          <div className="login-input">
            <Lock size={19} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>

          {error && <div className="login-error">{error}</div>}

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="login-footer">
          © 2026 GrandStay Hotel Management System
        </p>
      </div>
    </div>
  );
}

export default Login;
