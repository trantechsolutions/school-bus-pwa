import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { auth, db } from 'firebaseConfig';

const DriverDashboard = () => {
    const [bus, setBus] = useState(null);
    const [route, setRoute] = useState(null);
    const [loading, setLoading] = useState(true);
    const [direction, setDirection] = useState('pickup'); // 'pickup' or 'dropoff'

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                const busQuery = query(collection(db, 'buses'), where('assignedDriverId', '==', user.uid));
                const unsubscribeBus = onSnapshot(busQuery, (busSnapshot) => {
                    if (!busSnapshot.empty) {
                        const busDoc = busSnapshot.docs[0];
                        const busData = { id: busDoc.id, ...busDoc.data() };
                        setBus(busData);

                        if (busData.assignedRouteId) {
                            const unsubscribeRoute = onSnapshot(doc(db, 'routes', busData.assignedRouteId), (routeDoc) => {
                                setRoute({ id: routeDoc.id, ...routeDoc.data() });
                                setLoading(false);
                            });
                            return () => unsubscribeRoute();
                        }
                    }
                    setLoading(false);
                });
                return () => unsubscribeBus();
            }
        });
        return () => unsubscribeAuth();
    }, []);

    const handleRouteControl = async (action) => {
        if (!bus || !route) return;
        const busDocRef = doc(db, 'buses', bus.id);
        const currentStopIndex = bus.currentStopIndex ?? -1;
        const totalStops = route.stops.length;

        if (action === 'start') {
            const startIndex = direction === 'pickup' ? 0 : totalStops - 1;
            await updateDoc(busDocRef, { liveStatus: 'IN_PROGRESS', currentStopIndex: startIndex, direction });
        } else if (action === 'next') {
            const nextIndex = direction === 'pickup' ? currentStopIndex + 1 : currentStopIndex - 1;
            if (nextIndex >= 0 && nextIndex < totalStops) {
                await updateDoc(busDocRef, { currentStopIndex: nextIndex });
            } else {
                await updateDoc(busDocRef, { liveStatus: 'COMPLETED', currentStopIndex: -1, direction: null });
            }
        }
    };
    
    if (loading) return <div className="text-center p-8">Loading Your Route...</div>;

    const currentStopIndex = bus?.currentStopIndex ?? -1;
    const routeStops = direction === 'pickup' ? route?.stops : [...(route?.stops || [])].reverse();

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4">
            <header className="w-full max-w-2xl flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Driver View</h1>
                <button onClick={() => signOut(auth)} className="text-sm font-medium text-red-400 hover:text-red-300">Log Out</button>
            </header>

            {!bus || !route ? (
                <p>No route assigned for today.</p>
            ) : (
                <div className="w-full max-w-2xl">
                    <div className="bg-gray-800 rounded-lg p-6 mb-6 text-center">
                        <p className="text-gray-400">Your Route</p>
                        <h2 className="text-3xl font-bold">{route.routeName}</h2>
                        <p className="text-lg text-gray-300">Bus {bus.busNumber}</p>
                    </div>

                    {bus.liveStatus !== 'IN_PROGRESS' && (
                        <div className="mb-4 p-4 bg-gray-800 rounded-lg">
                            <p className="text-center mb-2 font-semibold">Select Route Type</p>
                            <div className="flex gap-4">
                                <button onClick={() => setDirection('pickup')} className={`w-full py-3 rounded-md font-bold ${direction === 'pickup' ? 'bg-indigo-600' : 'bg-gray-700'}`}>Morning Pickup</button>
                                <button onClick={() => setDirection('dropoff')} className={`w-full py-3 rounded-md font-bold ${direction === 'dropoff' ? 'bg-indigo-600' : 'bg-gray-700'}`}>Afternoon Dropoff</button>
                            </div>
                        </div>
                    )}

                    <div className="mb-8">
                        {bus.liveStatus !== 'IN_PROGRESS' ? (
                             <button onClick={() => handleRouteControl('start')} className="w-full py-4 text-2xl font-bold bg-green-600 hover:bg-green-700 rounded-lg">
                                START ROUTE
                            </button>
                        ) : (
                            <button onClick={() => handleRouteControl('next')} className="w-full py-4 text-2xl font-bold bg-indigo-600 hover:bg-indigo-700 rounded-lg">
                                ARRIVED AT NEXT STOP
                            </button>
                        )}
                    </div>
                    
                    <div className="space-y-4">
                        {routeStops?.map((stop, index) => {
                            const originalIndex = direction === 'pickup' ? index : route.stops.length - 1 - index;
                            const isCompleted = direction === 'pickup' ? originalIndex < currentStopIndex : originalIndex > currentStopIndex;
                            const isCurrent = originalIndex === currentStopIndex;
                            
                            return (
                                <div key={stop.id} className={`p-4 rounded-lg flex items-center justify-between transition-all duration-300 ${isCurrent ? 'bg-indigo-500 scale-105' : isCompleted ? 'bg-gray-700 opacity-50' : 'bg-gray-800'}`}>
                                    <div>
                                        <p className={`font-bold text-lg ${isCompleted ? 'line-through' : ''}`}>{stop.location}</p>
                                        <p className="text-gray-400">Scheduled: {direction === 'pickup' ? stop.pickupTime : stop.dropoffTime}</p>
                                    </div>
                                    {isCurrent && <div className="text-sm font-bold bg-white text-indigo-600 px-2 py-1 rounded">NEXT STOP</div>}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DriverDashboard;