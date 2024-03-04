'use client'
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
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
    "python": python()
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