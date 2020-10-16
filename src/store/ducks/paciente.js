import { createActions, createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';

const { Types, Creators } = createActions({
  fetchPaciente: ['pacienteId'],
  fetchPacienteSuccess: ['paciente'],
  fetchPacientes: null,
  fetchPacientesSuccess: ['pacientes'],
  setPaciente: ['paciente', 'index'],
}, { prefix: 'pacient/' });

export default Creators;
export const PacienteTypes = Types;

const INITIAL_STATE = Immutable({
  error: false,
  message: '',
  paciente: {},
  pacientes: [],
});

export const reducer = createReducer(INITIAL_STATE, {
  [Types.FETCH_PACIENTE_SUCCESS]: (state, { paciente }) => {
    return Immutable.merge(state, { paciente })
  },

  [Types.FETCH_PACIENTES_SUCCESS]: (state, { pacientes }) => Immutable
    .merge(state, { pacientes }),
    
  [Types.SET_PACIENTE]: (state, { paciente, index }) => {
    const pacientes = Immutable.asMutable(state.pacientes, { deep: true });

    if ((index !== null || index !== undefined) && typeof index === 'number') {
      pacientes[index] = paciente;
      return Immutable.merge(state, { pacientes });
    }

    if (paciente && paciente.id) {
      const pacienteIndex = pacientes.findIndex(({ id }) => id === paciente.id);

      if (pacienteIndex !== -1) {
        pacientes[pacienteIndex] = paciente;
      } else {
        pacientes.push(paciente);
      }
    }

    return Immutable.merge(state, { pacientes });
  },
});
