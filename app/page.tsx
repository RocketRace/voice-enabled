'use client'
import { Editor, EditorProps } from "./Editor";
import { Executor } from "./Executor";
import { Instructions } from "./Instructions";
import { Recorder } from "./Recorder";
import { useEffect, useState } from "react";

const snippets: readonly EditorProps[] = [
  {
    code: "console.log('hello, world!')\n",
    language: "javascript"
  },
  {
    code: "print('hello, world!')\n",
    language: "python"
  }
]

const fakeRandom = (max: number) => Math.floor((new Date().getUTCMilliseconds()) % max)

export default function Main() {
  const [snippet, setSnippet] = useState<EditorProps | null>(null);

  useEffect(() => {
    setSnippet(snippets[fakeRandom(2)]);
  })

  return <main className='main'>
    <div className="left-pane">
      {snippet && <Editor {...snippet} />}
      <Executor type="text" />
    </div>
    <div className="right-pane">
      <Instructions />
      <Recorder />
    </div>
  </main>
}
