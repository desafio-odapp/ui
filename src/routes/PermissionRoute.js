import React from 'react';
import { Route } from 'react-router-dom';

const PermissionRoute = ({
  component: Component,
  permissions: routePermissions,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={props => <Component {...props} />}
    />
  );
};

export default PermissionRoute;
