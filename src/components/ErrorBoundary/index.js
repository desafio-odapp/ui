import { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import NotificationActions from '../../store/ducks/notifier';

class ErrorBoundary extends Component {
  constructor() {
    super();
    this.state = { hasError: false, eventId: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    const { children } = this.props;
    return children;
  }
}

const mapDispatchToProps = dispatch => ({
  notifyError: (
    message,
    options,
  ) => dispatch(NotificationActions.notifyError(message, options)),
});

export default withRouter(connect(null, mapDispatchToProps)(ErrorBoundary));
