import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2'; // Import Bar chart
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'; // Chart.js imports
import { formatDistanceToNow } from 'date-fns'; // For calculating "time ago"
import { db } from '../firebase-config'; // Adjust the import to your Firebase configuration
import { collection, getDocs } from 'firebase/firestore';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function SalesHistory() {
  const [sales, setSales] = useState([]); // Sales data from Firestore
  const [selectedMonth, setSelectedMonth] = useState(''); // State for selected month

  // Fetch sales data from Firestore
  useEffect(() => {
    const fetchSales = async () => {
      const salesCollection = collection(db, 'sales'); // Adjust to your collection name
      const salesSnapshot = await getDocs(salesCollection);
      const salesData = salesSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp ? new Date(data.timestamp.seconds * 1000) : null, // Adjust for Firestore timestamp
        };
      });

      setSales(salesData); // Set all sales data
    };

    fetchSales();
  }, []);

  // Calculate total selling price for each month
  const monthlySales = Array(12).fill(0); // Initialize array for 12 months

  sales.forEach(sale => {
    if (sale.timestamp) {
      const month = sale.timestamp.getMonth();
      monthlySales[month] += parseFloat(sale.sellingPrice || 0); // Accumulate the selling price
    }
  });

  // Prepare data for the chart
  const chartData = {
    labels: [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    datasets: [
      {
        label: 'Total Selling Price (Ksh)',
        data: monthlySales,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Filter sales based on selected month
  const filteredSales = selectedMonth
    ? sales.filter((sale) => {
        return sale.timestamp && sale.timestamp.getMonth() === parseInt(selectedMonth);
      })
    : sales; // If no month is selected, show all sales

  // Chart options
  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Function to handle month selection
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value); // Update selected month
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Sales History</h2>

      {/* Month selection dropdown */}
     

      {/* Bar chart displaying total selling prices for each month */}
      <div className="mb-8">
        <Bar data={chartData} options={options} />
      </div>
      <div className="mb-4">
        <label className="mr-2">Select Month:</label>
        <select
          value={selectedMonth}
          onChange={handleMonthChange}
          className="p-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Months</option>
          {Array.from({ length: 12 }, (_, index) => (
            <option key={index} value={index}>
              {new Date(0, index).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
      </div>

      {/* Display filtered sales data */}
      <div className="space-y-4">
  {filteredSales.map((sale) => {
    const isValidDate = sale.timestamp && !isNaN(sale.timestamp.getTime()); // Check if the date is valid

    return (
      <div key={sale.id} className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="lg:flex justify-between items-center">
          <div className="text-white">
            <h3 className="text-2xl font-semibold">{sale.productName}</h3>
            <p className="text-lg">Selling Price: <span className="font-bold">Ksh {sale.sellingPrice}</span></p>
            <p className="text-lg">Buying Price: <span className="font-bold">Ksh {sale.buyingPrice}</span></p>
            <p className="text-lg">Sale Attendant: <span className= "font-bold text-lg text-red-400">{sale.name}</span></p>
            <p className="text-lg">Material: <span className="font-bold text-lg">{sale.material}</span></p>
            <p className="text-lg">Size: <span className="font-bold">{sale.size}</span></p>
            <p className="text-sm text-gray-300">
              Created: {isValidDate ? sale.timestamp.toLocaleString() : 'N/A'}
            </p>
          </div>
          <div className='ml-48 mt-2'>
          <span className=" text-green-200 ">
            {isValidDate
              ? formatDistanceToNow(sale.timestamp, { addSuffix: true }) // Calculate "time ago"
              : 'N/A'}
          </span>
          </div>
          
        </div>
      </div>
    );
  })}
</div>

    </div>
  );
}

export default SalesHistory;
