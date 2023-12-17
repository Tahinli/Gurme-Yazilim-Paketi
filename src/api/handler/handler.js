import request from 'request';

const handleRequest = (options) => {
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (error) {
                reject('Unable to connect to the server!');
            } else if (response.statusCode !== 200) {
                reject(`Error: ${response.statusCode} - ${response.statusMessage}`);
            } else {
                resolve(body);
            }
        });
    });
};

export default handleRequest;