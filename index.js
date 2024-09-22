const WebSocket = require('ws');
const axios = require('axios');

// Change 'localhost' to '0.0.0.0' to accept connections from all interfaces
const wss = new WebSocket.Server({ host: '0.0.0.0', port: 8080 });

wss.on('connection', (ws, req) => {
    console.log('Client connected');

    ws.on('message', async (message) => {
        console.log("inside the message");
        const requestData = JSON.parse(message);
        console.log("after the message");
        try {
            console.log("inside the try");
            const response = await axios.post('http://localhost:11434/api/generate', requestData, { responseType: 'stream' });
            console.log("after the response");

            // Stream the response as it comes in
            response.data.on('data', (chunk) => {
                ws.send(chunk.toString());
            });

            response.data.on('end', () => {
                // Do not close the WebSocket connection here
                console.log("Response stream ended, but keeping connection open.");
            });

        } catch (error) {
            console.error('Error details:', error);
            ws.send(JSON.stringify({ error: 'Error generating response' }));
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server running on port 8080');
