use rand::Rng;
use std::{cmp::Ordering, io};

fn main() {
    let s = test(1);
    println!("{}", s);

    let mut hello = String::from("hello");
    hello.push_str(",");
    const MAX_COUNT: i32 = 10_00;
    let count = rand::thread_rng().gen_range(1, 101);
    println!("{} {}, {}", hello, count, MAX_COUNT);

    loop {
        let mut guess = String::new();
        io::stdin().read_line(&mut guess).expect("error");
        print!("guess: {}", guess);
        // let guess: u32 = guess.trim().parse().expect("类型转换错误");
        let guess: u32 = match guess.trim().parse() {
            Ok(num) => num,
            Err(_) => continue,
        };
        match guess.cmp(&count) {
            Ordering::Less => {
                println!("Too Small")
            }
            Ordering::Equal => {
                println!("Equal");
                break;
            }
            Ordering::Greater => {
                println!("Too Big")
            }
        }
    }
}

fn test(mut x: i32) -> i32 {
    let res = loop {
        x += 1;
        if x >= 1 {
            break 10;
        }
    };

    let mut a = 1;
    while a <= 3 {
        println!("{}!", a);
        if a == 3 {
            println!("Take Off!");
        }
        a += 1;
    }

    for item in [1, 2, 3].iter() {
        println!("Item is {}.", item);
    }

    for item in (1..4).rev() {
        println!("Item is {}!", item);
        if item == 1 {
            println!("TAKE OFF!")
        }
    }

    let num = if x > 5 { 10 } else { 1 };
    println!("It is Test({}-{}).", x, res);
    if x < 10 {
        return x + num;
    } else {
        return x * 10;
    }
}
