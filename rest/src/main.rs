use axum::{routing::get, extract::Path, Router, Json, http::StatusCode, response::IntoResponse};
use mongodb::{Client, options::{ClientOptions, IndexOptions}, Database, IndexModel, bson::{doc, Document, DateTime}, Collection};
use serde::{Serialize, Deserialize};

const DB_NAME:&str = "gurme";

#[derive(Debug, Serialize, Deserialize)]
struct Urun
    {
        isim:String,
        kategori:Kategori,
    }
impl Urun 
    {
        async fn urun(Path(isim):Path<String>) -> impl IntoResponse
            {
                //(StatusCode::OK, Json(serde_json::json!(urun)))
            }
        async fn urun_sil(Path(isim):Path<String>) -> impl IntoResponse
            {
                //(StatusCode::OK, Json(serde_json::json!(urun)))
            }
        async fn urun_ekle(Path((isim, kategori)):Path<(String, Kategori)>, urunler_collection:Collection<Urun>) -> impl IntoResponse
            {
                urunler_collection.insert_one(ahmet, None).await.unwrap();
                //(StatusCode::OK, Json(serde_json::json!(urun)))
            }
        async fn urun_duzenle(Path((isim, yeni_isim)):Path<(String, String)>) -> impl IntoResponse
            {
                //(StatusCode::OK, Json(serde_json::json!(urun)))
            }
    }
#[derive(Debug, Clone,Serialize, Deserialize)]
struct Kullanici
    {
        isim:String,
        soyisim:String,
        id:String,
        sifre:String,
    }
#[derive(Debug, Serialize, Deserialize)]
struct Gunluk
    {
        urun:Urun,
        personel_sayisi:u64,
        hedeflenen:u64,
        ulasilan:u64,
        atilan:u64,
        tarih:DateTime,
    }
#[derive(Debug, Serialize, Deserialize)]
struct Kategori
    {
        isim:String,
        ust_kategori:Option<Box<Kategori>>,
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

        let client_options = ClientOptions::parse("mongodb://172.17.0.2:27017").await.unwrap();
        let client = Client::with_options(client_options).unwrap();
        let db = client.database(DB_NAME);
        let collections = create_db_structure(db).await;
        


        let app = Router::new()
            .route("/", get(alive_handler))
            .route("/urun/:isim", get(Urun::urun))
            .route("/urun-sil/:isim", get(Urun::urun_sil))
            .route("/urun-ekle/:kategori/:isim", get(Urun::urun_ekle)).with_state(collections.2.clone())
            .route("/urun-duzenle/:isim/:yeniisim", get(Urun::urun_duzenle));
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