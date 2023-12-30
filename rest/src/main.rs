use axum::{routing::get, extract::{Path, State}, Router, Json, http::StatusCode, response::IntoResponse};
use serde_json::Value;
use tower_http::cors::CorsLayer;
use mongodb::{Client, options::{ClientOptions, IndexOptions}, Database, IndexModel, bson::doc, Collection, error::Error, results::CreateIndexResult};
use serde::{Serialize, Deserialize};
use chrono::NaiveDate;

const DB_NAME:&str = "gurme";
const CONNECTION_STRING:&str = "mongodb://172.17.0.2:27017";
const BIND_STRING:&str = "127.0.0.1:2001";
#[derive(Debug, Clone)]
struct AppState
    {
        kullanici_collection:Collection<Kullanici>,
        kategori_collection:Collection<Kategori>,
        urun_collection:Collection<Urun>,
        gunluk_collection:Collection<Gunluk>,
    }
#[derive(Debug, Clone, Serialize, Deserialize)]
struct Kullanici
    {
        isim:String,
        soyisim:String,
        id:String,
        sifre:String,
    }
impl Kullanici 
    {
        async fn hata_ayiklayici(analiz_edilecek:Result<Option<Kullanici>, Error>) -> (StatusCode, Json<Value>)
            {
                match analiz_edilecek 
                    {
                        Ok(hatasiz) =>
                            {
                                match hatasiz 
                                    {
                                        Some(deger) =>
                                            {
                                                return (StatusCode::OK, Json(serde_json::json!(deger)));
                                            }
                                        None =>
                                            {
                                                return (StatusCode::IM_A_TEAPOT, Json(serde_json::json!("")));
                                            }
                                    }
                            }
                        Err(hata_degeri) =>
                            {
                                return (StatusCode::IM_A_TEAPOT, Json(serde_json::json!(hata_degeri.to_string())));
                            }
                    }
            }
        async fn kullanici(Path(id):Path<String>, State(state):State<AppState>) -> (StatusCode, Json<Value>)
            {
                println!("{}", id);
                Kullanici::hata_ayiklayici(state.kullanici_collection.find_one(doc! {"id":id}, None).await).await
            }
        async fn ekle(Path((isim, soyisim, id, sifre)):Path<(String, String, String, String)>, State(state):State<AppState>) -> (StatusCode, Json<Value>)
            {
                println!("{}", isim);
                println!("{}", soyisim);
                println!("{}", id);
                println!("{}", sifre);
                //TO-DO var olan kullanıcıyı ekleme
                let kullanici = Kullanici
                    {
                        isim,
                        soyisim,
                        id,
                        sifre,
                    };
                match state.kullanici_collection.insert_one(kullanici, None).await
                    {
                        Ok(sonuc_degeri)=>
                            {
                                (StatusCode::OK, Json(serde_json::json!(sonuc_degeri)))
                            }
                        Err(hata_degeri) =>
                            {
                                (StatusCode::IM_A_TEAPOT, Json(serde_json::json!(hata_degeri.to_string())))
                            }
                    }
                
            }
        async fn sil(Path(id):Path<String>, State(state):State<AppState>) -> (StatusCode, Json<Value>)
            {
                println!("{}", id);
                Kullanici::hata_ayiklayici(state.kullanici_collection.find_one_and_delete(doc! {"id":id}, None).await).await
            }
        async fn duzenle(Path((id, yeni_isim, yeni_soyisim, yeni_id, yeni_sifre)):Path<(String, String, String, String, String)>, State(state):State<AppState>) -> (StatusCode, Json<Value>)
            {
                println!("{}", id);
                println!("{}", yeni_isim);
                println!("{}", yeni_soyisim);
                println!("{}", yeni_id);
                println!("{}", yeni_sifre);
                //TO-DO kullanıcı ya yoksa ?
                let yeni_kullanici = Kullanici
                    {
                        isim:yeni_isim,
                        soyisim:yeni_soyisim,
                        id:yeni_id,
                        sifre:yeni_sifre,
                    };
                Kullanici::hata_ayiklayici(state.kullanici_collection.find_one_and_replace(doc! {"id":id}, yeni_kullanici, None).await).await
            }
        async fn hepsi(State(state): State<AppState>) -> (StatusCode, Json<Value>)
            {
                let mut kullanicilar_vector:Vec<Kullanici> = vec![];
                match state.kullanici_collection.find(None, None).await
                    {
                        Ok(mut kullanicilar_cursor) =>
                            {
                                while kullanicilar_cursor.advance().await.unwrap() 
                                    {
                                        match kullanicilar_cursor.deserialize_current()
                                            {
                                                Ok(eklenecek_kullanici) =>
                                                    {
                                                        kullanicilar_vector.push(eklenecek_kullanici);
                                                    }
                                                Err(hata_degeri) =>
                                                    {
                                                        return (StatusCode::IM_A_TEAPOT, Json(serde_json::json!(hata_degeri.to_string())));
                                                    }
                                            }
                                    }
                            }
                        Err(hata_degeri) =>
                            {
                                return (StatusCode::IM_A_TEAPOT, Json(serde_json::json!(hata_degeri.to_string())));
                            }
                    }
                (StatusCode::OK, Json(serde_json::json!(kullanicilar_vector)))
            }
        async fn dusur(State(state): State<AppState>) -> (StatusCode, Json<Value>)
            {
                match state.kullanici_collection.delete_many(doc! {}, None).await
                    {
                        Ok(sonuc_degeri) =>
                            {
                                (StatusCode::OK, Json(serde_json::json!(sonuc_degeri)))
                            }
                        Err(hata_degeri) =>
                            {
                                (StatusCode::IM_A_TEAPOT, Json(serde_json::json!(hata_degeri.to_string())))
                            }
                    }
            }
    }
