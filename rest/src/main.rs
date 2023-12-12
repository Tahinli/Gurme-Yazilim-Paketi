use axum::{routing::get, extract::{Path, State}, Router, Json, http::StatusCode, response::IntoResponse};
use mongodb::{Client, options::{ClientOptions, IndexOptions}, Database, IndexModel, bson::{doc, DateTime}, Collection};
use serde::{Serialize, Deserialize};

const DB_NAME:&str = "gurme";
const CONNECTION_STRING:&str = "mongodb://172.17.0.2:27017";
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
    }
#[derive(Debug, Clone, Serialize, Deserialize)]
struct Urun
    {
        isim:String,
        kategori:Kategori,
    }
impl Urun 
    {
        async fn urun(Path(isim):Path<String>, State(state):State<AppState>) -> impl IntoResponse
            {
                println!("{}", isim);
                let aranan_kategori = state.urun_collection.find_one(doc! {"isim":isim}, None).await.unwrap().unwrap();
                (StatusCode::OK, Json(serde_json::json!(aranan_kategori)))
            }
    }
#[derive(Debug, Clone, Serialize, Deserialize)]
struct Gunluk
    {
        urun:Urun,
        personel_sayisi:u64,
        hedeflenen:u64,
        ulasilan:u64,
        atilan:u64,
        tarih:DateTime,
    }
impl Gunluk 
    {
        async fn gunluk(Path(tarih):Path<String>, State(state):State<AppState>) -> impl IntoResponse
            {
                println!("{}", tarih);
                //TODO DATETIME
                let tarih:DateTime = tarih.parse().unwrap();
                let aranan_gunluk = state.gunluk_collection.find_one(doc! {"tarih":isim}, None).await.unwrap().unwrap();
                (StatusCode::OK, Json(serde_json::json!(aranan_gunluk)))
            }
    }
async fn urunler_collection_structure(db:Database) -> Collection<Urun>
    {
        let benzersiz:IndexOptions = IndexOptions::builder().unique(true).build();
        let urunler_kisitlama:IndexModel = IndexModel::builder()
                                                            .keys(doc! {"isim" : 1})
                                                            .options(benzersiz)
                                                            .build();
        let urunler_collection:Collection<Urun> = db.collection("kullanicilar");
        urunler_collection.create_index(urunler_kisitlama, None).await.unwrap();
        urunler_collection
    }
async fn kategoriler_collection_structure(db:Database) -> Collection<Kategori>
    {
        let benzersiz:IndexOptions = IndexOptions::builder().unique(true).build();
        let kategoriler_kisitlama:IndexModel = IndexModel::builder()
                                                            .keys(doc! {"isim" : 1})
                                                            .options(benzersiz)
                                                            .build();
        let kategoriler_collection:Collection<Kategori> = db.collection("kullanicilar");
        kategoriler_collection.create_index(kategoriler_kisitlama, None).await.unwrap();
        kategoriler_collection
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
async fn gunluk_collection_structure(db:Database) -> Collection<Gunluk>
    {
        let benzersiz:IndexOptions = IndexOptions::builder().unique(true).build();
        let gunluk_kisitlama:IndexModel = IndexModel::builder()
                                                            .keys(doc! {"tarih" : 1})
                                                            .options(benzersiz)
                                                            .build();
        let gunluk_collection:Collection<Gunluk> = db.collection("kullanicilar");
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
            .route("/kullanici/:kullanici", get(Kullanici::kullanici))
            .route("/kategori/:isim", get(Kategori::kategori))
            .route("/urun/:isim", get(Urun::urun))
            .route("/gunluk/:tarih", get(Gunluk::gunluk))
            .with_state(state);
        let listener = tokio::net::TcpListener::bind("127.0.0.1:2000").await.unwrap();
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