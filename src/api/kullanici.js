import _axios from "axios";
import baseUrl from "./base_api.js";
const _baseUrl = baseUrl + '/kullanici'


_axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

//**************KULLANICI
export const kullaniciGetAll = async () => {
    try {
        const response = await fetch(`http://93.190.8.248:2001/kullanicibuwu`);
        return {
            data: response.data,
            error: null
        };
    } catch (error) {
        return {
            data: null,
            error: `Error fetching items: ${error}`
        };
    }
}

export const kullaniciGet = async (id) => {
    try {
        const response = await axios.get(`/${id}`)
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

export const kullaniciEkle = async (isim, soyisim, id, sifre) => {
    try {
        const response = await axios.post(`/ekle/${isim}/${soyisim}/${id}/${sifre}`)
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

export const kullaniciSil = async (id) => {
    try {
        const response = await axios.delete(`/sil/${id}`)
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
export const kullaniciDuzenle = async (id, yeni_isim, yeni_soyisim, yeni_id, yeni_sifre) => {
    try {
        const response = await axios.put(`/duzenle/${id}/${yeni_isim}/${yeni_soyisim}/${yeni_id}/${yeni_sifre}`)
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

const kullaniciApis = {
    _baseUrl,
    kullaniciGetAll,
    kullaniciGet,
    kullaniciEkle,
    kullaniciSil,
    kullaniciDuzenle
}

export default kullaniciApis;