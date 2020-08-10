import React from 'react'
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import MaterialTable from './Tables/MaterialsTable';
import SchoolTable from './Tables/SchoolsTable';
import ItemTable from './Tables/ItemsTable';



const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      marginTop:5,
    },
    paper: {
      padding: theme.spacing(1),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },

  }));

function FormRow1() {
    return (
      <React.Fragment>
        <Grid item xs={6}>
          <MaterialTable/>
        </Grid>
        <Grid item xs={6}>
            <SchoolTable/>
        </Grid>

      </React.Fragment>
    );
}

function FormRow2() {
    return (
      <React.Fragment>
        <Grid item xs={12}>
          <ItemTable/>
        </Grid>


      </React.Fragment>
    );
}

const StatsExpanded = () => {
    const classes = useStyles();
    return(
        <Container>
        <div className={classes.root}>
            <Grid container spacing={1}>
                <Grid container item xs={12} spacing={1}>
                <FormRow1 />
                </Grid>
                <Grid container item xs={12} spacing={1}>
                <FormRow2 />
                </Grid>
            </Grid>
        </div>
        </Container>
    )
}

export default StatsExpanded;