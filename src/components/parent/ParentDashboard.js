import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, where, onSnapshot, doc } from "firebase/firestore";
import { auth, db } from 'firebaseConfig';
import StudentCard from './StudentCard';

const ParentDashboard = ({ roles, setViewingAs }) => {
    const [students, setStudents] = useState([]);
    const [routes, setRoutes] = useState({});
    const [buses, setBuses] = useState({});
    const [drivers, setDrivers] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                const studentsQuery = query(collection(db, 'students'), where('parentId', '==', user.uid));
                const unsubscribeStudents = onSnapshot(studentsQuery, (snapshot) => {
                    const studentData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setStudents(studentData);

                    studentData.forEach(student => {
                        if (student.assignedRouteId) {
                            onSnapshot(doc(db, 'routes', student.assignedRouteId), (routeDoc) => {
                                setRoutes(prev => ({ ...prev, [student.assignedRouteId]: { id: routeDoc.id, ...routeDoc.data() } }));
                            });

                            const busQuery = query(collection(db, 'buses'), where('assignedRouteId', '==', student.assignedRouteId));
                            onSnapshot(busQuery, (busSnapshot) => {
                                if (!busSnapshot.empty) {
                                    const busDoc = busSnapshot.docs[0];
                                    const busData = {id: busDoc.id, ...busDoc.data()};
                                    setBuses(prev => ({...prev, [student.assignedRouteId]: busData}));
                                    
                                    // Fetch driver info from 'users' collection
                                    if(busData.assignedDriverId) {
                                        onSnapshot(doc(db, 'users', busData.assignedDriverId), (driverDoc) => {
                                            if (driverDoc.exists()) {
                                                setDrivers(prev => ({...prev, [busData.assignedDriverId]: {id: driverDoc.id, ...driverDoc.data()}}));
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    });
                    setLoading(false);
                });
                return () => unsubscribeStudents();
            }
        });
        return () => unsubscribeAuth();
    }, []);

    const handleLogout = () => {
        signOut(auth);
    };
    
    if (loading) {
        return <div className="text-center p-8">Loading Student Information...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-sm">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-900">Parent Dashboard</h1>
                    <div>
                        {roles.includes('admin') && (
                            <button onClick={() => setViewingAs('admin')} className="text-sm font-medium text-green-600 hover:text-green-500 mr-4">
                                Switch to Admin View
                            </button>
                        )}
                        <button onClick={handleLogout} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Log Out</button>
                    </div>
                </div>
            </header>
            <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {students.length > 0 ? (
                    students.map(student => {
                        const route = routes[student.assignedRouteId];
                        const bus = buses[student.assignedRouteId];
                        const driver = bus ? drivers[bus.assignedDriverId] : null;
                        return (
                            <StudentCard 
                                key={student.id}
                                student={student}
                                route={route}
                                bus={bus}
                                driver={driver}
                            />
                        )
                    })
                ) : (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <p>No students are currently assigned to your account.</p>
                        <p className="text-sm text-gray-500 mt-2">Please contact your school administrator to get set up.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ParentDashboard;