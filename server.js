const http = require('http');
const ws = require('ws');
const Sensor = require("./Sensor.js");

const httpPort = process.env.npm_config_http_port ?? 5001;
const serialport = process.env.npm_config_serial_port ?? 'COM3';

let server = http.createServer((req, res) => {
    res.writeHead(200);
});
server.listen(httpPort, () => console.log('Started server on', httpPort));
const wss = new ws.Server({server, path: '/diode'});

wss.on('connection', handleConnection);
let connections = new Array;

const sensor = new Sensor();
sensor.init(serialport);

function handleConnection(client) {
    console.log('New connection');
    connections.push(client);

    client.on('message', (message) => {
        message = message.toString();
        message = message.replace(/['"]+/g, '');

        console.log(message);
        handleCommand(message);
    });

    client.on('error', error => {
        console.log('Error', error);
    });

    client.on('close', () => {
        console.log('Connection closed');
        let position = connections.indexOf(client);
        connections.splice(position, 1);
        if (connections.length === 0) {
            console.log('No connections');
        }
    });
}

async function handleCommand(message) {
    message = message.toString();
    console.log('Message', message);
    await sensor.sendCommand(message);
}
