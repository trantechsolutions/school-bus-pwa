import React from 'react';
import BusListItem from './BusListItem';

const BusList = ({ buses, routes, drivers, onUpdate, onDelete }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bus Number</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Route</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Driver</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {buses.map((bus) => (
                        <BusListItem 
                            key={bus.id} 
                            bus={bus} 
                            routes={routes} 
                            drivers={drivers} 
                            onUpdate={onUpdate} 
                            onDelete={onDelete} 
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BusList;