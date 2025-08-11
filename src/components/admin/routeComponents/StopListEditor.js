import React from 'react';

const StopListEditor = ({ stops, setStops }) => {

    const handleAddStop = () => {
        setStops([...stops, { id: Date.now(), location: '', pickupTime: '', dropoffTime: '' }]);
    };

    const handleStopChange = (index, field, value) => {
        const newStops = [...stops];
        newStops[index][field] = value;
        setStops(newStops);
    };

    const handleRemoveStop = (index) => {
        const newStops = stops.filter((_, i) => i !== index);
        setStops(newStops);
    };

    const handleMoveStop = (index, direction) => {
        const newStops = [...stops];
        const stopToMove = newStops[index];
        const swapIndex = index + direction;

        if (swapIndex < 0 || swapIndex >= newStops.length) return;

        newStops[index] = newStops[swapIndex];
        newStops[swapIndex] = stopToMove;
        setStops(newStops);
    };

    return (
        <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Route Stops</h3>
            {stops.map((stop, index) => (
                <div key={stop.id || index} className="grid grid-cols-12 items-center gap-2 mb-2 p-2 bg-gray-50 rounded-md">
                    <span className="font-bold text-gray-500 col-span-1">{index + 1}</span>
                    <input
                        type="text"
                        placeholder="Address or Junction"
                        value={stop.location}
                        onChange={(e) => handleStopChange(index, 'location', e.target.value)}
                        className="col-span-5 px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <div className="col-span-2">
                        <label className="text-xs text-gray-500">Pickup</label>
                        <input
                            type="time"
                            value={stop.pickupTime}
                            onChange={(e) => handleStopChange(index, 'pickupTime', e.target.value)}
                            className="w-full px-2 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="col-span-2">
                         <label className="text-xs text-gray-500">Dropoff</label>
                        <input
                            type="time"
                            value={stop.dropoffTime}
                            onChange={(e) => handleStopChange(index, 'dropoffTime', e.target.value)}
                            className="w-full px-2 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="col-span-1 flex flex-col items-center">
                        <button onClick={() => handleMoveStop(index, -1)} disabled={index === 0} className="text-gray-500 hover:text-gray-800 disabled:opacity-25">▲</button>
                        <button onClick={() => handleMoveStop(index, 1)} disabled={index === stops.length - 1} className="text-gray-500 hover:text-gray-800 disabled:opacity-25">▼</button>
                    </div>
                    <button onClick={() => handleRemoveStop(index)} className="col-span-1 text-red-500 hover:text-red-700 font-bold">X</button>
                </div>
            ))}
            <button
                onClick={handleAddStop}
                className="mt-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
            >
                + Add Stop
            </button>
        </div>
    );
};

export default StopListEditor;