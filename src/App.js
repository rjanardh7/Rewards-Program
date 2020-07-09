import React from 'react';
import logo from './logo.svg';
import './App.css';

import CustomersData from './data/customers'
import OrdersData from './data/orders'
function App() {
  const customerList = CustomersData.customers
  const orderList = OrdersData.orders
  const monthNames = {
    "01": "January", "02": "February", "03": "March", "04": "April", "05": "May", "06": "June",
    "07": "July", "08": "August", "09": "September", "10": "October", "11": "November", "12": "December"
  };

  let gridColumns = [];
  const formatData = () => {
    const groupByCustomer = orderList.reduce((groupByCustomer, order) => {
      groupByCustomer[order.customerId] = groupByCustomer[order.customerId] || [];
      groupByCustomer[order.customerId].push(order);
      return groupByCustomer;
    }, {})


    const customersOrders = customerList.map(customer => {
      const customerOrder = {
        id: customer.id,
        name: customer.name,
        rewardPoints: {

        },
        total: 0

      }
      
      const transactionData = groupByCustomer[customer.id].reduce((transactionData, order) => {
        // get month name
        const orderDate = order.orderDate.split('-');
        const monthName = monthNames[orderDate[1]];
        transactionData['rewardPoints'] = transactionData['rewardPoints'] || {}
        transactionData['rewardPoints'][monthName] = transactionData['rewardPoints'][monthName] || 0;
        transactionData.total = transactionData.total || 0;
        
         const orderRewardPoints = getOrderRewardPoints(order.transationAmount); 
        transactionData['rewardPoints'][monthName] += orderRewardPoints;
        transactionData.total += orderRewardPoints;
        return transactionData;
      }, {});

      customerOrder.rewardPoints = transactionData['rewardPoints'];
      customerOrder.total = transactionData.total;
      return customerOrder;

    })

    gridColumns = Object.keys(customersOrders[0]);
    console.log(customersOrders)
    return customersOrders; 
  }

  const getOrderRewardPoints = (amount) =>{
    if (amount <= 50) { return 0 }
    else if (amount > 50  &&  amount <= 100) {
      return (amount - 50);
    }
    else {
      return 2 * (amount - 100) + 50;
    }

  }

  const customersOrders = formatData();
  return (
    <div className="App">
      <header className="App-header">
        Customers Order History of last 3 Months
      </header>
      <table id="customers">
        <thead>
  <tr>
            {gridColumns && gridColumns.length && gridColumns.map(col => {
              
              if (col === 'rewardPoints') {
                return <th className="reward-points" key={col}>
                  <div>{col.toUpperCase()}</div>
                  <div>{Object.keys(customersOrders[0][col]).map(month => <span key={month} className="month-value">{month}</span>)}</div>
                </th>
              }
              return <th key={col}>{col.toUpperCase()}</th>
            })}
   
        </tr>
        </thead>

        <tbody>
        {customersOrders && customersOrders.length && customersOrders.map(col => (<tr key={col.id}>
          
          <td >{col.id}</td>
          <td>{col.name}</td>
          <td><div>{Object.keys(col.rewardPoints).map(month => <span className="month-value" key={month}>{col.rewardPoints[month]}</span>)}</div></td>
          <td>{col.total}</td>
        </tr>
        ))}
          
        </tbody>
  
  
</table>
    </div>
  );
}

export default App;
