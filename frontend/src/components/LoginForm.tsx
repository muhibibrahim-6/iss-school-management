
import { useState, type FormEvent } from "react";
import { LockKeyhole, Mail, School } from "lucide-react";
import { login, type LoginResponse } from "../lib/api";

interface LoginFormProps {
  onLogin: (result: LoginResponse) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(identifier.trim(), password);
      onLogin(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to sign in."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo">
            <School size={28} />
          </div>
          <div>
            <h1>ISS School Management</h1>
            <p>International System Security</p>
          </div>
        </div>

        <h2>Welcome back</h2>
        <p className="auth-subtitle">
          Sign in to access your school portal.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="login-identifier">Email or username</label>
          <div className="auth-input-wrap">
            <Mail size={18} aria-hidden="true" />
            <input
              id="login-identifier"
              type="text"
              autoComplete="username"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              placeholder="Enter email or username"
              maxLength={254}
              required
            />
          </div>

          <label htmlFor="login-password">Password</label>
          <div className="auth-input-wrap">
            <LockKeyhole size={18} aria-hidden="true" />
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              maxLength={128}
              required
            />
          </div>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="auth-footnote">
          If your school registration is pending, contact your
          school administrator or ISS support.
        </p>
      </section>
    </main>
  );
}
