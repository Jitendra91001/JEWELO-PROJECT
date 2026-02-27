// hooks/useAuth.ts
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  isEmailVerified: boolean;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const useAuth = () => {
  const { isAuthenticated, user, token, loading, error }: AuthState = useSelector(
    (state: RootState) => state.auth
  );

  const dispatch = useDispatch();

//   const handleLogout = () => {
//     dispatch(logout());
//     localStorage.removeItem('token');
//   };

  return {
    isAuthenticated,
    user,
    token,
    loading,
    error,
    // handleLogout,
  };
};

export default useAuth;