import React from 'react';
import { Route } from 'react-router-dom';

import { connect } from 'react-redux';

const PrivateRoute = ({
  component: Component,
  render,
  children,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={props => <Component {...{ ...props }} />}
    />
  );
};


export default connect(null)(PrivateRoute);
