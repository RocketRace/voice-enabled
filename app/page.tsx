import { Editor } from "./Editor";
import { Executor } from "./Executor";
import { Instructions } from "./Instructions";
import { Recorder } from "./Recorder";

export default function Main() {
  return <main className='main'>
    <Editor code="console.log('hello, world!')" language="javascript" />
    <Executor type="text" />
    <Instructions />
    <Recorder />
  </main>
}
