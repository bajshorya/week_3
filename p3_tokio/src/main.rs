use log::Level;
use tokio::runtime::Runtime;
use tokio::time;

// #[tokio::main]

fn main() {
    simple_logger::init_with_level(Level::Info).unwrap();
    let rt = Runtime::new().unwrap();
    let future = run();
    rt.block_on(future);
}
async fn run() {
    log::info!("Sleeping");
    time::sleep(time::Duration::from_secs(3)).await;
    log::info!("Awake!");
}

// async fn test() {
//     std::thread::sleep(std::time::Duration::from_millis(5000));
//     println!("hello this is an async function ");
// }

// struct F1Racer {
//     name: String,
//     completed_laps: u8,
//     laps: u8,
//     best_lap_time: u8,
//     lap_times: Vec<u8>,
// }
// impl F1Racer {
//     fn new() -> F1Racer {
//         return F1Racer {
//             name: "Shorya Baj".to_string(),
//             completed_laps: 5,
//             laps: 0,
//             best_lap_time: 255,
//             lap_times: vec![87u8, 64, 126, 88, 76],
//         };
//     }
// }
// impl std::future::Future for F1Racer {
//     type Output = u8;
//     fn poll(
//         self: std::pin::Pin<&mut Self>,
//         cx: &mut std::task::Context<'_>,
//     ) -> std::task::Poll<Self::Output> {
//         return std::task::Poll::Ready(self.best_lap_time);
//     }
// }
