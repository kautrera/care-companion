import { useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { usePatient } from "./hooks/usePatient";
import { useAppStore } from "./store/useAppStore";
import { useWakeLock } from "./hooks/useWakeLock";
import { isSupabaseConfigured } from "./lib/supabase";

import { Login } from "./pages/auth/Login";
import { SignUp } from "./pages/auth/SignUp";
import { Setup } from "./pages/Setup";
import { PatientHome } from "./pages/patient/Home";
import { NeedConfirm } from "./pages/patient/NeedConfirm";
import { QuestionAnswer } from "./pages/patient/QuestionAnswer";
import { CaretakerHome } from "./pages/caretaker/Home";
import { History } from "./pages/caretaker/History";
import { Settings } from "./pages/caretaker/Settings";

import { LockGuard } from "./components/LockGuard";
import { Screen } from "./components/Screen";

function FullScreenMessage({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <Screen>
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-ink-mute">{body}</p>
      </div>
    </Screen>
  );
}

function RootRedirect() {
  const { user, loading: authLoading } = useAuth();
  const { patient, loading: patientLoading } = usePatient(user?.id);
  const mode = useAppStore((s) => s.mode);

  if (authLoading || (user && patientLoading)) {
    return <FullScreenMessage title="Care Companion" body="Loading…" />;
  }
  if (!user) return <Navigate to="/login" replace />;
  if (!patient) return <Navigate to="/setup" replace />;
  if (mode === "patient") return <Navigate to="/patient" replace />;
  return <Navigate to="/caretaker" replace />;
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <FullScreenMessage title="Care Companion" body="Loading…" />;
  }
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppShell() {
  const mode = useAppStore((s) => s.mode);
  const location = useLocation();

  useEffect(() => {
    const o = screen.orientation as ScreenOrientation & {
      lock?: (orientation: string) => Promise<void>;
    };
    o?.lock?.("portrait").catch(() => undefined);
  }, []);

  const isPatientRoute =
    mode === "patient" && location.pathname.startsWith("/patient");
  useWakeLock(isPatientRoute);

  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route
        path="/setup"
        element={
          <RequireAuth>
            <Setup />
          </RequireAuth>
        }
      />

      <Route
        path="/patient"
        element={
          <RequireAuth>
            <PatientHome />
          </RequireAuth>
        }
      />
      <Route
        path="/patient/need/:slug"
        element={
          <RequireAuth>
            <NeedConfirm />
          </RequireAuth>
        }
      />
      <Route
        path="/patient/question/:slug"
        element={
          <RequireAuth>
            <QuestionAnswer />
          </RequireAuth>
        }
      />

      <Route
        path="/caretaker"
        element={
          <RequireAuth>
            <LockGuard>
              <CaretakerHome />
            </LockGuard>
          </RequireAuth>
        }
      />
      <Route
        path="/caretaker/history"
        element={
          <RequireAuth>
            <LockGuard>
              <History />
            </LockGuard>
          </RequireAuth>
        }
      />
      <Route
        path="/caretaker/settings"
        element={
          <RequireAuth>
            <LockGuard>
              <Settings />
            </LockGuard>
          </RequireAuth>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export function App() {
  if (!isSupabaseConfigured) {
    return (
      <FullScreenMessage
        title="Supabase isn't configured"
        body="Copy .env.example to .env and add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then restart the dev server."
      />
    );
  }
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
