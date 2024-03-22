import { readFile } from "fs/promises"

export const wp = "$! PLACEHOLDER STRING !$"

export const variants: { [name: string]: "terminal" | "value" } = {
    io: "terminal",
    // loop: "value",
    // recursion: "value"
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
        wrapper: `${wp}`
    },
    "JavaScript": {
        required: true,
        editorId: "javascript",
        executorId: "node",
        extension: "js",
        wrapper: `${wp}`
    },
    "Rust": {
        required: false,
        editorId: "rust",
        executorId: "rust",
        extension: "rs",
        wrapper: `${wp}`
    },
    "C++": {
        required: false,
        editorId: "cpp",
        executorId: "cplusplus_gcc",
        extension: "cpp",
        wrapper: `${wp}`
    },
    "Java": {
        required: false,
        editorId: "java",
        executorId: "java",
        extension: "java",
        wrapper: `${wp}`
    },
    // "Clojure": {
    //     required: false,
    //     editorId: "clojure",
    //     executorId: "???",
    //     extension: "cljs",
    //     wrapper: `${wp}`
    // }
}
