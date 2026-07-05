import { useCallback, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import api from "../services/api";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    const { data } = await api.get("/auth/me");
    setUser(data.profile);
    return data.profile;
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setFirebaseUser(currentUser);
      if (!currentUser) {
        localStorage.removeItem("token");
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        localStorage.setItem("token", await currentUser.getIdToken());
        await refreshProfile();
      } catch {
        await signOut(auth);
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, [refreshProfile]);

  const login = useCallback(async (credential) => {
    const token = await credential.user.getIdToken();
    localStorage.setItem("token", token);
    setFirebaseUser(credential.user);
    return refreshProfile();
  }, [refreshProfile]);

  const logout = useCallback(async () => {
    await signOut(auth);
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ firebaseUser, user, loading, login, logout, refreshProfile }),
    [firebaseUser, user, loading, login, logout, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
