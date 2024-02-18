'use client'
import CodeMirror, { BasicSetupOptions, Statistics, ViewUpdate } from '@uiw/react-codemirror';
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

const getStatistics = (logs: LogEvent[]): string => {
  if (logs.length > 0) {
    const start = logs[0].timestamp.getTime()
    const end = logs[logs.length - 1].timestamp.getTime()
    const delta = end - start
    return new Intl.RelativeTimeFormat().format(delta / 1000, "second")
  }
  else {
    return "n/a"
  }
}

export default function Home() {
  const [value, setValue] = useState("")

  const [events, setEvents] = useState<LogEvent[]>([])

  const onChange = useCallback((val: string, _viewUpdate: ViewUpdate) => {
    console.log('content change', val);
    setValue(val)
    console.log(getStatistics(events));
    setEvents([...events, { content: val, timestamp: new Date() }])
  }, [events]);

  const onStatistics = useCallback((data: Statistics) => {
    // console.log("statistics", data);
  }, [])

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
