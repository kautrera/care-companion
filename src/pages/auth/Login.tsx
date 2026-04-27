import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { Screen } from "../../components/Screen";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: err } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setSubmitting(false);
    if (err) {
      setError(err.message);
      return;
    }
    navigate("/", { replace: true });
  }

  return (
    <Screen>
      <div className="flex flex-1 flex-col justify-center gap-6 py-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Care Companion</h1>
          <p className="text-ink-mute">Sign in as the caretaker.</p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-ink-mute">Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-2xl bg-surface px-4 py-4 text-lg text-ink placeholder:text-ink-mute/60 outline-none focus:ring-2 focus:ring-accent"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-ink-mute">Password</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-2xl bg-surface px-4 py-4 text-lg text-ink placeholder:text-ink-mute/60 outline-none focus:ring-2 focus:ring-accent"
            />
          </label>

          {error && (
            <p className="rounded-xl bg-no/15 px-4 py-3 text-sm text-no-hi">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-2xl bg-accent px-4 py-4 text-lg font-semibold text-bg disabled:opacity-50"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-center text-ink-mute">
          New here?{" "}
          <Link to="/signup" className="text-accent underline-offset-4 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </Screen>
  );
}