#[derive(Debug, Clone, Serialize, Deserialize)]
struct Kategori
    {
        isim:String,
        ust_kategori:Option<Box<Kategori>>,
        ust_kategori_isim:String,
    }
impl Kategori 
    {
        async fn hata_ayiklayici(analiz_edilecek:Result<Option<Kategori>, Error>) -> (StatusCode, Json<Value>)
            {
                match analiz_edilecek 
                    {
                        Ok(hatasiz) =>
                            {
                                match hatasiz 
                                    {
                                        Some(deger) =>
                                            {
                                                return (StatusCode::OK, Json(serde_json::json!(deger)));
                                            }
                                        None =>
                                            {
                                                return (StatusCode::IM_A_TEAPOT, Json(serde_json::json!("")));
                                            }
                                    }
                            }
                        Err(hata_degeri) =>
                            {
                                return (StatusCode::IM_A_TEAPOT, Json(serde_json::json!(hata_degeri.to_string())));
                            }
                    }
            }
        async fn kategori(Path(isim):Path<String>, State(state):State<AppState>) -> (StatusCode, Json<Value>)
            {
                println!("{}", isim);
                Kategori::hata_ayiklayici(state.kategori_collection.find_one(doc! {"isim":isim}, None).await).await
            }
        async fn ekle(Path((isim, ust_kategori)):Path<(String, String)>, State(state):State<AppState>) -> (StatusCode, Json<Value>)
            {
                println!("Kategori Ekle");
                println!("{}", isim);
                println!("{}", ust_kategori);
                let mut kategori:Kategori = Kategori
                    {
                        isim,
                        ust_kategori:None,
                        ust_kategori_isim:"".to_string(),
                    };
                if kategori.isim =="null".to_string()
                    {
                        return (StatusCode::IM_A_TEAPOT, Json(serde_json::json!("Kategori ismi null olamaz")));
                    }
                match state.kategori_collection.find_one(doc! {"isim": ust_kategori}, None).await
                    {
                        Ok(bulundu) =>
                            {
                                
                                match bulundu 
                                    {
                                        Some(ust_kategori) =>
                                            {
                                                kategori.ust_kategori = Some(Box::new(ust_kategori.clone()));
                                                kategori.ust_kategori_isim = ust_kategori.isim;
                                            }
                                        None =>{}
                                    }
                            }
                        Err(bulunamadi) =>
                            {
                                return (StatusCode::IM_A_TEAPOT, Json(serde_json::json!(bulunamadi.to_string())))
                            }
                    }
                match state.kategori_collection.insert_one(kategori, None).await
                    {
                        Ok(sonuc_degeri)=>
                            {
                                (StatusCode::OK, Json(serde_json::json!(sonuc_degeri)))
                            }
                        Err(hata_degeri) =>
                            {
                                (StatusCode::IM_A_TEAPOT, Json(serde_json::json!(hata_degeri.to_string())))
                            }
                    }
            }
        async fn sil(Path(isim):Path<String>, State(state):State<AppState>) -> (StatusCode, Json<Value>)
            {
                println!("{}", isim);

                //TO-DO ya kategori yoksa, ya alt ürünler varsa
                if Urun::hata_ayiklayici(state.urun_collection.find_one(doc! {"kategori_isim":isim.clone()}, None).await).await.0 == StatusCode::OK
                    {
                        return (StatusCode::IM_A_TEAPOT, Json(serde_json::json!("Kategoriye ait ürün var silemezsiniz.")));
                    }
                if Kategori::hata_ayiklayici(state.kategori_collection.find_one(doc! {"ust_kategori_isim":isim.clone()}, None).await).await.0 == StatusCode::OK
                    {
                        return (StatusCode::IM_A_TEAPOT, Json(serde_json::json!("Kategoriye ait alt kategori var silemezsiniz.")));
                    }
                Kategori::hata_ayiklayici(state.kategori_collection.find_one_and_delete(doc! {"isim":isim}, None).await).await
            }
        async fn duzenle(Path((isim, yeni_isim, yeni_ust_kategori)):Path<(String, String, String)>, State(state):State<AppState>) -> (StatusCode, Json<Value>)
            {
                println!("{}", isim);
                println!("{}", yeni_isim);
                println!("{}", yeni_ust_kategori);

                let mut yeni_kategori:Kategori = Kategori
                    {
                        isim:yeni_isim,
                        ust_kategori:None,
                        ust_kategori_isim:"".to_string(),
                    };
                if yeni_kategori.isim =="null".to_string()
                    {
                        return (StatusCode::IM_A_TEAPOT, Json(serde_json::json!("Kategori ismi null olamaz")));
                    }
                match state.kategori_collection.find_one(doc! {"isim": yeni_ust_kategori}, None).await
                    {
                        Ok(bulundu) =>
                            {
                                match bulundu
                                    {
                                        Some(ust_kategori) =>
                                            {
                                                yeni_kategori.ust_kategori = Some(Box::new(ust_kategori.clone()));
                                                yeni_kategori.ust_kategori_isim = ust_kategori.isim;
                                            }
                                        None =>{}
                                    }
                            }
                        Err(bulunamadi) =>
                            {
                                return (StatusCode::IM_A_TEAPOT, Json(serde_json::json!(bulunamadi.to_string())));
                            }
                    }
                let sonuc = Kategori::hata_ayiklayici(state.kategori_collection.find_one_and_replace(doc!{"isim":isim.clone()}, yeni_kategori.clone(), None).await).await;
                if sonuc.0 == StatusCode::OK
                    {
                        match state.urun_collection.find(doc! {"kategori_isim":isim.clone()}, None).await
                            {
                                Ok(mut bulundu) =>
                                    {
                                        while bulundu.advance().await.unwrap()
                                            {
                                                match bulundu.deserialize_current()
                                                    {
                                                        Ok(urun_eski) =>
                                                            {
                                                                Urun::duzenle(Path((urun_eski.isim.clone(), urun_eski.isim.clone(), yeni_kategori.isim.clone())), axum::extract::State(state.clone())).await;
                                                            }
                                                        Err(_) =>{}
                                                    }
                                            }
                                        return (StatusCode::OK, Json(serde_json::json!("iyisin")));
                                    }
                                Err(bulunamadi) =>
                                    {
                                        return (StatusCode::IM_A_TEAPOT, Json(serde_json::json!(bulunamadi.to_string())));
                                    }
                            }
                    }
                return (StatusCode::IM_A_TEAPOT, sonuc.1);
            }
        async fn hepsi(State(state): State<AppState>) -> (StatusCode, Json<Value>)
            {
                let mut kategoriler_vector:Vec<Kategori> = vec![];
                match state.kategori_collection.find(None, None).await
                    {
                        Ok(mut bulundu) =>
                            {
                                while bulundu.advance().await.unwrap()
                                    {
                                        match bulundu.deserialize_current()
                                            {
                                                Ok(kategori) =>
                                                    {
                                                        kategoriler_vector.push(kategori);
                                                    }
                                                Err(hata) =>
                                                    {
                                                        return (StatusCode::IM_A_TEAPOT, Json(serde_json::json!(hata.to_string())));
                                                    }
                                            }
                                    }
                            }
                        Err(bulunamadi) =>
                            {
                                return (StatusCode::IM_A_TEAPOT, Json(serde_json::json!(bulunamadi.to_string())));
                            }
                    }
                (StatusCode::OK, Json(serde_json::json!(kategoriler_vector)))
            }
        async fn dusur(State(state): State<AppState>) -> (StatusCode, Json<Value>)
            {
                match state.kategori_collection.delete_many(doc! {}, None).await
                    {
                        Ok(sonuc_degeri) =>
                            {
                                (StatusCode::OK, Json(serde_json::json!(sonuc_degeri)))
                            }
                        Err(hata_degeri) =>
                            {
                                (StatusCode::IM_A_TEAPOT, Json(serde_json::json!(hata_degeri.to_string())))
                            }
                    }
            }
    }
