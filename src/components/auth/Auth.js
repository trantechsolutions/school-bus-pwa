import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore"; // Import setDoc
import { auth, db } from 'firebaseConfig';
import LoginScreen from 'components/auth/LoginScreen';
import AdminDashboard from 'components/admin/AdminDashboard';
import ParentDashboard from 'components/parent/ParentDashboard';
import DriverDashboard from 'components/driver/DriverDashboard';

const Auth = () => {
    const [user, setUser] = useState(null);
    const [roles, setRoles] = useState([]);
    const [viewingAs, setViewingAs] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const userDocRef = doc(db, 'users', currentUser.uid);
                const userDoc = await getDoc(userDocRef);
                
                let userRoles = [];

                if (userDoc.exists()) {
                    // User document already exists, get their roles
                    const userData = userDoc.data();
                    userRoles = Array.isArray(userData.roles) ? userData.roles : [];
                } else {
                    // This is a new user, create a document for them in Firestore
                    console.log("Creating new user document in Firestore for UID:", currentUser.uid);
                    const newUser = {
                        email: currentUser.email,
                        displayName: currentUser.displayName,
                        roles: ['parent'] // Default role for all new users
                    };
                    await setDoc(userDocRef, newUser);
                    userRoles = ['parent'];
                }
                
                setRoles(userRoles);
                
                // Set the default view based on roles. Prioritize admin.
                if (userRoles.includes('admin')) setViewingAs('admin');
                else if (userRoles.includes('driver')) setViewingAs('driver');
                else if (userRoles.includes('parent')) setViewingAs('parent');
                else setViewingAs(null);
                
                setUser(currentUser);
            } else {
                setUser(null);
                setRoles([]);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) return <div className="text-center p-8">Loading Application...</div>;
    if (!user) return <LoginScreen />;

    switch (viewingAs) {
        case 'admin':
            return <AdminDashboard roles={roles} setViewingAs={setViewingAs} />;
        case 'parent':
            return <ParentDashboard roles={roles} setViewingAs={setViewingAs} />;
        case 'driver':
            return <DriverDashboard />;
        default:
            return (
                <div className="text-center p-8">
                    <h2 className="text-xl font-bold">Access Denied</h2>
                    <p>Your account does not have a valid role assigned.</p>
                </div>
            );
    }
};

export default Auth;