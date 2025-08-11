import React from 'react';
import StudentListItem from './StudentListItem';

const StudentList = ({ students, parents, routes, onUpdate, onDelete }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned Parent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned Route</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned Stop</th>
                    <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {students.map(student => (
                    <StudentListItem key={student.id} student={student} parents={parents} routes={routes} onUpdate={onUpdate} onDelete={onDelete} />
                ))}
            </tbody>
        </table>
    </div>
);

export default StudentList;