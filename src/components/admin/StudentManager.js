import React, { useState, useEffect } from 'react';
import { db } from 'firebaseConfig';
import { collection, query, where, onSnapshot, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import StudentForm from 'components/studentComponent/StudentForm';
import StudentList from 'components/studentComponent/StudentList';

const StudentManager = () => {
    const [students, setStudents] = useState([]);
    const [parents, setParents] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch all students
        const unsubStudents = onSnapshot(collection(db, 'students'), snapshot => {
            setStudents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        // Fetch all users with the 'parent' role
        const parentsQuery = query(collection(db, 'users'), where('roles', 'array-contains', 'parent'));
        const unsubParents = onSnapshot(parentsQuery, snapshot => {
            setParents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        // Fetch all routes
        const unsubRoutes = onSnapshot(collection(db, 'routes'), snapshot => {
            setRoutes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        
        // A simple loading indicator
        setTimeout(() => setLoading(false), 1500);

        return () => {
            unsubStudents();
            unsubParents();
            unsubRoutes();
        };
    }, []);

    const handleAddStudent = async (studentName, parentId) => {
        await addDoc(collection(db, 'students'), {
            studentName,
            parentId,
            assignedRouteId: '',
            assignedStopId: ''
        });
    };

    const handleUpdateStudent = async (id, dataToUpdate) => {
        await updateDoc(doc(db, 'students', id), dataToUpdate);
    };

    const handleDeleteStudent = async (id) => {
        if (window.confirm("Are you sure you want to delete this student?")) {
            await deleteDoc(doc(db, 'students', id));
        }
    };

    if (loading) {
        return <p className="text-center mt-8">Loading student data...</p>;
    }

    return (
        <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">Student Management</h2>
            </div>
            <StudentForm onAddStudent={handleAddStudent} parents={parents} />
            <StudentList
                students={students}
                parents={parents}
                routes={routes}
                onUpdate={handleUpdateStudent}
                onDelete={handleDeleteStudent}
            />
        </div>
    );
};

export default StudentManager;