import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  function login(userData){
    localStorage.setItem('token',userData.token);
    localStorage.setItem('user',JSON.stringify(userData.user))
    setUser(userData.user)
  }

  function logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }
  return(
    <AuthContext.Provider value={{user,login,logout}}>
        {children}
    </AuthContext.Provider>
  )
}

export function useAuth(){
    return useContext(AuthContext);
}
