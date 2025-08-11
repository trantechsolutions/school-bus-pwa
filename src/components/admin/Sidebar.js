import React from 'react';

const Sidebar = ({ activeView, setActiveView, onLogout, roles, setViewingAs }) => {
    const navItems = ['Users', 'Buses', 'Routes', 'Students'];

    return (
        <div className="w-64 bg-gray-800 text-white flex-shrink-0 h-full flex flex-col">
            <div className="p-6">
                <h1 className="text-2xl font-bold">Admin Panel</h1>
            </div>
            <nav className="flex-grow">
                <ul>
                    {navItems.map(item => (
                        <li key={item}>
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setActiveView(item);
                                }}
                                className={`block px-6 py-3 hover:bg-gray-700 ${activeView === item ? 'bg-indigo-600' : ''}`}
                            >
                                {item}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="p-4 border-t border-gray-700">
                 {roles.includes('parent') && (
                    <button onClick={() => setViewingAs('parent')} className="w-full text-left block px-4 py-2 mb-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded-md">
                        Switch to Parent View
                    </button>
                 )}
                 <button onClick={onLogout} className="w-full text-left block px-4 py-2 text-sm hover:bg-gray-700 rounded-md">Log Out</button>
            </div>
        </div>
    );
};

export default Sidebar;