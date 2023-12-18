use axum::{routing::get, extract::{Path, State}, Router, Json, http::StatusCode, response::IntoResponse};
use tower_http::cors::CorsLayer;
use mongodb::{Client, options::{ClientOptions, IndexOptions}, Database, IndexModel, bson::doc, Collection};
use serde::{Serialize, Deserialize};

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
        async fn kullanici(Path(id):Path<String>, State(state):State<AppState>) -> impl IntoResponse
            {
                println!("{}", id);
                let aranan_kullanici = state.kullanici_collection.find_one(doc! {"id":id}, None).await.unwrap().unwrap();
                (StatusCode::OK, Json(serde_json::json!(aranan_kullanici)))
            }
        async fn ekle(Path((isim, soyisim, id, sifre)):Path<(String, String, String, String)>, State(state):State<AppState>) -> impl IntoResponse
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
                state.kullanici_collection.insert_one(kullanici, None).await.unwrap();
            }
        async fn sil(Path(id):Path<String>, State(state):State<AppState>) -> impl IntoResponse
            {
                println!("{}", id);
                state.kullanici_collection.find_one_and_delete(doc! {"id":id}, None).await.unwrap();
            }
        async fn duzenle(Path((id, yeni_isim, yeni_soyisim, yeni_id, yeni_sifre)):Path<(String, String, String, String, String)>, State(state):State<AppState>) -> impl IntoResponse
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
                state.kullanici_collection.find_one_and_replace(doc! {"id":id}, yeni_kullanici, None).await.unwrap();
            }
        async fn hepsi(State(state): State<AppState>) -> impl IntoResponse
            {
                let mut kullanicilar_vector:Vec<Kullanici> = vec![];
                let mut kullanicilar_cursor = state.kullanici_collection.find(None, None).await.unwrap();
                while kullanicilar_cursor.advance().await.unwrap() 
                    {
                        kullanicilar_vector.push(kullanicilar_cursor.deserialize_current().unwrap());
                    }
                (StatusCode::OK, Json(serde_json::json!(kullanicilar_vector)))
            }
    }
#[derive(Debug, Clone, Serialize, Deserialize)]
struct Kategori
    {
        isim:String,
        ust_kategori:Option<Box<Kategori>>,
    }
