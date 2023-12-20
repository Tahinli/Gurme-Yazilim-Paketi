import apiURL from './_apiURL.js'
import handleRequest from './handler/handler.js'

const getUrunler = async () => {
    try {
        const options = {
            method: 'GET',
            // mode: 'no-cors',
            url: `${apiURL}/urun/hepsi`,
            json: true
        };
        const result = await handleRequest(options);
        return result
    }
    catch (error) {
        throw error;
    }
}

const getUrunByName = async (name) => {
    try {
        const options = {
            method: 'GET',
            url: `${apiURL}/urun/${name}`,
            json: true
        };

        const result = await handleRequest(options);
        return result
    }
    catch (error) {
        throw error;
    }
};

const addUrun = async (userData) => {

    const isim = userData.isim
    const kategori = userData.kategori
    try {
        const options = {
            method: 'GET',
            url: `${apiURL}/urun/ekle/${isim}/${kategori}`,
            json: true,
            body: userData
        };
        const result = await handleRequest(options)
        return result
    } catch (error) {
        throw error;
    }
};

const deleteUrun = async (name) => {
    try {
        const options = {
            method: 'GET',
            url: `${apiURL}/urun/sil/${name}`,
            json: true
        };
        const result = await handleRequest(options)
        return result
    }
    catch (error) {
        throw error;
    }
};

const updateUrun = async (name, userData) => {
    const yeni_isim = userData.isim
    const yeni_kategori = userData.kategori
    try {
        const options = {
            method: 'GET',
            url: `${apiURL}/urun/duzenle/${name}/${yeni_isim}/${yeni_kategori}`,
            json: true,
            body: userData
        };
        const result = await handleRequest(options)
        return result
    }
    catch (error) {
        throw error;
    }
}
const deleteAll = async () => {
    try {
        const options = {
            method: 'GET',
            url: `${apiURL}/urun/dusur`,
            json: true,
            body: userData
        };
        const result = await handleRequest(options)
        return result
    }
    catch (error) {
        throw error;
    }
}

const urunApi = {
    getUrunByName,
    getUrunler,
    addUrun,
    deleteUrun,
    updateUrun,
    deleteAll
};

export default urunApi