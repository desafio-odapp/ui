import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Grid,
  Paper,
} from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import NotificationActions from '../../../store/ducks/notifier';
import ListaPacientes from './components/ListaPacientes';
import CadastroPaciente from './components/CadastroPaciente';
import Material from './styles';


class Pacientes extends Component {
  render() {
    const { classes, match, history } = this.props;
      return (
        <Grid>
          <Grid item sm={12} md={12} lg={12}>
            <Paper className={classes.paper} elevation={5}>
              <CadastroPaciente match={match} history={history} />
            </Paper>
          </Grid>

          <Grid item sm={12} md={12} lg={12}>
            <Paper className={classes.paper} elevation={5}>
              <ListaPacientes />
            </Paper>
          </Grid>
        </Grid>
    );
  }
}


const mapDispatchToProps = dispatch => ({
  notify: (message, options) => dispatch(NotificationActions.notify(message, options)),
});

export default connect(null, mapDispatchToProps)(withStyles(Material)(Pacientes));



