'use client'
import CodeMirror, { ViewUpdate } from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { useCallback, useState } from 'react';

export default function Home() {
  const [value, setValue] = useState("")
  const onChange = useCallback((val: string, _viewUpdate: ViewUpdate) => {
    console.log('new value:', val);
    setValue(val);
  }, []);

  return (
    <>
      <main className='main'>
        <CodeMirror
          className='codemirror'
          value={value}
          height='500px'
          width='700px'
          extensions={[javascript()]}
          basicSetup={{
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
          }}
          onChange={onChange}
        />
        <p>
          Commmand list and instructions here
        </p>
      </main>
    </>
  )
}
