import axios from 'axios';

const handleRequest = async (options) => {
    try {
        const response = await axios(options);
        return response.data;
    } catch (error) {
        if (error.response) {
            // The request was made, but the server responded with a status code
            // that falls out of the range of 2xx
            throw `Error: ${error.response.status} - ${error.response.statusText}`;
        } else if (error.request) {
            // The request was made, but no response was received
            throw 'No response received from the server';
        } else {
            // Something happened in setting up the request that triggered an Error
            throw 'Error setting up the request';
        }
    }
};

export default handleRequest;