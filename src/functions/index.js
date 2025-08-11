const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { Client } = require("@googlemaps/google-maps-services-js");

admin.initializeApp();
const db = admin.firestore();
const mapsClient = new Client({});

// --- IMPORTANT: SET YOUR GOOGLE MAPS API KEY ---
// In your terminal, run this command in the 'functions' directory:
// firebase functions:config:set maps.key="YOUR_GOOGLE_MAPS_API_KEY"
const GOOGLE_MAPS_API_KEY = functions.config().maps.key;

exports.calculateETA = functions.firestore
    .document("buses/{busId}")
    .onUpdate(async (change, context) => {
        const busDataAfter = change.after.data();
        const busDataBefore = change.before.data();
        const busId = context.params.busId;

        // Only run if the stop index has changed and the route is in progress
        if (
            busDataAfter.currentStopIndex === busDataBefore.currentStopIndex ||
            busDataAfter.liveStatus !== "IN_PROGRESS"
        ) {
            return null;
        }

        try {
            // 1. Get the route data
            const routeDoc = await db.collection("routes").doc(busDataAfter.assignedRouteId).get();
            if (!routeDoc.exists) {
                console.log(`Route ${busDataAfter.assignedRouteId} not found.`);
                return null;
            }
            const routeData = routeDoc.data();
            const stops = busDataAfter.direction === 'pickup' ? routeData.stops : [...routeData.stops].reverse();
            
            const currentStopIndex = busDataAfter.direction === 'pickup' ? busDataAfter.currentStopIndex : stops.length - 1 - busDataAfter.currentStopIndex;

            // 2. Check if there is a next stop
            if (currentStopIndex >= stops.length - 1) {
                // This is the last stop, no ETA to calculate
                await db.collection("buses").doc(busId).update({ liveEta: "Last Stop" });
                return null;
            }

            const originStop = stops[currentStopIndex];
            const destinationStop = stops[currentStopIndex + 1];

            // 3. Call Google Maps Directions API
            const request = {
                params: {
                    origin: originStop.location,
                    destination: destinationStop.location,
                    key: GOOGLE_MAPS_API_KEY,
                    departure_time: "now", // This enables traffic prediction
                },
            };

            const response = await mapsClient.directions(request);
            const durationInSeconds = response.data.routes[0].legs[0].duration_in_traffic.value;
            
            // 4. Calculate the ETA
            const arrivalTime = new Date(Date.now() + durationInSeconds * 1000);
            const liveEta = arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            // 5. Update the bus document with the new ETA
            await db.collection("buses").doc(busId).update({ liveEta });
            console.log(`Successfully calculated ETA for bus ${busId}: ${liveEta}`);
            return null;

        } catch (error) {
            console.error(`Error calculating ETA for bus ${busId}:`, error);
            return null;
        }
    });