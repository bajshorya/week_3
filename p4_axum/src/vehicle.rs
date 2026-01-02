use axum::Json;
use axum::debug_handler;
use serde::Deserialize;

#[derive(Debug, serde::Serialize, Deserialize)]
pub struct Vehicle {
    manufacturer: String,
    model: String,
    year: u32,
    id: Option<String>,
}

#[debug_handler]
pub async fn vehicle_get() -> Json<Vehicle> {
    println!("Get function called");
    Json::from(Vehicle {
        manufacturer: "toyota".to_string(),
        model: "2024".to_string(),
        year: 2021,
        id: Some(uuid::Uuid::new_v4().to_string()),
    })
}
pub async fn vehicle_post(Json(mut v): Json<Vehicle>) -> Json<Vehicle> {
    println!(
        "Manufacturer:{0}, Model:{1}, Year:{2}",
        v.manufacturer, v.model, v.year
    );
    v.id = Some(uuid::Uuid::new_v4().to_string());
    Json::from(v)
}
