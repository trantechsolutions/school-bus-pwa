import React, { useState, useEffect } from 'react';
import { db } from 'firebaseConfig';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import UserList from './userComponents/UserList';

const UserAdmin = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const usersCollectionRef = collection(db, 'users');
        const unsubscribe = onSnapshot(usersCollectionRef, (snapshot) => {
            setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleUpdateRoles = async (userId, roles) => {
        const userDocRef = doc(db, 'users', userId);
        await updateDoc(userDocRef, { roles });
    };

    if (loading) {
        return <p className="text-center mt-8">Loading users...</p>;
    }

    return (
        <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">User Role Management</h2>
            </div>
            <UserList users={users} onUpdateRoles={handleUpdateRoles} />
        </div>
    );
};

export default UserAdmin;