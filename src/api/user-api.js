import apiURL from "./_apiURL.js";
import handleRequest from "./handler/handler.js";
const getUsers = async () => {
    try {
        const options = {
            method: "GET",
            url: `${apiURL}/kullanici/hepsi`,
            json: true,
        };
        const result = await handleRequest(options);

        return result;
    } catch (error) {
        throw error;
    }
};
const getUserById = async (id) => {
    try {
        const options = {
            method: "GET",
            url: `${apiURL}/kullanici/${id}`,
            json: true,
        };

        const result = await handleRequest(options);
        return result;
    } catch (error) {
        throw error;
    }
};

const addUser = async (userData) => {
    const isim = userData.isim;
    const soyisim = userData.soyisim;
    const id = userData.id;
    const sifre = userData.sifre;
    try {
        const options = {
            method: "GET",
            url: `${apiURL}/kullanici/ekle/${isim}/${soyisim}/${id}/${sifre}`,
            json: true,
            body: userData,
        };
        const result = await handleRequest(options);
        return result;
    } catch (error) {
        throw error;
    }
};

const deleteUser = async (id) => {
    try {
        const options = {
            method: "GET",
            url: `${apiURL}/kullanici/sil/${id}`,
            json: true,
        };
        const result = await handleRequest(options);
        return result;
    } catch (error) {
        throw error;
    }
};

const updateUser = async (id, userData) => {
    const yeni_isim = userData.isim;
    const yeni_soyisim = userData.soyisim;
    const yeni_id = userData.id;
    const yeni_sifre = userData.sifre;
    try {
        const options = {
            method: "GET",
            url: `${apiURL}/kullanici/duzenle/${id}/${yeni_isim}/${yeni_soyisim}/${yeni_id}/${yeni_sifre}`,
            json: true,
            body: userData,
        };
        const result = await handleRequest(options);
        return result;
    } catch (error) {
        throw error;
    }
};
const deleteAll = async () => {
    try {
        const options = {
            method: 'GET',
            url: `${apiURL}/kullanici/dusur`,
            json: true
        };
        const result = await handleRequest(options)
        return result
    }
    catch (error) {
        throw error;
    }
}

const kullaniciApi = {
    getUserById,
    getUsers,
    addUser,
    deleteUser,
    updateUser,
    deleteAll
};

export default kullaniciApi;
