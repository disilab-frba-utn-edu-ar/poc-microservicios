import React from 'react';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import { useAdminCheck } from '../hooks/UseAdminCheck.jsx';
import LoadingSpinner from './LoadingSpinner';

const AdminRoute = ({ component }) => {
    const { isAdmin, isLoading } = useAdminCheck();

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (!isAdmin) {
        return (
            <div className="text-center p-8">
                <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
                <p className="mt-4">You do not have the necessary permissions to view this page.</p>
            </div>
        );
    }

    const Component = withAuthenticationRequired(component, {
        onRedirecting: () => <LoadingSpinner />,
    });

    return <Component />;
};

export default AdminRoute;