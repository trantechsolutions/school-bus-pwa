import React, { useState } from 'react';
import { signOut } from "firebase/auth";
import { auth } from 'firebaseConfig';
import Sidebar from 'components/admin/Sidebar';
import RouteManager from 'components/admin/RouteManager';
import BusManager from 'components/admin/BusManager';
import StudentManager from 'components/admin/StudentManager';
import UserAdmin from 'components/admin/UserAdmin';

const AdminDashboard = ({ roles, setViewingAs }) => {
    const [activeView, setActiveView] = useState('Users'); // Default to Users view

    const handleLogout = () => {
        signOut(auth);
    };

    const renderView = () => {
        switch (activeView) {
            case 'Users':
                return <UserAdmin />;
            case 'Buses':
                return <BusManager />;
            case 'Routes':
                return <RouteManager />;
            case 'Students':
                return <StudentManager />;
            default:
                return <UserAdmin />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar 
                activeView={activeView} 
                setActiveView={setActiveView} 
                onLogout={handleLogout}
                roles={roles}
                setViewingAs={setViewingAs}
            />
            <main className="flex-1 p-8 overflow-y-auto">
                {renderView()}
            </main>
        </div>
    );
};

export default AdminDashboard;