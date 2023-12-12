import axios from "axios";

const axios = axios.create({
    baseURL: 'http://localhost:3000/api'
});

export const insert = async (item) => {
    try {
        const response = await axios.post('/item', item)
        return {
            data: response.data,
            error: null
        }
    }
    catch (error) {
        return {
            data: null,
            error: `Error inserting item: ${error}`
        }
    }
}

export const getAll = async () => {
    try {
        const response = await axios.get(`/items`)
        return {
            data: response.data,
            error: null
        }
    }
    catch (error) {
        return {
            data: null,
            error: `Error fetching all items: ${error}`
        }
    }
}


export const getById = async (id) => {
    try {
        const response = await axios.get(`/item/${id}`)
        return {
            data: response.data,
            error: null
        }
    }
    catch (error) {
        return {
            data: null,
            error: `Error fetching item by ID: ${error}`
        }
    }
}

export const updateById = async (id, item) => {
    try {
        const response = await axios.put(`/item/${id}`, item)
        return {
            data: response.data,
            error: null
        }
    }
    catch (error) {
        return {
            data: null,
            error: `Error updating item by ID: ${error}`
        }
    }
}

export const deleteById = async (id) => {
    try {
        const response = await axios.delete(`/item/${id} `)
        return {
            data: response.data,
            error: null
        }
    } catch (error) {
        return {
            data: null,
            error: `Error deleting item by ID: ${error}`
        }
    }
}

const apis = {
    insert,
    getAll,
    updateById,
    deleteById,
    getById
};

export default apis;