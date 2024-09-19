import React,{useState,useEffect} from 'react'
import { useNavigate, Outlet } from 'react-router-dom'; // Import Outlet for nested routes
import { useSelector } from 'react-redux';
import { useFetchSalesQuery } from '../Store/Api/salesSlice';
import { useFetchProfitsQuery } from '../Store/Api/profitSlice';
import { useFetchLossesQuery } from '../Store/Api/lossesSlice';
import { useFetchCurtainsQuery } from '../Store/Api/CurtSlice';

function SalesOverview() {




    const { data: sales = [] } = useFetchSalesQuery();
  const { data: profits = [] } = useFetchProfitsQuery();
  const { data: losses = [] } = useFetchLossesQuery();
  const { data: allcurtains = [] } = useFetchCurtainsQuery();
  const [totalSales, setTotalSales] = useState(0);
  const [totalProfits, setTotalProfits] = useState(0);
  const [TotalLoss, setTotalLoss] = useState(0);
  const [search, setSearch] = useState('');
  const [filteredCurtains, setFilteredCurtains] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [category, setCategory] = useState('All'); // New state for category filter

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const total = sales.reduce(
      (acc, sale) => acc + parseFloat(sale.sellingPrice || 0),
      0
    );
    setTotalSales(total);

    const totalProfit = profits.reduce(
      (acc, profit) => acc + parseFloat(profit.profit || 0),
      0
    );
    setTotalProfits(totalProfit);

    const TotalLosses = losses.reduce(
      (acc, loss) => acc + parseFloat(loss.loss || 0),
      0
    );
    setTotalLoss(TotalLosses);
  }, [sales, profits, losses]);
const navigate = useNavigate()
  return (
<div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 mb-6 border border-gray-300 h-[70vh]">
          <h2 className="text-xl font-semibold mb-4">Sales Overview</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-100 p-4 rounded-lg shadow relative">
              <h3 className="text-lg font-bold">Total Sales</h3>
              <p className="text-2xl">Ksh {totalSales.toFixed(2)}</p>
              <div className="absolute top-2 right-2">
                <button onClick={toggleMenu} className="focus:outline-none">
                  <span className="text-black font-bold text-lg">⋮</span>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg">
                    <ul className="py-2">
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => alert('Sales Settings Clicked')}
                      >
                        Sales Settings
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => navigate('/admin/salesHistory')}
                      >
                        Sales History
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg shadow">
              <h3 className="text-lg font-bold">Total Purchases</h3>
              <p className="text-2xl">50</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg shadow">
              <h3 className="text-lg font-bold">Total Profit</h3>
              <p className="text-2xl">Ksh {totalProfits}</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg shadow">
              <h3 className="text-lg font-bold">Total Losses</h3>
              <p className="text-2xl">Ksh {TotalLoss}</p>
            </div>
          </div>
        </div>  )
}

export default SalesOverview