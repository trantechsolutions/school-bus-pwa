import React, { useState, useEffect } from 'react';
import { db } from 'firebaseConfig';
import { collection, query, where, onSnapshot, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

import BusForm from './busComponents/BusForm';
import BusList from './busComponents/BusList';

const BusManager = () => {
    const [buses, setBuses] = useState([]);
    const [drivers, setDrivers] = useState([]); // This will now be a list of users with the 'driver' role
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubBuses = onSnapshot(collection(db, 'buses'), (snapshot) => {
            setBuses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        // Fetch users with the 'driver' role
        const driversQuery = query(collection(db, 'users'), where('roles', 'array-contains', 'driver'));
        const unsubDrivers = onSnapshot(driversQuery, (snapshot) => {
            setDrivers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        const unsubRoutes = onSnapshot(collection(db, 'routes'), (snapshot) => {
            setRoutes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        setTimeout(() => setLoading(false), 1500);

        return () => {
            unsubBuses();
            unsubDrivers();
            unsubRoutes();
        };
    }, []);
    
    const handleAddBus = async (busNumber) => {
        await addDoc(collection(db, 'buses'), { 
            busNumber: busNumber,
            assignedRouteId: '',
            assignedDriverId: ''
        });
    };

    const handleUpdateBus = async (id, field, value) => {
        await updateDoc(doc(db, 'buses', id), { [field]: value });
    };

    const handleDeleteBus = async (id) => {
        if (window.confirm("Are you sure you want to delete this bus?")) {
            await deleteDoc(doc(db, 'buses', id));
        }
    };

    if (loading) {
        return <p className="text-center mt-8">Loading bus and assignment data...</p>;
    }

    return (
        <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">Bus Management</h2>
            </div>
            <BusForm onAddBus={handleAddBus} />
            <BusList 
                buses={buses}
                routes={routes}
                drivers={drivers}
                onUpdate={handleUpdateBus}
                onDelete={handleDeleteBus}
            />
        </div>
    );
};

export default BusManager;