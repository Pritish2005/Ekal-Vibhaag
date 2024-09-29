// components/ConfirmationModal.js
'use client';
import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 shadow-lg w-1/3">
                <h2 className="text-lg font-semibold mb-4">Confirm Action</h2>
                <p>{message}</p>
                <div className="mt-6 flex justify-end">
                    <button 
                        onClick={onClose} 
                        className="bg-gray-300 text-black px-4 py-2 rounded-lg mr-2">
                        Cancel
                    </button>
                    <button 
                        onClick={onConfirm} 
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                        Proceed
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
