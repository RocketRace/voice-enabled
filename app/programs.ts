export const programHere = "$! PRORGAM PLACEHOLDER STRING !$"
export const funcNameHere = "$! FUNCTION NAME PLACEHOLDER STRING !$"

export type Variant = {
    io: "terminal" | "value",
    funcName: string
}

export const variants: { [name: string]: Variant } = {
    io: {
        io: "terminal",
        funcName: "main"
    },
    loop: {
        io: "value",
        funcName: "fibonacci"
    },
    recursion: {
        io: "value",
        funcName: "factorial"
    }
}

export type Language = {
    required: boolean,
    editorId: string,
    executorId: string,
    extension: string,
    wrapper: string
}

export const languages: { [name: string]: Language } = {
    "Python": {
        required: true,
        editorId: "python",
        executorId: "python",
        extension: "py",
        wrapper: `import sys;arg=int(sys.argv[1])
${programHere}
print(${funcNameHere}(arg))`
    },
    "JavaScript": {
        required: true,
        editorId: "javascript",
        executorId: "node",
        extension: "js",
        wrapper: `const arg = parseInt(process.argv[2]);
${programHere}
console.log(${funcNameHere}(arg))`
    },
    "Rust": {
        required: false,
        editorId: "rust",
        executorId: "rust",
        extension: "rs",
        wrapper: `${programHere}\nfn main(){
            let arg: u32 = std::env::args().nth(1).unwrap().parse().unwrap();
            let result = ${funcNameHere}(arg);
            println!("{result}");
        }`
    },
    "C++": {
        required: false,
        editorId: "cpp",
        executorId: "cplusplus_gcc",
        extension: "cpp",
        wrapper: `#include <iostream>

${programHere}

int main() {
    int arg;
    std::cin >> arg;
    std::cout << ${funcNameHere}(arg) << std::endl;
    return 0;
}`
    },
    "Java": {
        required: false,
        editorId: "java",
        executorId: "java",
        extension: "java",
        wrapper: `import java.util.Scanner;

public class Main {
    ${programHere}
    public static void main(String[] args) {
        int arg = Integer.parseInt(args[0]);
        System.out.println(${funcNameHere}(arg));
    }
}`
    },
    // "Clojure": {
    //     required: false,
    //     editorId: "clojure",
    //     executorId: "???",
    //     extension: "cljs",
    //     wrapper: `${wp}`
    // }
}
