const readline = require("readline");

const io = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

io.on("line", number => {
    console.log(`${number} squared is ${number * number}`);
})
