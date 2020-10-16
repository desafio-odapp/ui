import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import { reducer as notifierReducer } from './notifier';
import { reducer as appConfigReducer } from './app-config';
import { reducer as pacienteReducer } from './paciente';

export default history => combineReducers({
  router: connectRouter(history),
  notifier: notifierReducer,
  appConfig: appConfigReducer,
  pacient: pacienteReducer,
});
