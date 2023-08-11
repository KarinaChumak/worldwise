import { createContext, useContext, useReducer } from 'react';

const AuthContext = createContext();
const initialState = { user: null, isAuthenticated: false };

const FAKE_USER = {
  name: 'Jack',
  email: 'jack@example.com',
  password: 'qwerty',
  avatar: 'https://i.pravatar.cc/100?u=zz',
};

function reducer(state, action) {
  switch (action.type) {
    case 'login':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };

    case 'logout':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };

    default:
      throw new Error('Unknown action');
  }
}

function AuthProvider({ children }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState
  );

  function login(email, password) {
    if (
      email === FAKE_USER.email &&
      password === FAKE_USER.password
    ) {
      dispatch({ type: 'login', payload: FAKE_USER });
    }
  }
  function logout() {
    dispatch({ type: 'logout', payload: FAKE_USER });
  }
  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === null)
    throw new Error(
      'Trying to reach Auth context outside of the provider'
    );
  return context;
}

export { useAuth, AuthProvider };
