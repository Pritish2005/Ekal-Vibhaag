"use client";
import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc } from "@firebase/firestore";
import { app } from "../../../lib/firebaseConfig";
import { useSession } from "next-auth/react";

// Firebase configuration
const db = getFirestore(app);

function Inventory() {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [currentTime, setCurrentTime] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [newItem, setNewItem] = useState({
    name: "",
    unitCost: "",
    currentQuantity: "",
    usedQuantity: "",
    providedQuantity: "",
  });

  const { data: session } = useSession();
  const UserDepartment = session ? session.user.department : null;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(`${now.toLocaleDateString()} ${now.toLocaleTimeString()}`);
    };

    const intervalId = setInterval(updateTime, 1000);
    updateTime(); // Set initial time

    return () => clearInterval(intervalId);
  }, []);

  // Fetch inventory items from Firestore, filtering by department
  useEffect(() => {
    const fetchInventory = async () => {
      const querySnapshot = await getDocs(collection(db, "inventory"));
      const items = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((item) => item.department === UserDepartment);
      setInventoryItems(items);
    };

    fetchInventory();
  }, [UserDepartment]);

  const handleAddItem = () => {
    setNewItem({
      name: "",
      unitCost: "",
      currentQuantity: "",
      usedQuantity: "",
      providedQuantity: "",
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditItem = (item) => {
    setNewItem(item);
    setCurrentItemId(item.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      // Update the existing item in Firestore
      const itemRef = doc(db, "inventory", currentItemId);
      await updateDoc(itemRef, {
        name: newItem.name,
        unitCost: parseFloat(newItem.unitCost),
        currentQuantity: parseInt(newItem.currentQuantity),
        usedQuantity: parseInt(newItem.usedQuantity),
        providedQuantity: parseInt(newItem.providedQuantity),
      });
    } else {
      // Add new item to Firestore
      await addDoc(collection(db, "inventory"), {
        ...newItem,
        unitCost: parseFloat(newItem.unitCost),
        currentQuantity: parseInt(newItem.currentQuantity),
        usedQuantity: parseInt(newItem.usedQuantity),
        providedQuantity: parseInt(newItem.providedQuantity),
        department: UserDepartment, // Use department from session
      });
    }
    setIsModalOpen(false);
    // Refresh inventory list
    const querySnapshot = await getDocs(collection(db, "inventory"));
    const items = querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((item) => item.department === UserDepartment);
    setInventoryItems(items);
  };

  return (
    <div className="bg-gray-100 flex justify-center my-10">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden w-5/6">
        <div className="bg-blue-500 text-white py-4 px-6">
          <h1 className="text-xl font-semibold">DEPARTMENT INVENTORY</h1>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-700">
              All Inventory Items
            </h2>
            <div className="text-right text-sm text-gray-500">
              <p>{currentTime}</p>
            </div>
          </div>
          <button
            onClick={handleAddItem}
            className="bg-green-500 text-white px-4 py-2 rounded-full mb-4"
          >
            Add Inventory
          </button>
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Item ID</th>
                <th className="py-3 px-6 text-left">Item Name</th>
                <th className="py-3 px-6 text-left">Unit Cost</th>
                <th className="py-3 px-6 text-center">Current Quantity</th>
                <th className="py-3 px-6 text-center">Used Quantity</th>
                <th className="py-3 px-6 text-center">Provided Quantity</th>
                <th className="py-3 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {inventoryItems.length > 0 ? (
                inventoryItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      <span className="font-medium">{item.id}</span>
                    </td>
                    <td className="py-3 px-6 text-left">{item.name}</td>
                    <td className="py-3 px-6 text-left">₹{item.unitCost}</td>
                    <td className="py-3 px-6 text-center">
                      {item.currentQuantity}
                    </td>
                    <td className="py-3 px-6 text-center">
                      {item.usedQuantity}
                    </td>
                    <td className="py-3 px-6 text-center">
                      {item.providedQuantity}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-3 px-6 text-center">
                    No inventory items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for adding/editing inventory */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">
              {isEditing ? "Edit Inventory" : "Add New Inventory"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Item Name</label>
                <input
                  type="text"
                  name="name"
                  value={newItem.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Unit Cost</label>
                <input
                  type="number"
                  name="unitCost"
                  value={newItem.unitCost}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Current Quantity</label>
                <input
                  type="number"
                  name="currentQuantity"
                  value={newItem.currentQuantity}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Used Quantity</label>
                <input
                  type="number"
                  name="usedQuantity"
                  value={newItem.usedQuantity}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Provided Quantity</label>
                <input
                  type="number"
                  name="providedQuantity"
                  value={newItem.providedQuantity}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  {isEditing ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;
