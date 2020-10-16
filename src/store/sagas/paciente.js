import {
  takeLatest, put, call,
} from 'redux-saga/effects';
import PacienteService from '../../services/Paciente';

import PacienteActions, { PacienteTypes } from '../ducks/paciente';
import NotifierActions from '../ducks/notifier';


function* fetchPaciente({ pacienteId }) {
  try {
    const { paciente } = yield call([PacienteService, 'getById'], pacienteId);

    yield put(PacienteActions.fetchPacienteSuccess(paciente));
  } catch (err) {
    console.log(err);
    yield put(NotifierActions.notifyError('Não foi possível carregar o paciente'));
  }
}

function* fetchPacientes() {
  try {
    const pacientes = yield call([PacienteService, 'getAll']);

    yield put(PacienteActions.fetchPacientesSuccess(pacientes));
  } catch (err) {
    console.log(err);
    yield put(NotifierActions.notifyError('Não foi possível carregar a lista de pacientes'));
  }
}

export default function* root() {
  yield takeLatest(PacienteTypes.FETCH_PACIENTE, fetchPaciente);
  yield takeLatest(PacienteTypes.FETCH_PACIENTES, fetchPacientes);
}
