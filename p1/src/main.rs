// struct Rect {
//     width: u32,
//     height: u32,
// }

// impl Rect {
//     fn area(&self) -> u32 {
//         self.width * self.height
//     }
// }

// fn main() {
//     let rect = Rect {
//         width: 30,
//         height: 50,
//     };
//     print!("The area of the rectangle is {}", rect.area());
// }

// #[derive(Copy, Clone)]
// struct User {
//     active: bool,
//     sign_in_count: u64,
// }

use std::collections::HashMap;

// #[derive(Copy, Clone, Debug)]
// enum Direction {
//     North,
//     South,
//     East,
//     West,
// }
// Fix the code so that it compiles.
//reference and borrowing
fn group_by_values(vec: Vec<(String, i32)>) -> HashMap<String, i32> {
    let mut hm = HashMap::new();
    for (key, value) in vec {
        hm.insert(key, value);
    }
    return hm;
}
pub trait Summary {
    fn summarize(&self) -> String;
}
struct User {
    name: String,
    age: u32,
}
impl Summary for User {
    fn summarize(&self) -> String {
        return format!("name:{},age:{}", self.name, self.age);
    }
}
fn longest(a: String, b: String) -> String {
    let len_1 = a.len();
    let len_2 = b.len();
    if len_1 > len_2 {
        return a;
    } else {
        return b;
    }
}
fn main() {
    let a: String = String::from("valuedd");
    let b: String = String::from("value2");
    let longer_string = longest(a, b);
    println!("{}", longer_string);

    let input_vec = vec![(String::from("v1"), 21), (String::from("v2"), 22)];
    let hm = group_by_values(input_vec);
    println!("{:?}", hm);
    let mut str1 = String::from("modifiable");
    let str2 = String::from("fixed string");
    let mut str_ptr: &String;
    str_ptr = &str1;
    println!("ptr currently points to {}", str_ptr);
    str_ptr = &str2;
    println!("ptr currently points to {}", str_ptr);
    str1.push_str(" string");
    str_ptr = &str1;
    println!("ptr currently points to {}", str_ptr);
    let user = User {
        name: String::from("Shorya"),
        age: 12,
    };
    println!("{}", user.summarize());
}
// fn main() {
//     let mut user1 = User {
//         active: true,
//         sign_in_count: 1,
//     };

//     print_name(user1);
//     print!("User 1 username: {}", user1.active);
//     let my_direction = Direction::North;
//     println!("Direction {:?}", my_direction);
// }
// fn print_name(user1: User) {
//     print!("User 1 username: {}", user1.active);
// }
