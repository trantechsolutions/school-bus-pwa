import React, { useState, useEffect } from 'react';
import { db } from 'firebaseConfig';
import { collection, onSnapshot, addDoc, doc, setDoc, deleteDoc } from 'firebase/firestore';

import RouteList from './routeComponents/RouteList';
import StopListEditor from './routeComponents/StopListEditor';

const RouteManager = () => {
    const [routes, setRoutes] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [routeName, setRouteName] = useState('');
    const [stops, setStops] = useState([]);
    const [loading, setLoading] = useState(true);

    // Effect to load all routes from Firestore
    useEffect(() => {
        const routesCollectionRef = collection(db, 'routes');
        const unsubscribe = onSnapshot(routesCollectionRef, (snapshot) => {
            const routesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setRoutes(routesData);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Function to handle selecting a route from the list
    const handleSelectRoute = (route) => {
        setSelectedRoute(route);
        setRouteName(route.routeName);
        setStops(route.stops || []);
    };

    // Function to clear the form for a new route
    const handleNewRoute = () => {
        setSelectedRoute(null);
        setRouteName('');
        setStops([]);
    };

    // Function to save or update a route
    const handleSaveRoute = async () => {
        if (routeName.trim() === '' || stops.length === 0) {
            alert("A route must have a name and at least one stop.");
            return;
        }
        
        const routeData = { routeName, stops };

        if (selectedRoute) {
            // Update existing route
            await setDoc(doc(db, 'routes', selectedRoute.id), routeData);
        } else {
            // Create new route
            const newRouteRef = await addDoc(collection(db, 'routes'), routeData);
            // Select the newly created route
            handleSelectRoute({id: newRouteRef.id, ...routeData});
        }
        alert("Route saved successfully!");
    };
    
    // Function to delete a route
    const handleDeleteRoute = async (id) => {
        if (window.confirm("Are you sure you want to delete this route? This action cannot be undone.")) {
            await deleteDoc(doc(db, 'routes', id));
            // If the deleted route was the selected one, clear the form
            if(selectedRoute && selectedRoute.id === id) {
                handleNewRoute();
            }
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md h-full flex flex-col">
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">Route Management</h2>
            </div>
            <div className="flex flex-grow overflow-hidden">
                <RouteList 
                    routes={routes} 
                    onSelectRoute={handleSelectRoute} 
                    onNewRoute={handleNewRoute}
                    onDeleteRoute={handleDeleteRoute}
                    selectedRouteId={selectedRoute ? selectedRoute.id : null}
                />
                <div className="flex-grow flex flex-col">
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center gap-4">
                            <input
                                type="text"
                                value={routeName}
                                onChange={(e) => setRouteName(e.target.value)}
                                placeholder="Enter Route Name"
                                className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button 
                                onClick={handleSaveRoute}
                                className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
                            >
                                {selectedRoute ? 'Update Route' : 'Save Route'}
                            </button>
                        </div>
                    </div>
                    <div className="flex-grow overflow-y-auto">
                        <StopListEditor stops={stops} setStops={setStops} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RouteManager;