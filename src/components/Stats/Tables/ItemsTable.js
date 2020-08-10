import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import firebase from '../../../firebase.js';
import Chart from 'react-apexcharts';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles({
  table: {
    marginTop:-40,
  },
  contain: {
    color: '#ffffff'
  }
});

function useItems() {
  const [items, setItems] = useState([])
  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection('RecycledItems')
      .orderBy('quantity','desc')
      .limit(10)
      .onSnapshot((snapshot) => {
        const newItems = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
        setItems(newItems)
      })
    return () => unsubscribe() 
  },[])
  return items
}

export default function ItemTable() {
  const classes = useStyles();
  const items = useItems()
  // console.log(items);
  const valueArray = [];
  const nameArray = [];
  items.map((row)=>(
    valueArray.push(row.quantity)
  )
  );
  items.map((row)=>(
    nameArray.push(row.item)
  )
  );
  const colors = ['#25523B',
    '#358856',
    '#5AAB61',
    '#62BD69',
    '#30694B',
    '#0C3823',
    '#517f65',
    '#002915',
    '#66b983',
    '#2e8c3c']
  const options = {
    chart: {
      type: 'bar',
      id: 'items',
      toolbar: {
        show: false
      },
    },
    plotOptions: {
      bar: {
        columnWidth: '45%',
        distributed: true
      }
    },
    colors: colors,
    xaxis: {
      categories: nameArray,
      labels: {
        style: {
          fontSize: '15px'
        }
      }
    },
    legend: {
      show: false
    },
    title: {
      text: 'Top 10 Most Recycled Items',
      align: 'center',
      style: {
        fontFamily: 'Oswald',
        fontSize: 25
      }
    },
  }
  const series = [{
    data: valueArray
  }]
  return (
    <Container className={classes.contain}>
      <Chart options={options} series={series} type="bar" width={900} height={320} className={classes.table}/>
    </Container>
  );
}