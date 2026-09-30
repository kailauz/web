import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

let supabase;

export function getAppSupabase() {
  if (supabase) return supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Authentication is not configured.');
  supabase = createClient(url, key, { auth: { persistSession: true, autoRefreshToken: true } });
  return supabase;
}

export function useAppSession() {
  const [state, setState] = useState({ loading: true, session: null, error: '' });

  useEffect(() => {
    let active = true;
    let subscription;
    try {
      const auth = getAppSupabase();
      auth.auth.getSession()
        .then(({ data }) => active && setState({ loading: false, session: data.session, error: '' }))
        .catch((error) => active && setState({ loading: false, session: null, error: error.message }));
      subscription = auth.auth.onAuthStateChange((_event, session) => {
        if (active) setState({ loading: false, session, error: '' });
      }).data.subscription;
    } catch (error) {
      setState({ loading: false, session: null, error: error.message });
    }
    return () => { active = false; subscription?.unsubscribe(); };
  }, []);

  return {
    ...state,
    signIn: async (email, password) => {
      setState((current) => ({ ...current, loading: true, error: '' }));
      const { error } = await getAppSupabase().auth.signInWithPassword({ email, password });
      if (error) setState((current) => ({ ...current, loading: false, error: error.message }));
    },
    signOut: () => getAppSupabase().auth.signOut(),
  };
}
