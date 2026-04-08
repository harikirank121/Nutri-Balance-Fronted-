import { useAuth } from '../context/AuthContext';

export const usePermission = () => {
    const { user } = useAuth();

    const canAccess = (permission) => {
        if (!user || user.permissions === undefined) return false;
        return user.permissions.includes(permission);
    };

    return { canAccess };
};
