import axios from "axios";

const axios = axios.create({
    baseURL: 'http://localhost:2001/kategori'
});
//**************KATEGORİ

export const kategoriGet = async (isim) => {
    try {
        const response = await axios.get(`/${isim}`)
        return {
            data: response.data,
            error: null
        }
    }
    catch (error) {
        return {
            data: null,
            error: `Error fetching item: ${error}`
        }
    }
}

export const kategoriEkle = async (isim, ust_kategori) => {
    try {
        const response = await axios.post(`/ekle/${isim}/${ust_kategori}`)
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

export const kategoriSil = async (name) => {
    try {
        const response = await axios.delete(`/sil/${name}`)
        return {
            data: response.data,
            error: null
        }
    } catch (error) {
        return {
            data: null,
            error: `Error deleting item: ${error}`
        }
    }
}

export const kategoriDuzenle = async (isim, yeni_isim, yeni_ust_kategori) => {
    try {
        const response = await axios.put(`/duzenle/${isim}/${yeni_isim}/${yeni_ust_kategori}`)
        return {
            data: response.data,
            error: null
        }
    }
    catch (error) {
        return {
            data: null,
            error: `Error updating item: ${error}`
        }
    }
}

const kategoriApis = {
    kategoriGet,
    kategoriEkle,
    kategoriSil,
    kategoriDuzenle,
}

export default kategoriApis;