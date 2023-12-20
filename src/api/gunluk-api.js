import apiURL from './_apiURL.js'
import handleRequest from './handler/handler.js'

const getGunlukler = async () => {
    try {
        const options = {
            method: 'GET',
            url: `${apiURL}/gunluk/hepsi`,
            json: true
        };
        const result = await handleRequest(options);
        return result
    }
    catch (error) {
        throw error;
    }
}

const getGunlukByDate = async (urunAdi, tarih) => {
    try {
        const options = {
            method: 'GET',
            url: `${apiURL}/gunluk/${urunAdi}/${tarih}`,
            json: true
        };

        const result = await handleRequest(options);
        return result
    }
    catch (error) {
        throw error;
    }
};

const addGunluk = async (urunAdi, userData) => {
    const personel_sayisi = userData.personel_sayisi
    const hedeflenen = userData.hedeflenen
    const ulasilan = userData.ulasilan
    const atilan = userData.atilan
    const stok = userData.stok
    const sevk = userData.sevk
    const tarih = userData.tarih

    try {
        const options = {
            method: 'GET',
            url: `${apiURL}/gunluk/ekle/${urunAdi}/${personel_sayisi}/${hedeflenen}/${ulasilan}/${atilan}/${stok}/${sevk}/${tarih}`,
            json: true,
            body: userData
        };
        const result = await handleRequest(options)
        return result
    } catch (error) {
        throw error;
    }
};

const deleteGunluk = async (urunIsim, tarih) => {
    try {
        const options = {
            method: 'GET',
            url: `${apiURL}/gunluk/sil/${urunIsim}/${tarih}`,
            json: true
        };
        const result = await handleRequest(options)
        return result
    }
    catch (error) {
        throw error;
    }
};

const updateGunluk = async (urunAdi, tarih, userData) => {
    let yeni_urun, yeni_personel_sayisi, yeni_hedeflenen, yeni_ulasilan, yeni_atilan, yeni_tarih, yeni_stok, yeni_sevk
    yeni_urun = userData.yeni_urun
    yeni_personel_sayisi = userData.yeni_personel_sayisi
    yeni_hedeflenen = userData.yeni_hedeflenen
    yeni_ulasilan = userData.yeni_ulasilan
    yeni_atilan = userData.yeni_atilan
    yeni_stok = userData.yeni_stok
    yeni_sevk = userData.yeni_sevk
    yeni_tarih = userData.yeni_tarih

    try {
        const options = {
            method: 'GET',
            url: `${apiURL}/gunluk/duzenle/${urunAdi}/${tarih}/${yeni_urun}/${yeni_personel_sayisi}/${yeni_hedeflenen}/${yeni_ulasilan}/${yeni_atilan}/${yeni_stok}/${yeni_sevk}}/${yeni_tarih}`,
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
            url: `${apiURL}/gunluk/dusur`,
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

const gunlukApi = {
    getGunlukByDate,
    getGunlukler,
    addGunluk,
    deleteGunluk,
    updateGunluk,
    deleteAll
};

export default gunlukApi