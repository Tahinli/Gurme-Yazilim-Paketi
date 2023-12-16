import axios from "axios";

const axios = axios.create({
    baseURL: 'http://localhost:2001/kullanici'
});

//**************KULLANICI
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
    kullaniciGet,
    kullaniciEkle,
    kullaniciSil,
    kullaniciDuzenle
}

export default kullaniciApis;