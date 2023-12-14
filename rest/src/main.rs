use axum::{routing::get, extract::{Path, State}, Router, Json, http::StatusCode, response::IntoResponse};
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
        async fn kullanici(Path(isim):Path<String>, State(state):State<AppState>) -> impl IntoResponse
            {
                println!("{}", isim);
                let aranan_kullanici = state.kullanici_collection.find_one(doc! {"isim":isim}, None).await.unwrap().unwrap();
                (StatusCode::OK, Json(serde_json::json!(aranan_kullanici)))
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
        async fn kategori_ekle(Path((isim, ust_kategori)):Path<(String, String)>, State(state):State<AppState>) -> impl IntoResponse
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
        async fn urun_ekle(Path((isim, kategori)):Path<(String, String)>, State(state):State<AppState>) -> impl IntoResponse
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
        async fn gunluk_ekle(Path((urun_string, personel_sayisi_string, hedeflenen_string, ulasilan_string, atilan_string, tarih_string)):Path<(String, String, String, String, String, String)>, State(state):State<AppState>) -> impl IntoResponse
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
        //kullanicilar_collection.insert_one(ahmet, None).await.unwrap();
        //println!("{:#?}", kullanicilar_collection.find_one(doc! {"id":"Tahinli"}, None).await.unwrap());
        //println!("{:#?}", kullanicilar_collection.find_one_and_delete(doc! {"id":"Tahinli"}, None).await.unwrap());
        //kullanicilar_collection.find_one_and_replace(doc! {"id":"Tahinli"}, ahmet, None).await.unwrap();
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
        let app = Router::new()
            .route("/", get(alive_handler))
            .route("/kullanici/:id", get(Kullanici::kullanici))
            .route("/kategori/:isim", get(Kategori::kategori))
            .route("/kategori/ekle/:isim/:ust_kategori", get(Kategori::kategori_ekle))
            .route("/urun/:isim", get(Urun::urun))
            .route("/urun/ekle/:isim/:kategori", get(Urun::urun_ekle))
            .route("/gunluk/:urun/:tarih", get(Gunluk::gunluk))
            .route("/gunluk/ekle/:urun/:personel_sayisi/:hedeflenen/:ulasilan/:atilan/:tarih", get(Gunluk::gunluk_ekle))
            .with_state(state);
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