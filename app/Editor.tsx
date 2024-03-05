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

export const Editor = ({ code, language }: EditorProps) => {
    return <CodeMirror
        className='codemirror'
        value={code}
        readOnly
        extensions={[languages[language]]}
        basicSetup={codemirrorSetup}
    />
}