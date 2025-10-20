import React from 'react';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ component, ...args }) => {
    const Component = withAuthenticationRequired(component, {
        onRedirecting: () => <LoadingSpinner />,
    });
    return <Component {...args} />;
};

export default ProtectedRoute;