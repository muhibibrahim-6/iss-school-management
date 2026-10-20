
import { useState, type FormEvent } from "react";
import { registerSchool } from "../lib/api";

export default function RegisterSchoolForm() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [schoolSlug, setSchoolSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function updateSchoolName(value: string) {
    setSchoolName(value);
    setSchoolSlug(
      value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 60)
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const result = await registerSchool({
        displayName: displayName.trim(),
        email: email.trim(),
        username: username.trim() || undefined,
        password,
        schoolName: schoolName.trim(),
        schoolSlug: schoolSlug.trim(),
      });

      setMessage(result.message);
      setPassword("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to submit registration."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Register your school</h1>
        <p className="auth-subtitle">
          Submit your school details for ISS review and approval.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="reg-admin-name">Administrator full name</label>
          <input
            className="registration-input"
            id="reg-admin-name"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            minLength={2}
            maxLength={100}
            autoComplete="name"
            required
          />

          <label htmlFor="reg-email">Email address</label>
          <input
            className="registration-input"
            id="reg-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            maxLength={254}
            autoComplete="email"
            required
          />

          <label htmlFor="reg-username">Username (optional)</label>
          <input
            className="registration-input"
            id="reg-username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            minLength={3}
            maxLength={30}
            autoComplete="username"
          />

          <label htmlFor="reg-password">Password</label>
          <input
            className="registration-input"
            id="reg-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={12}
            maxLength={128}
            autoComplete="new-password"
            required
          />

          <label htmlFor="reg-school-name">School name</label>
          <input
            className="registration-input"
            id="reg-school-name"
            value={schoolName}
            onChange={(event) => updateSchoolName(event.target.value)}
            minLength={2}
            maxLength={150}
            required
          />

          <label htmlFor="reg-school-slug">School URL identifier</label>
          <input
            className="registration-input"
            id="reg-school-slug"
            value={schoolSlug}
            onChange={(event) => setSchoolSlug(event.target.value)}
            minLength={3}
            maxLength={60}
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            required
          />

          {error && <p className="auth-error" role="alert">{error}</p>}
          {message && <p role="status">{message}</p>}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit registration"}
          </button>
        </form>

        <p className="auth-footnote">
          Do not submit real student records here. This form is only
          for school registration.
        </p>
      </section>
    </main>
  );
}
