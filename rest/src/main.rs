use axum::{routing::get, extract::Path, Router, Json, http::StatusCode, response::IntoResponse};
use mongodb::{Client, options::{ClientOptions, IndexOptions}, Database, IndexModel, bson::doc, Collection};
use serde::{Serialize, Deserialize};

const DB_NAME:&str = "gurme";

#[derive(Debug, Serialize, Deserialize)]
struct Urun
    {
        isim:String,
        kategori:Kategori,
    }
#[derive(Debug, Serialize, Deserialize)]
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
    }
#[derive(Debug, Serialize, Deserialize)]
struct Kategori
    {
        isim:String,
        ust_kategori:Option<Box<Kategori>>,
    }

async fn create_db_structure(db:Database)
    {
        db.create_collection("kullanicilar", None).await.unwrap();
        db.create_collection("gunluk", None).await.unwrap();
        db.create_collection("urunler", None).await.unwrap();
        db.create_collection("kategoriler", None).await.unwrap();

        let benzersiz:IndexOptions = IndexOptions::builder().unique(true).build();
        let kullanicilar_kisitlama:IndexModel = IndexModel::builder()
                                                            .keys(doc! {"id" : 1})
                                                            .options(benzersiz)
                                                            .build();
        let kullanicilar_collection:Collection<Kullanici> = db.collection("kullanicilar");
    }
#[tokio::main]
async fn main()
    {
        println!("Hello World\n");

        let client_options = ClientOptions::parse("mongodb://172.17.0.2:27017").await.unwrap();
        let client = Client::with_options(client_options).unwrap();
        let db = client.database(DB_NAME);
        create_db_structure(db).await;
        


        let app = Router::new()
            .route("/", get(alive_handler))
            .route("/urun/:id", get(urun))
            .route("/urun-sil/:id", get(urun_sil))
            .route("/urun-ekle/:id/:isim", get(urun_ekle))
            .route("/urun-duzenle/:id/:yeniisim", get(urun_duzenle));
        let listener = tokio::net::TcpListener::bind("127.0.0.1:2000").await.unwrap();
        axum::serve(listener, app).await.unwrap();
    }
    async fn urun(Path(id):Path<u16>) -> impl IntoResponse
    {
        //(StatusCode::OK, Json(serde_json::json!(urun)))
    }
async fn urun_sil(Path(id):Path<u16>) -> impl IntoResponse
    {
        //(StatusCode::OK, Json(serde_json::json!(urun)))
    }
async fn urun_ekle(Path((id, isim)):Path<(u16, String)>) -> impl IntoResponse
    {
        //(StatusCode::OK, Json(serde_json::json!(urun)))
    }
async fn urun_duzenle(Path((id, yeni_isim)):Path<(u16, String)>) -> impl IntoResponse
    {
        //(StatusCode::OK, Json(serde_json::json!(urun)))
    }
async fn alive_handler() -> impl IntoResponse
    {
        let alive_json = serde_json::json!({
            "status" : "success",
            "message" : "Hello World"
        });
        (StatusCode::OK, Json(alive_json))
    }