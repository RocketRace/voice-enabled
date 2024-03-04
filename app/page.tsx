import { Editor } from "./Editor";
import { Executor } from "./Executor";
import { Instructions } from "./Instructions";
import { Recorder } from "./Recorder";

export default function Main() {
  return <main className='main'>
    <div className="left-pane">
      <Editor code="console.log('hello, world!')" language="javascript" />
      <Executor type="text" />
    </div>
    <div className="right-pane">
      <Instructions />
      <Recorder />
    </div>
  </main>
}
