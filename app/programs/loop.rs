fn fibonacci(n: u32) -> u32 {
    let mut a = 0;
    let mut b = 1;
    for i in 0..n {
        let temp = b;
        b = a + b;
        a = temp;
    }
    a
}
