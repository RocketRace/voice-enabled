'use client'
import { Editor, EditorProps } from "./Editor";
import { Executor } from "./Executor";
import { Instructions } from "./Instructions";
import { AudioRecorder } from "./Recorder";
import { useEffect, useState } from "react";

export type LanguageSpec = EditorProps & {
  call: string,
  languageId: string,
}

const snippets: readonly LanguageSpec[] = [
  {
    code: "function main(arg) {\n\treturn `Hello, ${arg}!`\n}",
    call: "console.log(main(process.argv[2]))",
    language: "javascript",
    languageId: "node"
  },
  {
    code: "def main(arg):\n\treturn f'Hello, {arg}!'",
    call: "import sys\nprint(main(*sys.argv[1:]))",
    language: "python",
    languageId: "python"
  }
]

const fakeRandom = (max: number) => Math.floor((new Date().getUTCMilliseconds()) % max)

export default function Main() {
  const [snippet, setSnippet] = useState<LanguageSpec | null>(null);

  useEffect(() => {
    setSnippet(snippets[fakeRandom(2)]);
  })

  return <main className='main'>
    <div className="left-pane">
      {snippet && <Editor {...snippet} />}
      {snippet && <Executor type="text" spec={snippet} />}
    </div>
    <div className="right-pane">
      <Instructions />
      <AudioRecorder />
    </div>
  </main>
}
