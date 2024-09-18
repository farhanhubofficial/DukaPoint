import React, { useEffect, useState } from 'react';
import { useFetchSalesQuery } from '../Store/Api/salesSlice';
import { formatDistanceToNow } from 'date-fns'; // For calculating "time ago"
import { Bar } from 'react-chartjs-2'; // Importing Bar chart from react-chartjs-2
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function SalesHistory() {
  const { data: sales = [] } = useFetchSalesQuery();
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [selectedMonth, setSelectedMonth] = useState(''); // Empty string for total yearly sales
  const [monthlySales, setMonthlySales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // Get the current month

  // Update the current time every minute to trigger re-renders
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(Date.now()); // This will cause a re-render every minute
    }, 60000); // 60000ms = 1 minute

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, []);

  // Set the default selected month to the current month
  useEffect(() => {
    setSelectedMonth(currentMonth.toString()); // Set the default month to the current month
  }, [currentMonth]);

  // Calculate total sales for each month and the total yearly sales
  useEffect(() => {
    const salesPerMonth = Array(12).fill(0); // Initialize an array for 12 months
    let yearlySales = 0;

    sales.forEach((sale) => {
      const saleDate = new Date(sale.timeCreated);
      const month = saleDate.getMonth(); // Get the month from the sale date
      salesPerMonth[month] += parseFloat(sale.sellingPrice || 0); // Accumulate the sales for each month
      yearlySales += parseFloat(sale.sellingPrice || 0); // Accumulate the total yearly sales
    });

    setMonthlySales(salesPerMonth); // Set the calculated sales per month
    setFilteredSales(yearlySales); // Set the total yearly sales
  }, [sales]);

  // Filter sales when the selected month changes
  useEffect(() => {
    const filterSalesByMonth = (salesList, month) => {
      if (month === '') return salesList; // If "Total Yearly Sales" is selected, return all sales

      return salesList.filter((sale) => {
        const saleDate = new Date(sale.timeCreated);
        return saleDate.getMonth() === month; // Compare month with integer
      });
    };

    if (selectedMonth === '') {
      setFilteredSales(sales); // Display total sales for the year
    } else {
      setFilteredSales(filterSalesByMonth(sales, parseInt(selectedMonth)));
    }
  }, [sales, selectedMonth]);

  // Function to handle month selection
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value); // Set the selected month
  };

  // Function to convert month number to month name
  const getMonthName = (month) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    return monthNames[parseInt(month)] || ''; // Return the month name, or empty string if invalid
  };

  // Sort the sales by timeCreated in descending order (newest first)
  const sortedSales = [...filteredSales].sort((a, b) => new Date(b.timeCreated) - new Date(a.timeCreated));

  // Calculate the total sales for the selected month or the year
  const totalSales = selectedMonth === '' 
    ? filteredSales.reduce((total, sale) => total + parseFloat(sale.sellingPrice || 0), 0) 
    : monthlySales[selectedMonth];

  // Bar chart data
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Sales (Ksh)',
        data: monthlySales,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Bar chart options
  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Sales History</h2>

      {/* Bar chart displaying sales data */}
      <div className="mb-8">
        <Bar data={data} options={options} />
      </div>

      {/* Display total sales for the selected month or the year */}
      <div className="mb-4 text-center text-xl font-semibold">
        {selectedMonth === '' 
          ? `Total Sales for ${currentYear}: Ksh ${totalSales.toFixed(2)}`
          : `Total Sales for ${getMonthName(selectedMonth)}: Ksh ${totalSales.toFixed(2)}`
        }
      </div>

      {/* Dropdown to select a month or total yearly sales */}
      <div className="flex justify-center mb-4">
        <button
          className={`p-2 rounded-lg mx-2 ${selectedMonth === '' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setSelectedMonth('')}
        >
          Total Yearly Sales
        </button>

        <select
          value={selectedMonth}
          onChange={handleMonthChange}
          className="p-2 border border-gray-300 rounded-lg"
        >
          {Array.from({ length: 12 }, (_, index) => (
            <option key={index} value={index}>
              {getMonthName(index)}
            </option>
          ))}
        </select>
      </div>

      {/* Check if there are no sales for the selected month */}
      {filteredSales.length === 0 && selectedMonth !== '' ? (
        <p className="text-center text-lg text-gray-500">
          No Sales For {getMonthName(selectedMonth)}
        </p>
      ) : (
        <div className="space-y-4">
          {sortedSales.map((sale) => {
            const createdAtDate = new Date(sale.timeCreated);
            const isValidDate = !isNaN(createdAtDate.getTime()); // Check if the date is valid

            return (
              <div key={sale.id} className="bg-gray-100 p-4 rounded-lg shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold">Product Name: {sale.name}</h3>
                    <p className="text-lg">Selling Price: Ksh {sale.sellingPrice}</p>
                    <p className="text-lg">Email: {sale.email}</p>
                    <p className="text-sm text-gray-600">
                      Created: {createdAtDate.toLocaleString()} {/* Shows the exact time */}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {isValidDate
                      ? formatDistanceToNow(createdAtDate, { addSuffix: true }) // Calculate "time ago"
                      : 'Invalid date'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SalesHistory;
