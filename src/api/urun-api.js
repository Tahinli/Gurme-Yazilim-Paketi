import request from 'request'
import apiURL from './_apiURL.js'
import handleRequest from './handler.js'

const getUrunler = () => {
    const options = {
        method: 'GET',
        url: `${apiURL}/kullanici/hepsi`,
        json: true
    };

    return handleRequest(options);
};
const getUsersById = (id) => {
    const options = {
        method: 'GET',
        url: `${apiURL}/kullanici/hepsi/${id}`,
        json: true
    };

    return handleRequest(options);
};

const addUser = (userData) => {
    const isim = userData.isim
    const soyisim = userData.soyisim
    const id = userData.id
    const sifre = userData.sifre
    const options = {
        method: 'GET',
        url: `${apiURL}/kullanici/ekle/${isim}/${soyisim}/${id}/${sifre}`,
        json: true,
        body: userData
    };

    return handleRequest(options);
};

const deleteUser = (id) => {
    const options = {
        method: 'GET',
        url: `${apiURL}/kullanici/sil/${id}`,
        json: true
    };

    return handleRequest(options);
};

const updateUser = (id, userData) => {
    const yeni_isim = userData.isim
    const yeni_soyisim = userData.soyisim
    const yeni_id = userData.id
    const yeni_sifre = userData.sifre
    const options = {
        method: 'GET',
        url: `${apiURL}/kullanici/${id}/${yeni_isim}/${yeni_soyisim}/${yeni_id}/${yeni_sifre}`,
        json: true,
        body: userData
    };

    return handleRequest(options)
}

const kullaniciApi = {
    getUsersById,
    getUsers,
    addUser,
    deleteUser,
    updateUser
};

export default kullaniciApi