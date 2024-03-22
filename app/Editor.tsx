'use client'
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { rust } from '@codemirror/lang-rust';
import { LanguageSupport } from '@codemirror/language';
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
    source: string,
    editorId: string,
    languageName: string
}

const languages: { [name: string]: LanguageSupport } = {
    "javascript": javascript(),
    "python": python(),
    "rust": rust(),
    "cpp": cpp(),
    "java": java(),
    "clojure": clojure(),
}

export const Editor = ({ source, editorId, languageName }: EditorProps) => {
    return <div className='codemirror'>
        <p className='editor-label'>Read and understand the following <b>{languageName}</b> code:</p>
        <CodeMirror
            value={source}
            readOnly
            extensions={[languages[editorId]]}
            basicSetup={codemirrorSetup}
        />
    </div>
}
