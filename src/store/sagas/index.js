import { all } from 'redux-saga/effects';

import sagaPaciente from './paciente';

export default function* rootSaga() {
  yield all([
    sagaPaciente(),
  ]);
}