#[derive(Debug, Clone, Serialize, Deserialize)]
struct Urun
    {
        isim:String,
        kategori:Kategori,
        kategori_isim:String,
    }
impl Urun 
    {
        async fn hata_ayiklayici(analiz_edilecek:Result<Option<Urun>, Error>) -> (StatusCode, Json<Value>)
            {
                match analiz_edilecek 
                    {
                        Ok(hatasiz) =>
                            {
                                match hatasiz 
                                    {
                                        Some(deger) =>
                                            {
                                                return (StatusCode::OK, Json(serde_json::json!(deger)));
                                            }
                                        None =>
                                            {
                                                return (StatusCode::IM_A_TEAPOT, Json(serde_json::json!("")));
                                            }
                                    }
                            }
                        Err(hata_degeri) =>
                            {
                                return (StatusCode::IM_A_TEAPOT, Json(serde_json::json!(hata_degeri.to_string())));
                            }
                    }
            }
        async fn urun(Path(isim):Path<String>, State(state):State<AppState>) -> (StatusCode, Json<Value>)
            {
                println!("{}", isim);
                Urun::hata_ayiklayici(state.urun_collection.find_one(doc! {"isim":isim}, None).await).await
            }
        async fn ekle(Path((isim, kategori)):Path<(String, String)>, State(state):State<AppState>) -> (StatusCode, Json<Value>)
            {
                println!("{}", isim);
                println!("{}", kategori);

                match state.kategori_collection.find_one(doc! {"isim":kategori}, None).await
                    {
                        Ok(bulundu) =>
                            {
                                match bulundu 
                                    {
                                        Some(kategori) =>
                                            {
                                                let urun = Urun
                                                    {
                                                        isim,
                                                        kategori:kategori.clone(),
                                                        kategori_isim:kategori.isim,
                                                    };
                                                match state.urun_collection.insert_one(urun, None).await
                                                    {
                                                        Ok(sonuc_degeri) =>
                                                            {
                                                                return (StatusCode::OK, Json(serde_json::json!(sonuc_degeri)));
                                                            }
                                                        Err(hata_degeri) =>
                                                            {
                                                                return (StatusCode::IM_A_TEAPOT, Json(serde_json::json!(hata_degeri.to_string())));
                                                            }
                                                        
                                                    }
                                            }
                                        None =>
                                            {
                                                return (StatusCode::IM_A_TEAPOT, Json(serde_json::json!("")));
                                            }
                                    }
                            }
                        Err(bulunamadi) =>
                            {
                                return (StatusCode::IM_A_TEAPOT, Json(serde_json::json!(bulunamadi.to_string())));
                            }
                    }
            }
        async fn sil(Path(isim):Path<String>, State(state):State<AppState>) -> (StatusCode, Json<Value>)
            {
                println!("{}", isim);
                //TO-DO ya yoksa?
                Urun::hata_ayiklayici(state.urun_collection.find_one_and_delete(doc!{"isim":isim}, None).await).await
            }
        async fn duzenle(Path((isim, yeni_isim, yeni_kategori)):Path<(String, String, String)>, State(state):State<AppState>) -> impl IntoResponse
            {
                println!("{}", isim);
                println!("{}", yeni_isim);
                println!("{}", yeni_kategori);
                
                //TO-DO ya ürün ya da kategori yoksa
                match state.kategori_collection.find_one(doc! {"isim":yeni_kategori}, None).await
                    {
                        Ok(bulundu) =>
                            {
                                match bulundu
                                    {
                                        Some(kategori) =>
                                            {
                                                let yeni_urun = Urun
                                                    {
                                                        isim:yeni_isim,
                                                        kategori:kategori.clone(),
                                                        kategori_isim:kategori.isim,
                                                    };                                                
                                                return Urun::hata_ayiklayici(state.urun_collection.find_one_and_replace(doc! {"isim":isim}, yeni_urun, None).await).await;
                                            }
                                        None =>
                                            {
                                                return (StatusCode::IM_A_TEAPOT, Json(serde_json::json!("")));
                                            }
                                    }
                            }
                        Err(bulunamadi) =>
                            {
                                return (StatusCode::IM_A_TEAPOT, Json(serde_json::json!(bulunamadi.to_string())));
                            }
                    }
            }
        async fn hepsi(State(state): State<AppState>) -> (StatusCode, Json<Value>)
            {
                let mut urunler_vector:Vec<Urun> = vec![];
                match state.urun_collection.find(None, None).await
                    {
                        Ok(mut bulundu) =>
                            {
                                while bulundu.advance().await.unwrap()
                                    {
                                        match bulundu.deserialize_current()
                                            {
                                                Ok(urun) =>
                                                    {
                                                        urunler_vector.push(urun);
                                                    }
                                                Err(hata_degeri) =>
                                                    {
                                                        return (StatusCode::IM_A_TEAPOT, Json(serde_json::json!(hata_degeri.to_string())));
                                                    }
                                            }
                                    }
                            }
                        Err(bulunamadi) =>
                            {
                                return (StatusCode::IM_A_TEAPOT, Json(serde_json::json!(bulunamadi.to_string())));
                            }
                    }
                (StatusCode::OK, Json(serde_json::json!(urunler_vector)))
            }
        async fn dusur(State(state): State<AppState>) -> (StatusCode, Json<Value>)
            {
                match state.urun_collection.delete_many(doc! {}, None).await
                    {
                        Ok(sonuc_degeri) =>
                            {
                                (StatusCode::OK, Json(serde_json::json!(sonuc_degeri)))
                            }
                        Err(hata_degeri) =>
                            {
                                (StatusCode::IM_A_TEAPOT, Json(serde_json::json!(hata_degeri.to_string())))
                            }
                    }
            }
    }
