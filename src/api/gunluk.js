import axios from "axios";
import baseUrl from "./base_api";

const axios = axios.create({
    baseURL: baseUrl + '/gunluk'
});
//**************ÜRÜN

export const gunlukGet = async (tarih) => {
    try {
        const response = await axios.get(`/${tarih}`)
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

export const gunlukEkle = async (urun, personel_sayisi, hedeflenen, ulasilan, atilan, tarih) => {
    try {
        const response = await axios.post(`/ekle/${urun}/${personel_sayisi}/${hedeflenen}/${ulasilan}/${atilan}/${tarih}`)
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

export const gunlukSil = async (tarih) => {
    try {
        const response = await axios.delete(`/sil/${tarih}`)
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
export const gunlukDuzenle = async (urun, yeni_urun, yeni_personel_sayisi, yeni_hedeflenen, yeni_ulasilan, yeni_atilan, yeni_tarih) => {
    try {
        const response = await axios.put(`/duzenle/${urun}/${yeni_urun}/${yeni_personel_sayisi}/${yeni_hedeflenen}/${yeni_ulasilan}/${yeni_atilan}/${yeni_tarih}`)
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

const gunlukApis = {
    gunlukGet,
    gunlukEkle,
    gunlukSil,
    gunlukDuzenle
}
export default gunlukApis;