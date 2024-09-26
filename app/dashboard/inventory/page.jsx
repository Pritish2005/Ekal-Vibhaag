"use client";

// pages/inventory.js
import React, { useState, useEffect } from "react";

import { getFirestore } from "@firebase/firestore";
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const Inventory = () => {
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    unitCost: "",
    currentQuantity: "",
    usedQuantity: "",
    providedQuantity: "",
  });

  // Fetch inventory items from Firestore on component mount
  useEffect(() => {
    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(db, "inventory"));
      const fetchedItems = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(fetchedItems);
    };
    fetchItems();
  }, []);

  // Add new item to Firestore
  const handleAddItem = async () => {
    setFormData({
      id: "",
      name: "",
      unitCost: "",
      currentQuantity: "",
      usedQuantity: "",
      providedQuantity: "",
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  // Edit existing item in Firestore
  const handleEdit = (item) => {
    setFormData(item);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // Submit form data to Firestore
  const handleSubmit = async () => {
    if (isEditing) {
      // Update the existing item in Firestore
      const itemRef = doc(db, "inventory", formData.id);
      await updateDoc(itemRef, {
        name: formData.name,
        unitCost: parseFloat(formData.unitCost),
        currentQuantity: parseInt(formData.currentQuantity),
        usedQuantity: parseInt(formData.usedQuantity),
        providedQuantity: parseInt(formData.providedQuantity),
      });
    } else {
      // Add new item to Firestore
      await addDoc(collection(db, "inventory"), {
        name: formData.name,
        unitCost: parseFloat(formData.unitCost),
        currentQuantity: parseInt(formData.currentQuantity),
        usedQuantity: parseInt(formData.usedQuantity),
        providedQuantity: parseInt(formData.providedQuantity),
      });
    }
    setIsModalOpen(false);
    // Refresh the items list after adding/updating
    const querySnapshot = await getDocs(collection(db, "inventory"));
    const updatedItems = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setItems(updatedItems);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-lg max-w-5xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-blue-600">
          DEPARTMENT INVENTORY
        </h1>
        <div className="text-sm text-gray-600">
          <p>Date: Sept 30, 2024</p>
          <p>Time: 10:00 AM</p>
        </div>
      </div>

      <button
        onClick={handleAddItem}
        className="bg-gray-100 text-gray-700 py-2 px-4 rounded-full hover:bg-gray-200 transition"
      >
        ADD ITEM
      </button>

      <table className="min-w-full bg-white mt-6 border-collapse border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Item ID</th>
            <th className="border px-4 py-2">Item Name</th>
            <th className="border px-4 py-2">Unit Cost</th>
            <th className="border px-4 py-2">Current Quantity</th>
            <th className="border px-4 py-2">Used Quantity</th>
            <th className="border px-4 py-2">Provided Quantity</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="text-center">
              <td className="border px-4 py-2">{item.id}</td>
              <td className="border px-4 py-2">{item.name}</td>
              <td className="border px-4 py-2">₹{item.unitCost}</td>
              <td className="border px-4 py-2">{item.currentQuantity}</td>
              <td className="border px-4 py-2">{item.usedQuantity}</td>
              <td className="border px-4 py-2">{item.providedQuantity}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-gray-100 text-gray-700 py-2 px-4 rounded-full hover:bg-gray-200 transition"
                >
                  EDIT
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl mb-4">
              {isEditing ? "Edit Item" : "Add Item"}
            </h2>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700">Item Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Unit Cost</label>
                <input
                  type="number"
                  name="unitCost"
                  value={formData.unitCost}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Current Quantity</label>
                <input
                  type="number"
                  name="currentQuantity"
                  value={formData.currentQuantity}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Used Quantity</label>
                <input
                  type="number"
                  name="usedQuantity"
                  value={formData.usedQuantity}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Provided Quantity</label>
                <input
                  type="number"
                  name="providedQuantity"
                  value={formData.providedQuantity}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg mr-4 hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                >
                  {isEditing ? "Save" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
