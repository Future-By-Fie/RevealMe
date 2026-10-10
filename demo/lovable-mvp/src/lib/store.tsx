/**
 * Demo-mode app state, persisted to localStorage in this browser only.
 * The shape mirrors the planned database tables (see docs/schema.sql) so it
 * can be replaced with real backend calls without touching the screens.
 */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { seedConnections, seedMessages, type ChatMessage, type ConnectionState } from "./demo-data";

export type MyProfile = {
  name: string;
  age: number;
  gender?: string;
  seeking?: string;
  bio: string;
  photo?: string;
  blurPhoto: boolean;
  showAge: boolean;
  discoverable: boolean;
};

export type AppState = {
  profile: MyProfile | null;
  passed: string[];
  connections: Record<string, ConnectionState>;
  messages: Record<string, ChatMessage[]>;
  blocked: string[];
  reports: { id: string; reason: string; at: number }[];
};

const KEY = "revealme-demo-v1";
const initial = (): AppState => ({
  profile: null,
  passed: [],
  connections: seedConnections(),
  messages: seedMessages(),
  blocked: [],
  reports: [],
});

type Ctx = {
  state: AppState;
  ready: boolean;
  update: (fn: (s: AppState) => AppState) => void;
  reset: () => void;
};
const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState(JSON.parse(raw));
    } catch {
      /* ignore corrupt storage */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* quota (large photo) */
    }
  }, [state, ready]);

  return (
    <StoreCtx.Provider value={{ state, ready, update: setState, reset: () => setState(initial()) }}>
      {children}
    </StoreCtx.Provider>
  );
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore outside provider");
  return c;
}