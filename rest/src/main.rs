use axum::{routing::get, extract::Path, Router, Json, http::StatusCode, response::IntoResponse};

async fn urun(Path(id):Path<u32>) -> impl IntoResponse
    {
        let urun_json = serde_json::json!({
            "id" : id,
            "isim" : "mantı"
        });
        (StatusCode::OK, Json(urun_json))
    }
async fn urun_sil(Path(id):Path<u32>) -> impl IntoResponse
    {
        let urun_json = serde_json::json!({
            "id" : id,
            "isim" : "mantı"
        });
        (StatusCode::OK, Json(urun_json))
    }
async fn urun_ekle(Path((id, isim)):Path<(u32, String)>) -> impl IntoResponse
    {
        let urun_json = serde_json::json!({
            "id" : id,
            "isim" : isim
        });
        (StatusCode::OK, Json(urun_json))
    }
async fn urun_duzenle(Path((id, yeni_isim)):Path<(u32, String)>) -> impl IntoResponse
    {
        let urun_json = serde_json::json!({
            "id" : id,
            "isim" : yeni_isim
        });
        (StatusCode::OK, Json(urun_json))
    }
async fn alive_handler() -> impl IntoResponse
    {
        let alive_json = serde_json::json!({
            "status" : "success",
            "message" : "Hello World"
        });
        (StatusCode::OK, Json(alive_json))
    }
#[tokio::main]
async fn main()
    {
        println!("Hello World\n");
        let app = Router::new()
            .route("/", get(alive_handler))
            .route("/urun/:id", get(urun))
            .route("/urun-sil/:id", get(urun_sil))
            .route("/urun-ekle/:id/:isim", get(urun_ekle))
            .route("/urun-duzenle/:id/:yeniisim", get(urun_duzenle));
        let listener = tokio::net::TcpListener::bind("localhost:80").await.unwrap();
        axum::serve(listener, app).await.unwrap();
    }
