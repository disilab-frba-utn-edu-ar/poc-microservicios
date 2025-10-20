import { useAuth0 } from '@auth0/auth0-react';

export const useAdminCheck = () => {
    const { user, isLoading } = useAuth0();
    const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

    const roles = user?.[`${audience}/roles`] || [];

    const isAdmin = roles.includes('admin');

    return { isAdmin, isLoading };
};