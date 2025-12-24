import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabase/client";
import {
  ensureUserProfile,
  loginWithEmail,
  loginWithGoogle,
  loginWithApple,
  logoutUser,
} from "./authActions";

const AuthContext = createContext({
  user: null,
  isLoading: true,
  loginWithEmail: () => {},
  loginWithGoogle: () => {},
  loginWithApple: () => {},
  logoutUser: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadSession() {
      const { data } = await supabase.auth.getSession();
      const current = data?.session?.user ?? null;

if (current) {
  setUser(current);
}
setIsLoading(false);


      if (current) ensureUserProfile(current);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;

if (nextUser) {
  setUser(nextUser);
}


      if (nextUser) ensureUserProfile(nextUser);
    });

    return () => {
      ignore = true;
      subscription.unsubscribe();
    };
  }, []);

  async function handleEmailLogin(email, password) {
    const { user } = await loginWithEmail(email, password);
    if (user) setUser(user);
    return user;
  }

  async function handleGoogleLogin() {
    const { user } = await loginWithGoogle();
    return user;
  }

  async function handleAppleLogin() {
    const { user } = await loginWithApple();
    return user;
  }

  async function handleLogout() {
    await logoutUser();
    setUser(null);
  }

  const value = {
    user,
    isLoading,
    loginWithEmail: handleEmailLogin,
    loginWithGoogle: handleGoogleLogin,
    loginWithApple: handleAppleLogin,
    logoutUser: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
