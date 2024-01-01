import apiURL from './_apiURL.js'
import handleRequest from './handler/handler.js'

const getKategoriler = async () => {
    try {
        const options = {
            method: 'GET',
            url: `${apiURL}/kategori/hepsi`,
            json: true
        };
        const result = await handleRequest(options);
        return result
    }
    catch (error) {
        throw error;
    }
}

const getKategoriByName = async (name) => {
    try {
        const options = {
            method: 'GET',
            url: `${apiURL}/kategori/${name}`,
            json: true
        };

        const result = await handleRequest(options);
        return result
    }
    catch (error) {
        throw error;
    }
};

const addKategori = async (userData) => {
    const isim = userData.isim
    const ust_kategori = userData.ust_kategori
    try {
        const options = {
            method: 'GET',
            url: `${apiURL}/kategori/ekle/${isim}/${ust_kategori}`,
            json: true,
            body: userData
        };
        const result = await handleRequest(options)
        return result
    } catch (error) {
        throw error;
    }
};

const deleteKategori = async (name) => {
    try {
        const options = {
            method: 'GET',
            url: `${apiURL}/kategori/sil/${name}`,
            json: true
        };
        const result = await handleRequest(options)
        return result
    }
    catch (error) {
        throw error;
    }
};

const updateKategori = async (name, userData) => {
    let yeni_isim, yeni_ust_kategori

    if (userData.isim == undefined) yeni_isim = name
    else { yeni_isim = userData.isim }

    if (userData.ust_kategori != undefined) yeni_ust_kategori = userData.ust_kategori

    try {
        const options = {
            method: 'GET',
            url: `${apiURL}/kategori/duzenle/${name}/${yeni_isim}/${yeni_ust_kategori}`,
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
            url: `${apiURL}/kategori/dusur`,
            json: true
        };
        const result = await handleRequest(options)
        return result
    }
    catch (error) {
        throw error;
    }
}

const kategoriApi = {
    getKategoriByName,
    getKategoriler,
    addKategori,
    deleteKategori,
    updateKategori,
    deleteAll
};

export default kategoriApi