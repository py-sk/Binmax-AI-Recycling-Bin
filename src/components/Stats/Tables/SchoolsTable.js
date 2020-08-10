import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';

import firebase from '../../../firebase.js';
import Chart from 'react-apexcharts';
import Container from '@material-ui/core/Container';


const useStyles = makeStyles({

});

function useSchools() {
  const [schools, setSchools] = useState([])
  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection('Locations')
      .orderBy('Quantity','desc')
      .limit(5)
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
  const valueArray = [];
  const nameArray = [];
  schools.map((row)=>(
    valueArray.push(row.Quantity)
    )
  );
  schools.map((row)=>(
    nameArray.push(row.Name)
    )
  );
  console.log(valueArray);
  console.log(nameArray);
  
  const options = {
    chart: {
      type: 'pie',
      offsetX: 50,
      
    },
    fill: {
      type: 'image',
      opacity: 0.85,
      image: {
          src: ['https://i.ibb.co/k1vv95K/ntu.png', 'https://i.ibb.co/dg3M7Rq/sutd.png', 'https://i.ibb.co/fQk477S/nus.png', 'https://i.ibb.co/PrDX4qS/smu.png'],

      },
    },
    stroke: {
      width: 4
    },
    title: {
      text: 'Amount Recycled Per School',
      align: 'center',
      style: {
        fontFamily: 'Oswald',
        fontSize: 25
      }
    },
    dataLabels: {
      enabled: true,
      background: {
        enabled: true,
        foreColor: 'black',
        padding: -2,
        opacity:0.5
        
      },
      style: {
        fontSize: '20px',
        fontFamily: 'Oswald'
      },
      textAnchor: 'end',
      dropShadow: {
        enabled: false
      }
    },
    labels: nameArray,
    legend: {
      
      show: false
    }
  }
  return (
    <Container className={classes.contain}>
      <Chart options={options} series={valueArray} type="pie" width={315} className={classes.schoolchart}/>
    </Container>
  );
}