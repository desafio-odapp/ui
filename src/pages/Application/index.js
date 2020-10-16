/* eslint-disable no-undef */
import React, { Component, Suspense } from 'react';
import classNames from 'classnames';
import { Switch, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import CustomRoute from '../../routes/CustomRoute';
import { Material } from './styles';
import logo from '../../assets/images/logo.png';
import Loading from './Loading';
import LoadingIndicator from '../../components/LoadingIndicator';

import Pacientes from './Pacientes';

class Application extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      open: false,
      hasError: false,
      loading: false, 
    }
  }

  render() {
    const {
      classes,
      match,
      routerTitle,
    } = this.props;

    const { open, loading } = this.state;

    return (
      <div className={classes.root}>
        <LoadingIndicator loading={loading} />
        <AppBar
          position="fixed"
          className={classNames(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar className={classes.toolbar} disableGutters={!open}>
            {open ? null : <img className={classes.logoTitle} src={logo} alt="" />}
            <Typography className={classes.grow} variant="h6" color="inherit" noWrap>
              {routerTitle}
            </Typography>

            <IconButton component={Link} to="/app">
              <HomeIcon className={classes.barIcons} />
            </IconButton> 
            <Typography component="p" variant="inherit" style={{ visibility: 'hidden' }} />
          </Toolbar>
        </AppBar>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Suspense fallback={<Loading />}>
            <Switch>
              <CustomRoute
                exact
                path={`${match.path}/:pacienteId?`}
                routeTitle="Pacientes"
                component={Pacientes}
                isMenuOpen={open}
              />
            </Switch>
          </Suspense>
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    routerTitle: state.appConfig.router.title || 'Dashboard',
  };
};

export default connect(
  mapStateToProps,
  null,
)(withStyles(Material, { withTheme: true })(Application));