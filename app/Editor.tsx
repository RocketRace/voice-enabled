'use client'
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { rust } from '@codemirror/lang-rust';
import { clojure } from '@nextjournal/lang-clojure';
import CodeMirror, { BasicSetupOptions } from '@uiw/react-codemirror';

const codemirrorSetup: BasicSetupOptions = {
    lineNumbers: true,
    highlightActiveLineGutter: true,
    highlightSpecialChars: true,
    drawSelection: true,
    indentOnInput: true,
    syntaxHighlighting: true,
    bracketMatching: true,
    closeBrackets: true,
    autocompletion: false, // do not autocomplete!
    rectangularSelection: true,
    highlightActiveLine: true,
}

export type EditorProps = {
    code: string,
    language: keyof typeof languages
}

const languages = {
    "javascript": javascript(),
    "python": python(),
    "rust": rust(),
    "cpp": cpp(),
    "java": java(),
    "clojure": clojure(),
}

const languageNames = {
    "javascript": "JavaScript",
    "python": "Python",
    "rust": "Rust",
    "cpp": "C++",
    "java": "Java",
    "clojure": "Clojure",
}

export const Editor = ({ code, language }: EditorProps) => {
    return <div className='codemirror'>
        <p>Read and understand the following {languageNames[language]} code:</p>
        <CodeMirror
            value={code}
            readOnly
            extensions={[languages[language]]}
            basicSetup={codemirrorSetup}
        />
    </div>
}
