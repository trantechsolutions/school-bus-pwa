import React from 'react';

const RouteList = ({ routes, onSelectRoute, onNewRoute, onDeleteRoute, selectedRouteId }) => {
    return (
        <div className="w-1/3 bg-gray-50 border-r border-gray-200 p-4 flex flex-col">
            <button
                onClick={onNewRoute}
                className="w-full mb-4 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
                + New Route
            </button>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Existing Routes</h3>
            <ul className="flex-grow overflow-y-auto">
                {routes.map(route => (
                    <li key={route.id} className={`p-2 rounded-md mb-2 cursor-pointer ${selectedRouteId === route.id ? 'bg-indigo-100' : 'hover:bg-gray-100'}`}>
                        <div className="flex justify-between items-center" onClick={() => onSelectRoute(route)}>
                            <span className="font-medium text-gray-800">{route.routeName}</span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent selection when deleting
                                    onDeleteRoute(route.id);
                                }}
                                className="text-red-500 hover:text-red-700 text-xs"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RouteList;