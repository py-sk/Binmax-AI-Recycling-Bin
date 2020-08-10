import React, {useState, useEffect} from 'react';
import { withStyles,makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import firebase from '../../../firebase.js';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#46ea6c',
    color: '#000',
    // fontWeight: 'bold',
    fontSize: '16px',
  },
  body: {
    fontSize: 14,
    maxWidth: 100
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:nth-of-type(1)': {
      backgroundColor: '#56c573',
    },
    '&:nth-of-type(2)': {
      backgroundColor: '#9adeac',
    },
    '&:nth-of-type(3)': {
      backgroundColor: '#cff7da',
    },
    '&:nth-of-type(1) >th':{
      fontSize: 20
    },
    '&:nth-of-type(1) >td':{
      fontSize: 20
    },
    '&:nth-of-type(2) >th':{
      fontSize: 18
    },
    '&:nth-of-type(2) >td':{
      fontSize: 18
    },
    '&:nth-of-type(3) >th':{
      fontSize: 16
    },
    '&:nth-of-type(3) >td':{
      fontSize: 16
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    paddingRight: '13px'
  },
  cell: {
    paddingRight: '13px'
  }
});

function useSchools() {
  const [schools, setSchools] = useState([])
  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection('RecycledMaterials')
      .orderBy('Quantity','desc')
      .onSnapshot((snapshot) => {
        const newSchools = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
        setSchools(newSchools)
      })
    return () => unsubscribe() 
  },[])
  return schools
}


export default function SchoolTable() {
  const classes = useStyles();
  const schools = useSchools()
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell align="center" className={classes.cell} size='small'>Materials</StyledTableCell>
            <StyledTableCell align="center" className={classes.cell} size='small'>Recycled</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {schools.map((row) => (
            <StyledTableRow key={row.Name}>
              <StyledTableCell align="center" className={classes.cell} component="th" scope="row" size='small'>
                {row.Material}
              </StyledTableCell>
              <StyledTableCell align="center" className={classes.cell} size='small'>{row.Quantity}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}