use std::io;

fn main() {
    let mut string = String::new();
    io::stdin().read_line(&mut string).unwrap();
    let number: i32 = string.trim().parse().unwrap();

    println!("{} squared is {}", number, number * number);
}
