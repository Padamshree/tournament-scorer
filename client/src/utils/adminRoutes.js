import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const AdminRoute = ({component: Component, auth, role,...rest}) => {
    return (

        // Show the component only when the admin user is logged in
        // Otherwise, redirect the user to /signin page
        <Route {...rest} render={props => (
            auth && (role === 'admin') ?
                <Component {...props} />
            : <Redirect to="/login" />
        )} />
    );
};

export default AdminRoute;