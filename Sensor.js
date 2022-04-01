const { SerialPort } = require('serialport');

class Sensor {
    init(serialport) {
        this.port = new SerialPort({
            path: serialport, 
            baudRate: 9600
        });
    }

    async sendCommand(command) {
        await this.delay(100);
        this.port.write(command);
        this.port.write('\n');
    }

    async delay(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = Sensor;