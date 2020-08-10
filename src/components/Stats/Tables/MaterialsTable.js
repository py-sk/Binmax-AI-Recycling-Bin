import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import firebase from '../../../firebase.js';
import Chart from 'react-apexcharts';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles({
  // table: {
  //   minWidth: 345,
    
  // },
});

function useMaterials() {
  const [materials, setMaterials] = useState([])
  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection('RecycledMaterials')
      .orderBy('Quantity','desc')
      .onSnapshot((snapshot) => {
        const newMaterials = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
        setMaterials(newMaterials)
      })
    return () => unsubscribe() 
  },[])
  return materials
}


export default function MaterialTable() {
  const classes = useStyles();
  const items = useMaterials()
  const valueArray = [];
  const nameArray = [];
  items.map((row)=>(
    valueArray.push(row.Quantity)
    )
  );
  items.map((row)=>(
    nameArray.push(row.Material)
    )
  );
  console.log(valueArray);
  console.log(nameArray);
  const options = {
    chart: {
      type: 'donut',
      animations: {
        enabled: true,
        easing: 'easein',
        speed: 1,
      }
    },
    fill: {
      type: 'gradient',
    },
    title: {
      text: 'Amount Recycled Per Materials',
      align: 'center',
      style: {
        fontFamily: 'Oswald',
        fontSize: 25
      }
    },
    labels: nameArray,
    legend: {
      show: true,
      offsetY:50
    }
  }

  return (
    <Container className={classes.contain}>
      <Chart options={options} series={valueArray} type="donut" width={350} />
    </Container>
  );
}