#[derive(Debug, Clone, Serialize, Deserialize)]
struct Gunluk
    {
        urun:Urun,
        urun_isim:String,
        personel_sayisi:u64,
        hedeflenen:u64,
        ulasilan:u64,
        atilan:u64,
        stok:u64,
        sevk:u64,
        stoktan_sevke:u64,
        stoktan_silinen:u64,
        tarih:String,
    }
impl Gunluk 
    {
        async fn hata_ayiklayici(analiz_edilecek:Result<Option<Gunluk>, Error>) -> (StatusCode, Json<Value>)
            {
                match analiz_edilecek 
                    {
                        Ok(hatasiz) =>
                            {
                                match hatasiz 
                                    {
                                        Some(deger) =>
                                            {
                                                return (StatusCode::OK, Json(serde_json::json!(deger)));
                                            }
                                        None =>
                                            {
                                                return (StatusCode::IM_A_TEAPOT, Json(serde_json::json!("")));
                                            }
                                    }
                            }
                        Err(hata_degeri) =>
                            {
                                return (StatusCode::IM_A_TEAPOT, Json(serde_json::json!(hata_degeri.to_string())));
                            }
                    }
            }
        async fn gunluk(Path((urun_string, tarih_string)):Path<(String, String)>, State(state):State<AppState>) -> (StatusCode, Json<Value>)
            {
                println!("{}", urun_string);
                println!("{}", tarih_string);
                //TO-DO tarihi tarih mi diye bak
                match state.urun_collection.find_one(doc! {"isim": urun_string}, None).await
                    {
                        Ok(bulundu) =>
                            {
                                match bulundu 
                                    {
                                        Some(urun) =>
                                            {
                                                return Gunluk::hata_ayiklayici(state.gunluk_collection.find_one(doc! {"tarih":tarih_string, "urun_isim":urun.isim}, None).await).await;
                                            }
                                        None =>
                                            {
                                                return (StatusCode::IM_A_TEAPOT, Json(serde_json::json!("")));
                                            }
                                    }                                
                            }
                        Err(bulunamadi) =>
                            {
                                return (StatusCode::IM_A_TEAPOT, Json(serde_json::json!(bulunamadi.to_string())));
                            }
                    }
                
            }
        async fn ekle(Path((urun_string, personel_sayisi_string, hedeflenen_string, ulasilan_string, atilan_string, stok_string, sevk_string, stoktan_sevke_string, stoktan_silinen_string, tarih_string)):Path<(String, String, String, String, String, String, String, String, String, String)>, State(state):State<AppState>) -> (StatusCode, Json<Value>)
            {
                println!("{}", urun_string);
                println!("{}", personel_sayisi_string);
                println!("{}", hedeflenen_string);
                println!("{}", ulasilan_string);
                println!("{}", atilan_string);
                println!("{}", stok_string);
                println!("{}", sevk_string);
                println!("{}", stoktan_sevke_string);
                println!("{}", stoktan_silinen_string);
                println!("{}", tarih_string);
                
                //TO-DO tarihi tarih mi diye bak
                if !tarih_kontrol(tarih_string.clone()).await
                    {
                        return (StatusCode::IM_A_TEAPOT, Json(serde_json::json!("Tarih Uygun Değil")));
                    }

                match state.urun_collection.find_one(doc! {"isim": urun_string}, None).await
                    {
                        Ok(bulundu) =>
                            {
                                match bulundu 
                                    {
                                        Some(urun) =>
                                            {
                                                let gunluk = Gunluk
                                                    {
                                                        urun:urun.clone(),
                                                        urun_isim:urun.isim,
                                                        personel_sayisi:personel_sayisi_string.parse().unwrap(),
                                                        hedeflenen:hedeflenen_string.parse().unwrap(),
                                                        ulasilan:ulasilan_string.parse().unwrap(),
                                                        atilan:atilan_string.parse().unwrap(),
                                                        stok:stok_string.parse().unwrap(),
                                                        sevk:sevk_string.parse().unwrap(),
                                                        stoktan_sevke:stoktan_sevke_string.parse().unwrap(),
                                                        stoktan_silinen:stoktan_silinen_string.parse().unwrap(),
                                                        tarih:tarih_string,
                                                    };
                                                match state.gunluk_collection.insert_one(gunluk, None).await
                                                    {
                                                        Ok(sonuc_degeri) =>
                                                            {
                                                                return (StatusCode::OK, Json(serde_json::json!(sonuc_degeri)));
                                                            }
                                                        Err(hata_degeri) =>
                                                            {
                                                                return (StatusCode::IM_A_TEAPOT, Json(serde_json::json!(hata_degeri.to_string())));
                                                            }
                                                    }
                                            }
                                        None =>
                                            {
                                                return (StatusCode::IM_A_TEAPOT, Json(serde_json::json!("")));
                                            }
                                    }
                            }
                        Err(bulunamadi) =>
                            {
                                return (StatusCode::IM_A_TEAPOT, Json(serde_json::json!(bulunamadi.to_string())));
                            }
                    }
                
            }
        async fn sil(Path((urun_string, tarih_string)):Path<(String, String)>, State(state):State<AppState>) -> (StatusCode, Json<Value>)
            {
                println!("{}", urun_string);
                println!("{}", tarih_string);

                //TO-DO ya ürün yoksa ?
                return Gunluk::hata_ayiklayici(state.gunluk_collection.find_one_and_delete(doc! {"urun_isim":urun_string, "tarih":tarih_string}, None).await).await;
            }
        async fn duzenle(Path((urun_string, tarih_string, yeni_urun_string, yeni_personel_sayisi_string, yeni_hedeflenen_string, yeni_ulasilan_string, yeni_atilan_string, yeni_stok_string, yeni_sevk_string, yeni_stoktan_sevke_string, yeni_stoktan_silinen_string, yeni_tarih_string)):Path<(String, String, String, String, String, String, String, String, String, String, String, String)>, State(state):State<AppState>) -> (StatusCode, Json<Value>)
            {
                println!("{}", urun_string);
                println!("{}", tarih_string);
                println!("{}", yeni_urun_string);
                println!("{}", yeni_personel_sayisi_string);
                println!("{}", yeni_hedeflenen_string);
                println!("{}", yeni_ulasilan_string);
                println!("{}", yeni_atilan_string);
                println!("{}", yeni_stok_string);
                println!("{}", yeni_sevk_string);
                println!("{}", yeni_stoktan_sevke_string);
                println!("{}", yeni_stoktan_silinen_string);
                println!("{}", yeni_tarih_string);

                if !tarih_kontrol(yeni_tarih_string.clone()).await
                    {
                        return (StatusCode::IM_A_TEAPOT, Json(serde_json::json!("Tarih Uygun Değil")));
                    }
                match state.urun_collection.find_one(doc! {"isim": yeni_urun_string}, None).await
                    {
                        Ok(bulundu) =>
                            {
                                match bulundu
                                    {
                                        Some(urun) =>
                                            {
                                                let yeni_gunluk = Gunluk
                                                    {
                                                        urun:urun.clone(),
                                                        urun_isim:urun.isim,
                                                        personel_sayisi:yeni_personel_sayisi_string.parse().unwrap(),
                                                        hedeflenen:yeni_hedeflenen_string.parse().unwrap(),
                                                        ulasilan:yeni_ulasilan_string.parse().unwrap(),
                                                        atilan:yeni_atilan_string.parse().unwrap(),
                                                        sevk:yeni_stok_string.parse().unwrap(),
                                                        stok:yeni_sevk_string.parse().unwrap(),
                                                        stoktan_sevke:yeni_stoktan_sevke_string.parse().unwrap(),
                                                        stoktan_silinen:yeni_stoktan_silinen_string.parse().unwrap(),
                                                        tarih:yeni_tarih_string,
                                                    };
                                                return Gunluk::hata_ayiklayici(state.gunluk_collection.find_one_and_replace(doc! {"urun_isim":urun_string, "tarih":tarih_string}, yeni_gunluk, None).await).await;
                                            }
                                        None =>
                                            {
                                                return (StatusCode::IM_A_TEAPOT, Json(serde_json::json!("")));
                                            }
                                    }
                            }
                        Err(bulunamadi) =>
                            {
                                return (StatusCode::IM_A_TEAPOT, Json(serde_json::json!(bulunamadi.to_string())));
                            }
                    }
            }
        async fn hepsi(State(state): State<AppState>) -> (StatusCode, Json<Value>)
            {
                let mut gunlukler_vector:Vec<Gunluk> = vec![];
                match state.gunluk_collection.find(None, None).await
                    {
                        Ok(mut bulundu) =>
                            {
                                while bulundu.advance().await.unwrap()
                                    {
                                        match bulundu.deserialize_current()
                                            {
                                                Ok(gunluk) =>
                                                    {
                                                        gunlukler_vector.push(gunluk);
                                                    }
                                                Err(hata_degeri) =>
                                                    {
                                                        return (StatusCode::IM_A_TEAPOT, Json(serde_json::json!(hata_degeri.to_string())));
                                                    }
                                            }
                                    }
                            }
                        Err(bulunamadi) =>
                            {
                                return (StatusCode::IM_A_TEAPOT, Json(serde_json::json!(bulunamadi.to_string())));
                            }
                    }
                (StatusCode::OK, Json(serde_json::json!(gunlukler_vector)))
            }
        async fn dusur(State(state): State<AppState>) -> (StatusCode, Json<Value>)
            {
                match state.gunluk_collection.delete_many(doc! {}, None).await
                    {
                        Ok(sonuc_degeri) =>
                            {
                                (StatusCode::OK, Json(serde_json::json!(sonuc_degeri)))
                            }
                        Err(hata_degeri) =>
                            {
                                (StatusCode::IM_A_TEAPOT, Json(serde_json::json!(hata_degeri.to_string())))
                            }
                    }
            }
    }
