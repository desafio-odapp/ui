import NotificationActions from '../ducks/notifier';

const notifierMiddleware = ({ dispatch }) => next => (action) => {
  if (Object.prototype.hasOwnProperty.call(action, 'notifier')) {
    const { message, options } = action.notifier;
    dispatch(NotificationActions.notify(message, options));
  }

  return next(action);
};


export default [
  notifierMiddleware,
];
