import axios from "axios";
import baseUrl from "./base_api";

const axios = axios.create({
    baseURL: baseUrl + '/urun'
});
//**************ÜRÜN

export const urunGet = async (isim) => {
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

export const urunEkle = async (isim, kategori) => {
    try {
        const response = await axios.post(`/ekle/${isim}/${kategori}`)
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

export const urunSil = async (name) => {
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
export const urunDuzenle = async (isim, yeni_isim, yeni_kategori) => {
    try {
        const response = await axios.put(`/duzenle/${isim}/${yeni_isim}/${yeni_kategori}`)
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