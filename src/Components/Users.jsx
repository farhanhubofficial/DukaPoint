import React, { useState, useEffect } from "react";
import { useFetchCurtainsQuery } from "../Store/Api/CurtSlice"; // RTK Query hook to fetch curtains
import { useAddSaleMutation, useFetchSalesQuery } from "../Store/Api/salesSlice"; // RTK Query hooks for sales
import { getAuth } from "firebase/auth"; // Firebase auth to get the current user
import CurtainTile from "./CurtainTile"; // Component to display individual curtains
import SalesModal from "./SalesModal"; // Modal component for sales
import { useFetchProfitsQuery } from "../Store/Api/profitSlice";
import { useFetchLossesQuery } from "../Store/Api/lossesSlice";

function Users() {
  const { data: allcurtains = [] } = useFetchCurtainsQuery(); // Fetch curtains
  const { data: allSales = [] } = useFetchSalesQuery(); // Fetch all sales
  const { data: allProfits = [] } = useFetchProfitsQuery(); // Fetch all profits
  const { data: allLoses = [], isLoading: isLoadingLosses } = useFetchLossesQuery(); // Fetch losses
  
  const [search, setSearch] = useState(""); // Search input state
  const [filteredCurtains, setFilteredCurtains] = useState([]); // Filtered curtains state
  const [selectedCurtain, setSelectedCurtain] = useState(null); // Currently selected curtain
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [addSale] = useAddSaleMutation(); // Mutation for adding sales
  
  const [totalSales, setTotalSales] = useState(0); // State for total sales
  const [totalProfits, setTotalProfits] = useState(0); // State for total profits
  const [totalLoss, setTotalLoss] = useState(0); // State for total losses

  // Get the currently logged-in user using Firebase Auth
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const userEmail = currentUser ? currentUser.email : null; // Get current user's email

  // Filter curtains based on search input
  useEffect(() => {
    if (search) {
      const filtered = allcurtains.filter((curtain) =>
        curtain.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredCurtains(filtered);
    } else {
      setFilteredCurtains(allcurtains); // Show all curtains if no search term
    }
  }, [search, allcurtains]);

  // Calculate total sales, profits, and losses when data or userEmail changes
  useEffect(() => {
    // Filter sales for the current user
    const userSales = allSales.filter((sale) => sale.email === userEmail);
    const totalSalesAmount = userSales.reduce(
      (acc, sale) => acc + parseFloat(sale.sellingPrice || 0),
      0
    );
    setTotalSales(totalSalesAmount); // Update total sales state

    // Filter profits for the current user
    const userProfits = allProfits.filter((profit) => profit.email === userEmail);
    const totalProfitsAmount = userProfits.reduce(
      (acc, profit) => acc + parseFloat(profit.profit || 0),
      0
    );
    setTotalProfits(totalProfitsAmount); // Update total profits state

    // Filter losses for the current user
    if (!isLoadingLosses && userEmail) {
      const userLosses = allLoses.filter((loss) => loss.email === userEmail);
      const totalLossAmount = userLosses.reduce(
        (acc, loss) => acc + parseFloat(loss.loss || 0),
        0
      );
      setTotalLoss(totalLossAmount); // Update total loss state
    }
  }, [allSales, allProfits, allLoses, userEmail, isLoadingLosses]);

  // Log the losses for debugging purposes
  useEffect(() => {
    console.log("All Losses Data:", allLoses); // Log all losses data for debugging
    console.log("Is Loading Losses:", isLoadingLosses); // Log loading state
    console.log("Filtered Losses for User:", allLoses.filter((loss) => loss.email === userEmail)); // Log filtered losses for the current user
  }, [allLoses, userEmail, isLoadingLosses]);

  // Handle selecting a curtain to open modal
  const handleSelectCurtain = (curtain) => {
    console.log("Selected Curtain:", curtain); // Log the selected curtain for debugging
    setSelectedCurtain(curtain);
    setIsModalOpen(true); // Open the modal
  };

  // Handle sales submission
  const handleAddSale = async (saleDetails) => {
    try {
      // Add the logged-in user's email to the sale details
      const saleWithUser = {
        ...saleDetails,
        email: userEmail, // Associate sale with user's email
      };
      await addSale(saleWithUser).unwrap(); // Add sale via RTK Query mutation
      console.log("Sale submitted successfully:", saleWithUser);
      setIsModalOpen(false); // Close the modal after successful sale
      setSelectedCurtain(null); // Clear selected curtain after sale
    } catch (error) {
      console.error("Failed to submit sale:", error); // Log error if sale submission fails
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Curtain Sales Page</h2>

      {/* Display sales made by the logged-in user */}
      {userEmail && (
        <div className="top-4 p-4 bg-blue-100 rounded-md flex justify-around">
          <div>
            <h3 className="text-lg font-semibold">Your Sales</h3>
            {totalSales > 0 ? (
              <ul>ksh {Intl.NumberFormat().format(totalSales)}</ul>
            ) : (
              <p>No sales recorded yet.</p>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold">Your Profits</h3>
            {totalProfits > 0 ? (
              <ul>ksh {Intl.NumberFormat().format(totalProfits)}</ul>
            ) : (
              <p>No profit recorded yet.</p>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold">Your Losses</h3>
            {totalLoss > 0 ? (
              <ul>ksh {Intl.NumberFormat().format(totalLoss)}</ul>
            ) : (
              <p>No loss recorded yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Curtain Search Input */}
      <input
        type="text"
        placeholder="Search for a curtain"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded-lg w-full mb-4"
      />

      {/* Curtain List */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredCurtains.length > 0 ? (
          filteredCurtains.map((curtain) => (
            <div
              key={curtain.id}
              className="cursor-pointer p-4 border rounded-lg hover:bg-gray-100"
            >
              <CurtainTile product={curtain} />
              <button
                className="bg-green-500 text-white rounded-md px-4 py-2 mt-2"
                onClick={() => handleSelectCurtain(curtain)} // Handle selecting a curtain for sale
              >
                Sale
              </button>
            </div>
          ))
        ) : (
          <p>No curtains found</p>
        )}
      </div>

      {/* Sales Modal */}
      {selectedCurtain && (
        <SalesModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)} // Close the modal
          product={selectedCurtain} // Pass the selected curtain
          onSubmitSale={handleAddSale} // Submit sale details
        />
      )}
    </div>
  );
}

export default Users;
