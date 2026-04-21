// hooks/useAuth.ts
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { RootState } from '../store';
import type { AuthState } from '@/store/authSlice';

const useAuth = () => {
  const { isAuthenticated, user, token, loading, error }: AuthState = useAppSelector(
    (state: RootState) => state.auth
  );

  const dispatch = useAppDispatch();

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