impl Kategori 
    {
        async fn kategori(Path(isim):Path<String>, State(state):State<AppState>) -> impl IntoResponse
            {
                println!("{}", isim);
                let aranan_kategori = state.kategori_collection.find_one(doc! {"isim":isim}, None).await.unwrap().unwrap();
                (StatusCode::OK, Json(serde_json::json!(aranan_kategori)))
            }
        async fn ekle(Path((isim, ust_kategori)):Path<(String, String)>, State(state):State<AppState>) -> impl IntoResponse
            {
                println!("Kategori Ekle");
                println!("{}", isim);
                println!("{}", ust_kategori);
                let ust_kategori = state.kategori_collection.find_one(doc! {"isim": ust_kategori}, None).await.unwrap();
                let mut kategori:Kategori = Kategori
                    {
                        isim,
                        ust_kategori:None,
                    };
                match ust_kategori 
                    {
                        Some(var) =>
                            {
                                kategori.ust_kategori = Some(Box::new(var));
                            }
                        None =>{}
                    }
                state.kategori_collection.insert_one(kategori, None).await.unwrap();
            }
        async fn sil(Path(isim):Path<String>, State(state):State<AppState>) -> impl IntoResponse
            {
                println!("{}", isim);

                //TO-DO ya kategori yoksa
                state.kategori_collection.find_one_and_delete(doc! {"isim":isim}, None).await.unwrap();
            }
        async fn duzenle(Path((isim, yeni_isim, yeni_ust_kategori)):Path<(String, String, String)>, State(state):State<AppState>) -> impl IntoResponse
            {
                println!("{}", isim);
                println!("{}", yeni_isim);
                println!("{}", yeni_ust_kategori);

                let mut yeni_kategori:Kategori = Kategori
                    {
                        isim:yeni_isim,
                        ust_kategori:None,
                    };
                let ust_kategori = state.kategori_collection.find_one(doc! {"isim": yeni_ust_kategori}, None).await.unwrap();
                match ust_kategori 
                    {
                        Some(var) =>
                            {
                                yeni_kategori.ust_kategori = Some(Box::new(var));
                            }
                        None =>{}
                    }
                state.kategori_collection.find_one_and_replace(doc!{"isim":isim}, yeni_kategori, None).await.unwrap();
            }
        async fn hepsi(State(state): State<AppState>) -> impl IntoResponse
            {
                let mut kategoriler_vector:Vec<Kategori> = vec![];
                let mut kategoriler_cursor = state.kategori_collection.find(None, None).await.unwrap();
                while kategoriler_cursor.advance().await.unwrap() 
                    {
                        kategoriler_vector.push(kategoriler_cursor.deserialize_current().unwrap());
                    }
                (StatusCode::OK, Json(serde_json::json!(kategoriler_vector)))
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
        async fn urun(Path(isim):Path<String>, State(state):State<AppState>) -> impl IntoResponse
            {
                println!("{}", isim);
                let aranan_urun = state.urun_collection.find_one(doc! {"isim":isim}, None).await.unwrap().unwrap();
                (StatusCode::OK, Json(serde_json::json!(aranan_urun)))
            }
        async fn ekle(Path((isim, kategori)):Path<(String, String)>, State(state):State<AppState>) -> impl IntoResponse
            {
                println!("{}", isim);
                println!("{}", kategori);

                let aranan_kategori = state.kategori_collection.find_one(doc! {"isim":kategori}, None).await.unwrap().unwrap();

                let urun = Urun
                    {
                        isim,
                        kategori:aranan_kategori.clone(),
                        kategori_isim:aranan_kategori.isim,
                    };
                state.urun_collection.insert_one(urun, None).await.unwrap();
            }
        async fn sil(Path(isim):Path<String>, State(state):State<AppState>) -> impl IntoResponse
            {
                println!("{}", isim);
                //TO-DO ya yoksa?
                state.urun_collection.find_one_and_delete(doc!{"isim":isim}, None).await.unwrap();
            }
        async fn duzenle(Path((isim, yeni_isim, yeni_kategori)):Path<(String, String, String)>, State(state):State<AppState>) -> impl IntoResponse
            {
                println!("{}", isim);
                println!("{}", yeni_isim);
                println!("{}", yeni_kategori);
                
                //TO-DO ya ürün ya da kategori yoksa
                let aranan_kategori = state.kategori_collection.find_one(doc! {"isim":yeni_kategori}, None).await.unwrap().unwrap();

                let yeni_urun = Urun
                    {
                        isim:yeni_isim,
                        kategori:aranan_kategori.clone(),
                        kategori_isim:aranan_kategori.isim,
                    };
                
                state.urun_collection.find_one_and_replace(doc! {"isim":isim}, yeni_urun, None).await.unwrap();
            }
        async fn hepsi(State(state): State<AppState>) -> impl IntoResponse
            {
                let mut urunler_vector:Vec<Urun> = vec![];
                let mut urunler_cursor = state.urun_collection.find(None, None).await.unwrap();
                while urunler_cursor.advance().await.unwrap() 
                    {
                        urunler_vector.push(urunler_cursor.deserialize_current().unwrap());
                    }
                (StatusCode::OK, Json(serde_json::json!(urunler_vector)))
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
        tarih:String,
    }
impl Gunluk 
    {
        async fn gunluk(Path((urun_string, tarih_string)):Path<(String, String)>, State(state):State<AppState>) -> impl IntoResponse
            {
                println!("{}", urun_string);
                println!("{}", tarih_string);
                //TO-DO tarihi tarih mi diye bak
                let urun = state.urun_collection
                                                            .find_one(doc! {"isim": urun_string}
                                                            , None).await.unwrap().unwrap();
                let aranan_gunluk = state.gunluk_collection
                                            .find_one(doc! {"tarih":tarih_string, "urun_isim":urun.isim}
                                            ,None).await.unwrap().unwrap();
                (StatusCode::OK, Json(serde_json::json!(aranan_gunluk)))
            }
        async fn ekle(Path((urun_string, personel_sayisi_string, hedeflenen_string, ulasilan_string, atilan_string, tarih_string)):Path<(String, String, String, String, String, String)>, State(state):State<AppState>) -> impl IntoResponse
            {
                println!("{}", urun_string);
                println!("{}", personel_sayisi_string);
                println!("{}", hedeflenen_string);
                println!("{}", ulasilan_string);
                println!("{}", atilan_string);
                println!("{}", tarih_string);
                
                //TO-DO tarihi tarih mi diye bak

                let urun = state.urun_collection
                                .find_one(doc! {"isim": urun_string}
                                , None).await.unwrap().unwrap();
                let gunluk = Gunluk
                    {
                        urun:urun.clone(),
                        urun_isim:urun.isim,
                        personel_sayisi:personel_sayisi_string.parse().unwrap(),
                        hedeflenen:hedeflenen_string.parse().unwrap(),
                        ulasilan:ulasilan_string.parse().unwrap(),
                        atilan:atilan_string.parse().unwrap(),
                        tarih:tarih_string,
                    };
                state.gunluk_collection.insert_one(gunluk, None).await.unwrap();
            }
        async fn sil(Path((urun_string, tarih_string)):Path<(String, String)>, State(state):State<AppState>) -> impl IntoResponse
            {
                println!("{}", urun_string);
                println!("{}", tarih_string);

                //TO-DO ya ürün yoksa ?
                state.urun_collection.find_one_and_delete(doc! {"urun_isim":urun_string, "tarih":tarih_string}, None).await.unwrap();
            }
        async fn duzenle(Path((urun_string, tarih_string, yeni_urun_string, yeni_personel_sayisi_string, yeni_hedeflenen_string, yeni_ulasilan_string, yeni_atilan_string, yeni_tarih_string)):Path<(String, String, String, String, String, String, String, String)>, State(state):State<AppState>) -> impl IntoResponse
            {
                println!("{}", urun_string);
                println!("{}", tarih_string);
                println!("{}", yeni_urun_string);
                println!("{}", yeni_personel_sayisi_string);
                println!("{}", yeni_hedeflenen_string);
                println!("{}", yeni_ulasilan_string);
                println!("{}", yeni_atilan_string);
                println!("{}", yeni_tarih_string);

                let yeni_urun = state.urun_collection
                                .find_one(doc! {"isim": yeni_urun_string}
                                , None).await.unwrap().unwrap();
                let yeni_gunluk = Gunluk
                    {
                        urun:yeni_urun.clone(),
                        urun_isim:yeni_urun.isim,
                        personel_sayisi:yeni_personel_sayisi_string.parse().unwrap(),
                        hedeflenen:yeni_hedeflenen_string.parse().unwrap(),
                        ulasilan:yeni_ulasilan_string.parse().unwrap(),
                        atilan:yeni_atilan_string.parse().unwrap(),
                        tarih:yeni_tarih_string,
                    };
                state.gunluk_collection.find_one_and_replace(doc! {"urun_isim":urun_string, "tarih":tarih_string}, yeni_gunluk, None).await.unwrap();
            }
        async fn hepsi(State(state): State<AppState>) -> impl IntoResponse
            {
                let mut gunlukler_vector:Vec<Gunluk> = vec![];
                let mut gunlukler_cursor = state.gunluk_collection.find(None, None).await.unwrap();
                while gunlukler_cursor.advance().await.unwrap() 
                    {
                        gunlukler_vector.push(gunlukler_cursor.deserialize_current().unwrap());
                    }
                (StatusCode::OK, Json(serde_json::json!(gunlukler_vector)))
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
        kullanicilar_collection.create_index(kullanicilar_kisitlama, None).await.unwrap();
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
        kategoriler_collection.create_index(kategoriler_kisitlama, None).await.unwrap();
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
        urunler_collection.create_index(urunler_kisitlama, None).await.unwrap();
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
        gunluk_collection.create_index(gunluk_kisitlama, None).await.unwrap();
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
        .route("/hepsi", get(Kullanici::hepsi));

        let kategori_routers = Router::new()
        .route("/:isim", get(Kategori::kategori))
        .route("/ekle/:isim/:ust_kategori", get(Kategori::ekle))
        .route("/sil/:isim", get(Kategori::sil))
        .route("/duzenle/:isim/:yeni_isim/:yeni_ust_kategori", get(Kategori::duzenle))
        .route("/hepsi", get(Kategori::hepsi));

        let urun_routers = Router::new()
        .route("/:isim", get(Urun::urun))
        .route("/ekle/:isim/:kategori", get(Urun::ekle))
        .route("/sil/:isim", get(Urun::sil))
        .route("/duzenle/:isim/:yeni_isim/:yeni_kategori", get(Urun::duzenle))
        .route("/hepsi", get(Urun::hepsi));

        let gunluk_routers = Router::new()
        .route("/:urun/:tarih", get(Gunluk::gunluk))
        .route("/ekle/:urun/:personel_sayisi/:hedeflenen/:ulasilan/:atilan/:tarih", get(Gunluk::ekle))
        .route("/sil/:urun/:tarih", get(Gunluk::sil))
        .route("/duzenle/:urun/:tarih/:yeni_urun/:yeni_personel_sayisi/:yeni_hedeflenen/:yeni_ulasilan/:yeni_atilan/:yeni_tarih", get(Gunluk::duzenle))
        .route("/hepsi", get(Gunluk::hepsi));

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