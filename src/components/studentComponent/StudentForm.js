import React, { useState } from 'react';

const StudentForm = ({ onAddStudent, parents, routes }) => {
    const [studentName, setStudentName] = useState('');
    const [selectedParentId, setSelectedParentId] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (studentName.trim() === '' || selectedParentId === '') {
            alert("Please provide a student name and select a parent.");
            return;
        }
        onAddStudent(studentName, selectedParentId);
        setStudentName('');
        setSelectedParentId('');
    };

    return (
        <div className="p-6">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="New Student's Name"
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <select
                    value={selectedParentId}
                    onChange={(e) => setSelectedParentId(e.target.value)}
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="">-- Assign to Parent --</option>
                    {parents.map(parent => (
                        <option key={parent.id} value={parent.id}>{parent.displayName || parent.email}</option>
                    ))}
                </select>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    Add Student
                </button>
            </form>
        </div>
    );
};

export default StudentForm;