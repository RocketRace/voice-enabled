'use client'
import CodeMirror, { BasicSetupOptions, Statistics, ViewUpdate } from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { MouseEvent, useCallback, useState } from 'react';

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

type BaseEvent = {
  timestamp: Date,
}

type ContentEvent = BaseEvent & {
  kind: "content"
  content: string,
}


type MouseMoveEvent = BaseEvent & {
  kind: "movement"
  dxs: number[]
  dys: number[]
}

const isContent = (event: LogEvent): event is ContentEvent => event.kind === "content"
const isMovement = (event: LogEvent): event is MouseMoveEvent => event.kind === "movement"

type LogEvent = ContentEvent | MouseMoveEvent

const secondsBetween = (start: Date, end: Date): number =>
  (end.getTime() - start.getTime()) / 1000

const getDuration = (logs: LogEvent[]): string => {
  const start = logs.find(isContent)?.timestamp
  const end = logs.findLast(isContent)?.timestamp
  if (start && end) {
    return new Intl.RelativeTimeFormat().format(secondsBetween(start, end), "second")
  }
  else {
    return "n/a"
  }
}

const getMouseMovements = (logs: LogEvent[]): number => logs.filter(isMovement).length

export default function Home() {
  const [value, setValue] = useState("")

  const [events, setEvents] = useState<LogEvent[]>([])

  const onChange = useCallback((val: string, _viewUpdate: ViewUpdate) => {
    setValue(val)
    console.log(getDuration(events));
    console.log(getMouseMovements(events));
    setEvents([...events, { timestamp: new Date(), kind: "content", content: val }])
  }, [events]);

  const onStatistics = useCallback((data: Statistics) => {
    // console.log("statistics", data);
  }, [])

  const onMouseMove = useCallback((event: MouseEvent<HTMLElement>) => {
    const debounceSeconds = 1
    const last = events.findLast(isMovement)
    const lasti = events.findLastIndex(isMovement)
    const isDebounced = last !== undefined && secondsBetween(last.timestamp, new Date()) < debounceSeconds

    if (isDebounced) {
      const newEvents = [...events]
      last.dxs.push(event.movementX)
      last.dys.push(event.movementY)
      newEvents[lasti] = last
      setEvents([...newEvents])
    }
    else {
      setEvents([...events, { timestamp: new Date(), kind: "movement", dxs: [event.movementX], dys: [event.movementY] }])
    }

  }, [events])

  return (
    <>
      <main className='main' onMouseMove={onMouseMove}>
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
