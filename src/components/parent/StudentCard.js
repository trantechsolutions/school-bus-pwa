import React from 'react';

const StudentCard = ({ student, route, bus, driver }) => {
    
    const getStatusDisplay = (status) => {
        const statusMap = {
            'IN_PROGRESS': { text: 'In Progress', color: 'bg-green-100 text-green-800' },
            'DELAYED': { text: 'Delayed', color: 'bg-yellow-100 text-yellow-800' },
            'NOT_STARTED': { text: 'Not Started', color: 'bg-gray-100 text-gray-800' },
            'COMPLETED': { text: 'Completed', color: 'bg-blue-100 text-blue-800' },
            'ERROR': { text: 'Error', color: 'bg-red-100 text-red-800' },
        };
        return statusMap[status] || { text: 'Unknown', color: 'bg-gray-100 text-gray-800' };
    };

    const statusDisplay = getStatusDisplay(bus?.liveStatus);
    const currentStopIndex = bus?.currentStopIndex ?? -1;
    const direction = bus?.direction || 'pickup';
    
    const routeStops = route?.stops || [];
    const orderedStops = direction === 'pickup' ? routeStops : [...routeStops].reverse();
    
    let lastStopText = '...';
    let nextStopText = '...';
    let eta = '...';

    if (bus?.liveStatus === 'IN_PROGRESS' && routeStops.length > 0 && currentStopIndex !== -1) {
        // Find the stop object that corresponds to the current index from the bus document
        const currentStopObject = routeStops.find(stop => {
            const originalIndex = routeStops.indexOf(stop);
            return originalIndex === currentStopIndex;
        });
        
        // Find the index of that stop within the currently ordered sequence
        const sequenceIndex = orderedStops.indexOf(currentStopObject);
        
        const lastStopObject = orderedStops[sequenceIndex - 1];
        const nextStopObject = orderedStops[sequenceIndex];

        lastStopText = lastStopObject?.location || 'Route Started';
        nextStopText = nextStopObject?.location || 'End of Route';
        
        eta = bus?.liveEta || (nextStopObject ? (direction === 'pickup' ? nextStopObject.pickupTime : nextStopObject.dropoffTime) : '...');
    }

    const studentStop = route?.stops?.find(stop => stop.id == student.assignedStopId);
    const scheduledTime = studentStop ? (direction === 'pickup' ? studentStop.pickupTime : studentStop.dropoffTime) : 'N/A';

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="p-6">
                 <h2 className="text-2xl font-bold text-gray-900">Tracking for: {student.studentName}</h2>
                 <p className="text-md text-gray-600">Route: <span className="font-semibold">{route?.routeName || '...'}</span></p>
            </div>
            
            <div className="p-6 border-y border-gray-200">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-500">Bus Number</p>
                        <p className="font-bold text-lg">{bus?.busNumber || 'N/A'}</p>
                    </div>
                     <div>
                        <p className="text-sm text-gray-500">Driver</p>
                        <p className="font-bold text-lg">{driver?.displayName || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusDisplay.color}`}>
                            {statusDisplay.text}
                        </span>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {bus?.liveStatus === 'IN_PROGRESS' ? (
                    <>
                        <div className="mb-4">
                            <p className="text-sm text-gray-500">Last Reported Stop</p>
                            <p className="font-semibold text-lg">{lastStopText}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Next Stop</p>
                            <p className="font-semibold text-lg text-indigo-600">{nextStopText}</p>
                            <p className="text-sm text-gray-500">Estimated Arrival: <span className="font-bold">{eta}</span></p>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-lg text-gray-700">{bus?.liveStatus === 'COMPLETED' ? 'This route has been completed.' : 'This route has not started yet.'}</p>
                        <p className="text-sm text-gray-500 mt-1">Your stop is scheduled for {scheduledTime}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentCard;