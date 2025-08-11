import React, { useState } from 'react';

const StudentListItem = ({ student, parents, routes, onUpdate, onDelete }) => {
    const [selectedRouteId, setSelectedRouteId] = useState(student.assignedRouteId || '');
    
    const availableStops = routes.find(r => r.id === selectedRouteId)?.stops || [];

    const handleUpdate = (field, value) => {
        // If the route is changed, we must reset the stop assignment
        if (field === 'assignedRouteId') {
            onUpdate(student.id, { assignedRouteId: value, assignedStopId: '' });
            setSelectedRouteId(value);
        } else {
            onUpdate(student.id, { [field]: value });
        }
    };

    return (
        <tr>
            <td className="px-6 py-4 whitespace-nowrap">{student.studentName}</td>
            <td className="px-6 py-4 whitespace-nowrap">
                <select
                    value={student.parentId || ''}
                    onChange={(e) => handleUpdate('parentId', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                >
                    <option value="">-- Unassigned --</option>
                    {parents.map(p => <option key={p.id} value={p.id}>{p.displayName || p.email}</option>)}
                </select>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                 <select
                    value={selectedRouteId}
                    onChange={(e) => handleUpdate('assignedRouteId', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                >
                    <option value="">-- Select Route --</option>
                    {routes.map(r => <option key={r.id} value={r.id}>{r.routeName}</option>)}
                </select>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <select
                    value={student.assignedStopId || ''}
                    onChange={(e) => handleUpdate('assignedStopId', e.target.value)}
                    disabled={!selectedRouteId}
                    className="w-full p-2 border border-gray-300 rounded-md disabled:bg-gray-100"
                >
                    <option value="">-- Select Stop --</option>
                    {availableStops.map(s => <option key={s.id} value={s.id}>{s.location}</option>)}
                </select>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right">
                <button onClick={() => onDelete(student.id)} className="text-red-600 hover:text-red-900">Delete</button>
            </td>
        </tr>
    );
};

export default StudentListItem;