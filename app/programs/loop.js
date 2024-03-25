function fibonacci(n) {
    let a = 0;
    let b = 1;
    for (let i = 0; i < n; i++) {
        const temp = b;
        b = a + b;
        a = temp;
    }
    return a;
}
