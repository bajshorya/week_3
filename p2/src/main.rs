use rand::Rng;
use std::cmp::Ordering;
use std::io;
fn main() {
    println!("Guess!");
    let secret_num = rand::thread_rng().gen_range(1..101);

    loop {
        println!("Guess your number");
        // println!("secret is:{} ", secret_num);

        let mut guess_num = String::new();

        io::stdin().read_line(&mut guess_num).expect("failed");
        let guess: u32 = guess_num
            .trim()
            .parse()
            .expect("please type a number only ! ");
        // println!("parsed num:{}", guess);
        match guess.cmp(&secret_num) {
            Ordering::Less => println!("Too Small"),
            Ordering::Greater => println!("Too Big"),
            Ordering::Equal => {
                println!("You Win");
                break;
            }
        }
        // println!("number is:{} ", guess_num);
    }
}
