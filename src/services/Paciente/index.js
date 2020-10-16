import api from '../api';

export default class PacienteService {
  static async getAll() {
    const { data } = await api.get('/pacientes');

    return data;
  }

  static async getById(id) {
    const { data } = await api.get(`/pacientes/${id}`);

    return data;
  }

  static async update(paciente) {
    const { data } = await api.put(`/pacientes`, paciente);

    return data;
  }

  static async save(newPaciente) {
    const { data } = await api.post('/pacientes', newPaciente);

    return data;
  }

  static async remove(id) {
    const { data } = await api.delete(`/pacientes/${id}`);

    return data;
  }
  
}
