import axios from 'axios';

const handleRequest = async (options) => {
    try {
        const response = await fetch(options.url, options);

        if (!response.ok) {
            throw `Error: ${response.status} - ${response.statusText}`;
        }

        return await response.json();
    } catch (error) {
        throw error.message || 'Unable to connect to the server!';
    }
};

export default handleRequest;
