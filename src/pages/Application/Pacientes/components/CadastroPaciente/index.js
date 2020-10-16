import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import * as Yup from 'yup';
import { compose } from 'redux';
import { withFormik } from 'formik';
import moment from 'moment';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContentText,
  DialogContent,
  Slide,
  Button,
  Grid,
  TextField,
} from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';

import PacienteService from '../../../../../services/Paciente'
import NotificationActions from '../../../../../store/ducks/notifier';
import PacienteActions from '../../../../../store/ducks/paciente';
import Material from './styles';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class CadastroPaciente extends Component {
  state = {
    open: false,
    pacienteId: undefined,
  }

  componentDidMount() {
    const { match: { params : { pacienteId } } } = this.props;
  
    if (pacienteId) {
      this.fetchPaciente(pacienteId);
    }
  }

  componentDidUpdate(prevProps) {
    const { match, status, setStatus, setFieldValue, paciente } = this.props;

   
    if (match.params.pacienteId && prevProps.match.params.pacienteId !== match.params.pacienteId) {
      this.fetchPaciente(match.params.pacienteId);
    }

    if (paciente && prevProps.paciente !== paciente) {
      setFieldValue('paciente', { ...paciente })
      this.setState({ pacienteId: paciente.id, open: true })
    }


    if (status && status.updatePacientes) {
      this.handleCloseModal();
      setStatus({ updatePacientes: false });
    }
  }

  fetchPaciente = async (pacienteId) => {
    const { fetchPaciente } = this.props;
    try {
      fetchPaciente(pacienteId);
    } catch (err) {
      console.log(err)
    }
  }


  renderModalPaciente = () => {
    const {
      classes,
      handleBlur,
      handleSubmit,
      values,
    } = this.props;
    const { open, pacienteId } = this.state;

    return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={this.handleCloseModal}
      maxWidth="40vw"
    >
      <DialogTitle>{pacienteId ? ` Atualização de Dados` : 'Cadastro de Paciente'}</DialogTitle>
      <DialogContent>
        <DialogContentText style={{ minWidth: '40vw' }}>
          <Grid container spacing={2} direction="row" alignItems="center">
            <Grid item sm={12} md={12} lg={6}>
              <TextField
                className={classes.textfield}
                error={this.handleError('paciente', 'nome')}
                id="nome"
                name="nome"
                label="Nome*"
                value={values.paciente.nome}
                onChange={this.handleChange('paciente', 'nome')}
                onBlur={handleBlur}
                variant="outlined"
                type="text"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item sm={12} md={12} lg={6}>
              <TextField
                className={classes.textfield}
                error={this.handleError('paciente', 'idade')}
                id="idade"
                name="idade"
                label="Idade*"
                value={values.paciente.idade}
                onChange={this.handleChange('paciente', 'idade')}
                onBlur={handleBlur}
                variant="outlined"
                type="text"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item sm={6} md={6} lg={6}>
              <TextField
                className={classes.textfield}
                error={this.handleError('paciente', 'cidade')}
                id="cidade"
                name="cidade"
                label="Cidade*"
                value={values.paciente.cidade}
                onChange={this.handleChange('paciente', 'cidade')}
                onBlur={handleBlur}
                variant="outlined"
                type="text"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item sm={6} md={6} lg={6}>
              <TextField
                className={classes.textfield}
                error={this.handleError('paciente', 'estado')}
                id="estado"
                name="estado"
                label="Estado*"
                value={values.paciente.estado}
                onChange={this.handleChange('paciente', 'estado')}
                onBlur={handleBlur}
                variant="outlined"
                type="text"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} color="primary">
          {pacienteId ? 'Editar': 'Salvar'}
        </Button>
        <Button onClick={this.handleCloseModal} color="primary">
          Fechar
        </Button>
      </DialogActions>
      </Dialog>
    );
  }

  handleChange = (stateName, name) => ({ target: { value } }) => {
    const { setFieldValue } = this.props;
    let values = this.props.values[stateName];
    values[name] = value;
    setFieldValue(`${stateName}`, values)
  }

  handleCloseModal = () => {
    const { history, match: { path } } = this.props;
    const [url] = path.split('/:pacienteId');
    
    history.push(`${url}`);
    this.setState({ open: false })
    this.resetForm()
  };

  resetForm = () => {
    const { setFieldValue } = this.props;

    setFieldValue('paciente', {
      id: undefined,
      nome: '',
      idade: '',
      cidade: '',
      estado: ''
    })
    this.setState({ pacienteId: undefined })
  }


  handleOpenModal = () => {
    this.setState({ open: true })
  };


  handleError = (stateName, name) => {
    const { errors } = this.props;
    if (!isEmpty(errors[stateName])) {
      return !!errors[stateName][name]
    }
    return false
  }

  render() {
    return (
      <Grid container spacing={1}>
        <Grid item container spacing={2} sm={12} md={12} lg={12}>
          <Grid item sm={12} md={12} lg={12}>
            <Button
              fullWidth
              variant="contained"
              size="medium"
              color="secondary"
              type="button"
              onClick={this.handleOpenModal}
            >
              NOVO PACIENTE
            </Button>
          </Grid>
          {this.renderModalPaciente()}
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    paciente: state.pacient.paciente,
  };
};

const mapDispatchToProps = dispatch => ({
  notify: (message, options) => dispatch(NotificationActions.notify(message, options)),
  setPaciente: (paciente, index) => dispatch(PacienteActions.setPaciente(paciente, index)),
  fetchPaciente: (pacienteId) => dispatch(PacienteActions.fetchPaciente(pacienteId)),
  fetchPacientes: () => dispatch(PacienteActions.fetchPacientes()),
});


export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withFormik({
    displayName: 'CadastroPacientes',
    validateOnChange: false,
    validateOnBlur: false,
    mapPropsToValues: () => ({
      paciente: {}
    }),
    validationSchema: props => Yup.object().shape({
      paciente: Yup.object().shape({
        nome: Yup.string().required('Campo nome obrigatório'),
        idade: Yup.number().required('Campo idade obrigatório'),
        cidade: Yup.string().required('Campo cidade obrigatório'),
        estado: Yup.string().required('Campo estado obrigatório'),
      }),
    }),
    handleSubmit: async (values, { props, setStatus, resetForm }) => {
      const { paciente } = values

      const { pacienteId } = props.match.params;
      const isEdit = pacienteId && !!Number(pacienteId);

      const pacientForm = {
        ...paciente,
        idade: Number(paciente.idade) || undefined,
        id: isEdit ? Number(pacienteId) : undefined,
        dataCadastro: moment().toISOString(),
      };

      if (isEdit) {
        await PacienteService.update(pacientForm);
        props.notify('Paciente atualizado com sucesso', { variant: 'success' });
      } else {
        await PacienteService.save(pacientForm);
        props.notify('Paciente salvo com sucesso', { variant: 'success' });
      }
      
      const [url] = props.match.path.split('/:pacienteId');
      resetForm();
      props.history.replace(`${url}`);
      props.fetchPacientes();

      setStatus({ updatePacientes: true });
    }
  }),
  withStyles(Material, { withTheme: true }),
)(CadastroPaciente);