import React, { useState } from 'react';

// --- Sub-component: UserListItem ---
const UserListItem = ({ user, onUpdateRoles }) => {
    const allRoles = ['admin', 'parent', 'driver'];
    const [userRoles, setUserRoles] = useState(user.roles || []);

    const handleRoleChange = (role, isChecked) => {
        let updatedRoles;
        if (isChecked) {
            updatedRoles = [...userRoles, role];
        } else {
            updatedRoles = userRoles.filter(r => r !== role);
        }
        setUserRoles(updatedRoles);
        onUpdateRoles(user.id, updatedRoles);
    };

    return (
        <tr>
            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{user.displayName || user.email}</td>
            <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-4">
                    {allRoles.map(role => (
                        <label key={role} className="flex items-center">
                            <input
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                checked={userRoles.includes(role)}
                                onChange={(e) => handleRoleChange(role, e.target.checked)}
                            />
                            <span className="ml-2 text-sm text-gray-700 capitalize">{role}</span>
                        </label>
                    ))}
                </div>
            </td>
        </tr>
    );
};

export default UserListItem;