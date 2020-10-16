/* eslint-disable no-undef */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { Link } from 'react-router-dom';
import {
  Grid,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
  Menu,
  MenuItem,
} from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';

import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PacienteService from '../../../../../services/Paciente'
import NotificationActions from '../../../../../store/ducks/notifier';
import PacienteActions from '../../../../../store/ducks/paciente';
import excel from '../../../../../assets/images/excel.png';
import pdf from '../../../../../assets/images/pdf.png';
import Material from './styles';

class ListaPacientes extends Component {
  
  state = {
    search: '',
    editarAnchorEl: null,
    pacienteSelecionado: null,

    page: 0,
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 25, 50, 100],

    cellsColumns: [
      { value: 'ID', styles: 'cellTable' },
      { value: 'Nome', styles: 'cellTable' },
      { value: 'Idade', styles: 'cellTable' },
      { value: 'Data de Cadastro', styles: 'cellTable' },
      { value: 'Cidade', styles: 'cellTable' },
      { value: 'Estado', styles: 'cellTable' },
    ],
  }

  componentDidMount() {
    const { fetchPacientes } = this.props;
    fetchPacientes();
  }

  filterPaciente = (paciente) => {
    const { search } = this.state;

    if (!String(search).trim()) {
      return true;
    }

    if (new RegExp(search, 'ig').test(paciente.nome)) {
      return true;
    }

    if (new RegExp(search, 'ig').test(paciente.idade)) {
      return true;
    }

    if (new RegExp(search, 'ig').test(paciente.dataCadastro)) {
      return true;
    }

    if (new RegExp(search, 'ig').test(paciente.cidade)) {
      return true;
    }

    if (new RegExp(search, 'ig').test(paciente.estado)) {
      return true;
    }

    return false;
  }

  handleChangeSearch  = ({ target: { value: search } }) => this.setState({ search })

  handleClickPacienteMenu = paciente => (event) => {
    this.setState({ editarAnchorEl: event.currentTarget, pacienteSelecionado: { ...paciente } });
  }

  handleClosePacienteMenu = () => {
    this.setState({ editarAnchorEl: null, pacienteSelecionado: null });
  }

  handleRemovePaciente = async () => {
    const { fetchPacientes, notify } = this.props;
    const { pacienteSelecionado: { id } } = this.state;

    try {
      this.handleClosePacienteMenu();
      await PacienteService.remove(id);
      fetchPacientes();
    } catch (err) {
      notify("Não foi possível remover o paciente selecionado", { variant: 'warning' })
    }
  }


  handlePdf = async () => {
    try {
      await this.setState({ loadingPDF: true });
      kendo.drawing.drawDOM($('#pacientes'), {
        multiPage: true,
        allPages: true,
        avoidLinks: true,
        repeatHeaders: true,
        paperSize: 'A4',
        margin: {
          top: '2cm',
          left: '1cm',
          right: '1cm',
          bottom: '2cm',
        },
        scale: 0.6,
        keepTogether: 'print',
        template: $('#page-template').html(),
      }).then((group) => {
        this.setState({ loadingPDF: false });
        return kendo.drawing.exportPDF(group);
      }).then((dataURI) => {
        kendo.saveAs({
          dataURI,
          fileName: "RELATORIO DE PACIENTES.pdf"
        });
      });
    } catch (err) {
      console.log(err);
    }
  }


  handleExcel = () => {
    const { pacientes } = this.props;
    const { cellsColumns: cells } = this.state;
    const rows = [];

    try {
      const columns = Object.keys(pacientes.find(Boolean)).map(() => ({ autoWidth: true }));

      pacientes.map((paciente) => {
        const cells = [];

        Object.keys(paciente).map(key => cells.push({
          value: paciente[key],
        }));

        return rows.push({
          cells,
        });
      });

      const workbook = new kendo.ooxml.Workbook({
        creator: 'ODAPP',
        sheets: [
          {
            name: 'RELATÓRIO DE PACIENTES',
            columns,
            rows: [{ cells }, ...rows],
          },
        ],
      });

      kendo.saveAs({
        dataURI: workbook.toDataURL(),
        fileName: `RELATÓRIO DE PACIENTES`,
      });
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({ loading: true });
    }
  }

  handleChangePage = pageName => (event, page) => {
    this.setState({ [pageName]: page });
  };

  handleChangeRowsPerPage = (page, rowsPerPage) => (event) => {
    this.setState({ [page]: 0, [rowsPerPage]: +event.target.value });
  };

  render() {
    const { classes, pacientes } = this.props;
    const { search, editarAnchorEl, pacienteSelecionado,  page, rowsPerPage, rowsPerPageOptions } = this.state;

    const open = Boolean(editarAnchorEl);
    const pacientesPagination = pacientes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
      <Grid container spacing={1}>
        <Grid item container spacing={2} sm={12} md={12} lg={12}>
          <Grid item sm={12} md={12} lg={12}>
            <TextField
              label="Pesquisar"
              variant="outlined"
              fullWidth
              value={search}
              onChange={this.handleChangeSearch}
            />
          </Grid>
          <Grid item sm={12} md={12} lg={12} style={{ width: '100%', minHeight: isEmpty(pacientes) ? undefined : '55vh', maxHeight: '55vh', overflow: 'auto' }}>
          
            <Table id="pacientes" className={classes.table} stickyHeader={true} style={{ tableLayout: 'auto' }}>
              <TableHead>
                <TableRow>
                  <TableCell align="center" className={classes.tableHeader}>Nome</TableCell>
                  <TableCell align="center" className={classes.tableHeader}>Idade</TableCell>
                  <TableCell align="center" className={classes.tableHeader}>Data de Cadastro</TableCell>
                  <TableCell align="center" className={classes.tableHeader}>Cidade</TableCell>
                  <TableCell align="center" className={classes.tableHeader}>Estado</TableCell>
                  <TableCell align="center" />
                </TableRow>
              </TableHead>
                <TableBody>
                  {pacientesPagination.filter(this.filterPaciente).map(paciente => (
                    <TableRow>
                      <TableCell align="center">{paciente.nome}</TableCell>
                      <TableCell align="center">{paciente.idade}</TableCell>
                      <TableCell align="center">{paciente.dataCadastro ? moment(paciente.dataCadastro).format("DD/MM/YYYY [às] HH:mm") : '-' }</TableCell>
                      <TableCell align="center">{paciente.cidade}</TableCell>
                      <TableCell align="center">{paciente.estado}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          arial-label="Mais"
                          aria-owns={open ? `menu-${paciente.id}` : undefined}
                          aria-haspopup="true"
                          onClick={this.handleClickPacienteMenu(paciente)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
            </Table>
          </Grid>
          <Grid item container  justify="center" sm={12} md={12} lg={12}>
            <TableFooter>
              <IconButton onClick={this.handleExcel}>
                <img src={excel} alt="icone excel" />
              </IconButton>
              <IconButton onClick={this.handlePdf}>
                <img src={pdf} alt="icone pdf"/>
              </IconButton>
            </TableFooter>

            <Grid item container justify="flex-end" sm={12} md={12} lg={12}>
              <TablePagination
                rowsPerPageOptions={rowsPerPageOptions}
                component="div"
                count={pacientes.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={this.handleChangePage('page')}
                onChangeRowsPerPage={this.handleChangeRowsPerPage('page', 'rowsPerPage')}
              />
            </Grid>
            

          </Grid>
          

          {!!pacienteSelecionado && (
              <Menu
                id={`menu-${pacienteSelecionado.id}`}
                anchorEl={editarAnchorEl}
                open={open}
                onClose={this.handleClosePacienteMenu}
                PaperProps={{
                  style: {
                    maxHeight: 45 * 4.5,
                    width: 200,
                    marginLeft: -10
                  },
                }}
              >
                <MenuItem button component={Link} to={`/app/${pacienteSelecionado.id}`} onClick={this.handleClosePacienteMenu}>
                  <IconButton>
                    <EditIcon />
                  </IconButton>
                  Editar
                </MenuItem>

                <MenuItem button onClick={this.handleRemovePaciente}>
                  <IconButton>
                    <DeleteForeverIcon />
                  </IconButton>
                  Remover
                </MenuItem>
              </Menu>
            )}


        </Grid>
      </Grid>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    pacientes: state.pacient.pacientes,
  };
};

const mapDispatchToProps = dispatch => ({
  notify: (message, options) => dispatch(NotificationActions.notify(message, options)),
  fetchPacientes: () => dispatch(PacienteActions.fetchPacientes()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(Material)(ListaPacientes));