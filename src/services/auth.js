import { supabase } from "./supabase";

export async function authSignUp(email, password, dataObj) {
  const { role, name } = dataObj;
  let { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
        display_name: name,
      },
      emailRedirectTo:
        window.location.origin || `${window.location.origin}/auth/signin`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function authSignInWithPassword(email, password) {
  let { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function authSignOut() {
  let { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  return;
}

export async function authGetUser() {
  let { data, error } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  return data.user ?? null;
}

export async function authGetSession() {
  let { data, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  return data.session ?? null;
}

export function onAuthStateChange(cb) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => cb(event, session));
  return () => subscription.unsubscribe();
}

export async function authResendEmail(email) {
  let { data, error } = await supabase.auth.resend({ type: "signup", email });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// pw recovery
// captcha
