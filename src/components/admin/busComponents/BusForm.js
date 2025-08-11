import React, { useState } from 'react';

const BusForm = ({ onAddBus }) => {
    const [busNumber, setBusNumber] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (busNumber.trim() === '') return;
        onAddBus(busNumber);
        setBusNumber('');
    };

    return (
        <div className="p-6">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <input
                    type="text"
                    value={busNumber}
                    onChange={(e) => setBusNumber(e.target.value)}
                    placeholder="Bus Number or Name (e.g., 'Bus 7')"
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    Add Bus
                </button>
            </form>
        </div>
    );
};

export default BusForm;