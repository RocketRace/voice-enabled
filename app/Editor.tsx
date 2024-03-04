'use client'
import { javascript } from '@codemirror/lang-javascript';
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
    language: "javascript"
}

export const Editor = ({ code, language }: EditorProps) => {
    return <CodeMirror
        className='codemirror'
        value={code}
        height='500px'
        width='700px'
        readOnly
        extensions={[javascript()]}
        basicSetup={codemirrorSetup}
    />
}