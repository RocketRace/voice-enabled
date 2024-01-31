'use client'
import CodeMirror, { BasicSetupOptions, EditorState, EditorView, Statistics, ViewUpdate } from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { useCallback, useState } from 'react';

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

type LogEvent = {
  content: string,
  timestamp: Date,
}

export default function Home() {
  const [value, setValue] = useState("")

  const [events, setEvents] = useState<LogEvent[]>([])

  const onChange = useCallback((val: string, _viewUpdate: ViewUpdate) => {
    console.log('content change', val);
    setValue(val)
    setEvents([...events, { content: val, timestamp: new Date() }])
  }, []);
  const onStatistics = useCallback((data: Statistics) => {
    console.log("statistics", data);
  }, [])
  // const onCreateEditor = useCallback((view: EditorView, state: EditorState) => {
  //   console.log("editor created", view, state);
  // }, [])
  // const onUpdate = useCallback((update: ViewUpdate) => {
  //   console.log("state change", update);
  // }, [])

  return (
    <>
      <main className='main'>
        <CodeMirror
          className='codemirror'
          value={value}
          height='500px'
          width='700px'
          extensions={[javascript()]}
          placeholder={"<enter code here>"}
          autoFocus
          basicSetup={codemirrorSetup}
          onChange={onChange}
          onStatistics={onStatistics}
        // onCreateEditor={onCreateEditor}
        // onUpdate={onUpdate}
        />
        <p>
          Commmand list and instructions here
        </p>
      </main>
    </>
  )
}
