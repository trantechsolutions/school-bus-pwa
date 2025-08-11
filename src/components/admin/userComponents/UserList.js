import React from 'react';
import UserListItem from './UserListItem';

const UserList = ({ users, onUpdateRoles }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roles</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {users.map(user => (
                    <UserListItem key={user.id} user={user} onUpdateRoles={onUpdateRoles} />
                ))}
            </tbody>
        </table>
    </div>
);

export default UserList;