async fn collection_hata_ayiklama(sonuc:Result<CreateIndexResult, Error>)
    {
        match sonuc
            {
                Ok(sonuc_degeri) =>
                    {
                        println!("{:#?}", sonuc_degeri);
                    }
                Err(hata_degeri) =>
                    {
                        println!("{:#?}", hata_degeri);
                        panic!("Collection");
                    }
            }
    }
async fn kullanicilar_collection_structure(db:Database) -> Collection<Kullanici>
    {
        let benzersiz:IndexOptions = IndexOptions::builder().unique(true).build();
        let kullanicilar_kisitlama:IndexModel = IndexModel::builder()
                                                            .keys(doc! {"id" : 1})
                                                            .options(benzersiz)
                                                            .build();
        let kullanicilar_collection:Collection<Kullanici> = db.collection("kullanicilar");
        collection_hata_ayiklama(kullanicilar_collection.create_index(kullanicilar_kisitlama, None).await).await;
        kullanicilar_collection
    }
async fn kategoriler_collection_structure(db:Database) -> Collection<Kategori>
    {
        let benzersiz:IndexOptions = IndexOptions::builder().unique(true).build();
        let kategoriler_kisitlama:IndexModel = IndexModel::builder()
                                                            .keys(doc! {"isim" : 1})
                                                            .options(benzersiz)
                                                            .build();
        let kategoriler_collection:Collection<Kategori> = db.collection("kategoriler");
        collection_hata_ayiklama(kategoriler_collection.create_index(kategoriler_kisitlama, None).await).await;
        kategoriler_collection
    }
