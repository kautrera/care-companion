import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { Screen } from "../../components/Screen";

export function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setInfo(null);
    setSubmitting(true);
    const { data, error: err } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });
    setSubmitting(false);
    if (err) {
      setError(err.message);
      return;
    }
    if (!data.session) {
      setInfo(
        "Account created. Please confirm your email and then sign in."
      );
      return;
    }
    navigate("/setup", { replace: true });
  }

  return (
    <Screen>
      <div className="flex flex-1 flex-col justify-center gap-6 py-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Create caretaker account
          </h1>
          <p className="text-ink-mute">
            One account per family. You'll set up the patient next.
          </p>
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
              className="rounded-2xl bg-surface px-4 py-4 text-lg text-ink outline-none focus:ring-2 focus:ring-accent"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-ink-mute">Password</span>
            <input
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-2xl bg-surface px-4 py-4 text-lg text-ink outline-none focus:ring-2 focus:ring-accent"
            />
          </label>

          {error && (
            <p className="rounded-xl bg-no/15 px-4 py-3 text-sm text-no-hi">
              {error}
            </p>
          )}
          {info && (
            <p className="rounded-xl bg-accent/15 px-4 py-3 text-sm text-accent">
              {info}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-2xl bg-accent px-4 py-4 text-lg font-semibold text-bg disabled:opacity-50"
          >
            {submitting ? "Creating…" : "Create account"}
          </button>
        </form>

        <p className="text-center text-ink-mute">
          Already have one?{" "}
          <Link to="/login" className="text-accent underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </Screen>
  );
}
