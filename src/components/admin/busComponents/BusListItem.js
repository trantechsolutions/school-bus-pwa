import React from 'react';

const BusListItem = ({ bus, routes, drivers, onUpdate, onDelete }) => {
    
    const handleAssignmentChange = (field, value) => {
        onUpdate(bus.id, field, value);
    };

    return (
        <tr key={bus.id}>
            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{bus.busNumber}</td>
            <td className="px-6 py-4 whitespace-nowrap">
                <select
                    value={bus.assignedRouteId || ''}
                    onChange={(e) => handleAssignmentChange('assignedRouteId', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="">-- Select Route --</option>
                    {routes.map(route => (
                        <option key={route.id} value={route.id}>{route.routeName}</option>
                    ))}
                </select>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                 <select
                    value={bus.assignedDriverId || ''}
                    onChange={(e) => handleAssignmentChange('assignedDriverId', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="">-- Select Driver --</option>
                    {drivers.map(driver => (
                        <option key={driver.id} value={driver.id}>{driver.displayName || driver.email}</option>
                    ))}
                </select>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onClick={() => onDelete(bus.id)} className="text-red-600 hover:text-red-900">Delete</button>
            </td>
        </tr>
    );
};

export default BusListItem;