async fn urunler_collection_structure(db:Database) -> Collection<Urun>
    {
        let benzersiz:IndexOptions = IndexOptions::builder().unique(true).build();
        let urunler_kisitlama:IndexModel = IndexModel::builder()
                                                            .keys(doc! {"isim" : 1})
                                                            .options(benzersiz)
                                                            .build();
        let urunler_collection:Collection<Urun> = db.collection("urunler");
        collection_hata_ayiklama(urunler_collection.create_index(urunler_kisitlama, None).await).await;
        urunler_collection
    }
async fn gunluk_collection_structure(db:Database) -> Collection<Gunluk>
    {
        let benzersiz:IndexOptions = IndexOptions::builder().unique(true).build();
        let gunluk_kisitlama:IndexModel = IndexModel::builder()
                                                            .keys(doc! {"tarih":1, "urun":2, "urun_isim":3})
                                                            .options(benzersiz)
                                                            .build();
        let gunluk_collection:Collection<Gunluk> = db.collection("gunlukler");
        collection_hata_ayiklama(gunluk_collection.create_index(gunluk_kisitlama, None).await).await;
        gunluk_collection
    }
async fn create_db_structure(db:Database) 
->  (
        Collection<Kullanici>,
        Collection<Kategori>,
        Collection<Urun>,
        Collection<Gunluk>
    )
    {
        db.create_collection("kullanicilar", None).await.unwrap();
        db.create_collection("gunlukler", None).await.unwrap();
        db.create_collection("urunler", None).await.unwrap();
        db.create_collection("kategoriler", None).await.unwrap();
        let kullanicilar_collection = kullanicilar_collection_structure(db.clone()).await;
        let kategoriler_collection = kategoriler_collection_structure(db.clone()).await;
        let urunler_collection = urunler_collection_structure(db.clone()).await;
        let gunlukler_collection = gunluk_collection_structure(db.clone()).await;
        (kullanicilar_collection, kategoriler_collection, urunler_collection, gunlukler_collection)
    }
async fn routing(State(state): State<AppState>) -> Router
    {
        let kullanici_routers = Router::new()
        .route("/:id", get(Kullanici::kullanici))
        .route("/ekle/:isim/:soyisim/:id/:sifre", get(Kullanici::ekle))
        .route("/sil/:id", get(Kullanici::sil))
        .route("/duzenle/:id/:yeni_isim/:yeni_soyisim/:yeni_id/:yeni_sifre", get(Kullanici::duzenle))
        .route("/hepsi", get(Kullanici::hepsi))
        .route("/dusur", get(Kullanici::dusur));

        let kategori_routers = Router::new()
        .route("/:isim", get(Kategori::kategori))
        .route("/ekle/:isim/:ust_kategori", get(Kategori::ekle))
        .route("/sil/:isim", get(Kategori::sil))
        .route("/duzenle/:isim/:yeni_isim/:yeni_ust_kategori", get(Kategori::duzenle))
        .route("/hepsi", get(Kategori::hepsi))
        .route("/dusur", get(Kategori::dusur));

        let urun_routers = Router::new()
        .route("/:isim", get(Urun::urun))
        .route("/ekle/:isim/:kategori", get(Urun::ekle))
        .route("/sil/:isim", get(Urun::sil))
        .route("/duzenle/:isim/:yeni_isim/:yeni_kategori", get(Urun::duzenle))
        .route("/hepsi", get(Urun::hepsi))
        .route("/dusur", get(Urun::dusur));

        let gunluk_routers = Router::new()
        .route("/:urun/:tarih", get(Gunluk::gunluk))
        .route("/ekle/:urun/:personel_sayisi/:hedeflenen/:ulasilan/:atilan/:stok/:sevk/:stoktan_sevke/:stoktan_silinen/:tarih", get(Gunluk::ekle))
        .route("/sil/:urun/:tarih", get(Gunluk::sil))
        .route("/duzenle/:urun/:tarih/:yeni_urun/:yeni_personel_sayisi/:yeni_hedeflenen/:yeni_ulasilan/:yeni_atilan/:yeni_stok/:yeni_sevk/:yeni_stoktan_sevke/:yeni_stoktan_silinen/:yeni_tarih", get(Gunluk::duzenle))
        .route("/hepsi", get(Gunluk::hepsi))
        .route("/dusur", get(Gunluk::dusur));

        let app = Router::new()
            .route("/", get(alive_handler))
            .nest("/kullanici", kullanici_routers)
            .nest("/kategori", kategori_routers)
            .nest("/urun", urun_routers)
            .nest("/gunluk", gunluk_routers)
            .layer(CorsLayer::permissive())
            .with_state(state.clone());
        app
    }
async fn tarih_kontrol(tarih_string:String) -> bool
    {
        match NaiveDate::parse_from_str(&tarih_string, "%d.%m.%Y")
            {
                Ok(date) =>
                    {
                        println!("{}", date);
                        return true;
                    }
                Err(err_val) =>
                    {
                        println!("{}", err_val);
                        return false;
                    }
            }
    }
#[tokio::main]
async fn main()
    {
        println!("Hello World\n");

        let client_options = ClientOptions::parse(CONNECTION_STRING).await.unwrap();
        let client = Client::with_options(client_options).unwrap();
        let db = client.database(DB_NAME);
        let collections = create_db_structure(db).await;
        let state = AppState
            {
                kullanici_collection:collections.0,
                kategori_collection:collections.1,
                urun_collection:collections.2,
                gunluk_collection:collections.3,
            };
        let app = routing(axum::extract::State(state)).await;
        

        let listener = tokio::net::TcpListener::bind(BIND_STRING).await.unwrap();
        axum::serve(listener, app).await.unwrap();
    }
async fn alive_handler() -> impl IntoResponse
    {
        let alive_json = serde_json::json!({
            "status" : "success",
            "message" : "Hello World"
        });
        (StatusCode::OK, Json(alive_json))
    }