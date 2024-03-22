'use client'
import { useCallback, useState } from "react"

import msgpack5 from 'msgpack5';
import { wp } from "./programs";

// Initialize msgpack5
const msgpack = msgpack5();

export type ExecutorProps = {
    io: "value" | "terminal",
    executorId: string,
    code: string,
    wrapper: string
}

export const Executor = ({ io, executorId, code, wrapper }: ExecutorProps) => {
    const [input, setInput] = useState("")
    const [result, setResult] = useState("")

    const connectAndRun = useCallback(() => {
        // Establish WebSocket connection
        const ws = new WebSocket('wss://ato.pxeger.com/api/v1/ws/execute');

        // Set up event listeners
        ws.addEventListener('open', async () => {
            console.log('WebSocket connection opened');
            ws.send(msgpack.encode({
                language: executorId,
                code: wrapper.replace(wp, code),
                input: io === "terminal" ? input : "",
                options: [],
                arguments: io === "value" ? [input] : [],
                timeout: 5
            }).slice());
        });

        ws.addEventListener('message', async (event: MessageEvent<Blob>) => {
            const receivedMessage = event.data;

            const obj: any = msgpack.decode(Buffer.from(await receivedMessage.arrayBuffer()))

            console.log('Received websocket message:', obj);

            // collect all stdout packets
            if ("Stdout" in obj) {
                const arr: Uint8Array = obj.Stdout;
                const s = new TextDecoder("utf-8").decode(arr)
                setResult(prev => prev + s)
            }

            if ("Done" in obj) {
                // aaand we're done
                ws.close();
            }
        });

        ws.addEventListener('close', (event) => {
            console.log('WebSocket connection closed:', event);
        });

        // Cleanup: Close WebSocket connection when component unmounts
        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, [input])

    const downloadVirus = async () => {
        setResult("")
        connectAndRun()
    }

    const type = io === "value" ? "number" : "text"

    return <div className="executor">
        <span>Try running the code to see how it behaves.</span>
        <div>
            <input
                type={type}
                value={input}
                className="with-gap"
                placeholder="Enter input"
                onChange={e => setInput(e.target.value)}
            />
            <button type="button" onClick={downloadVirus}>Run code</button>
        </div>
        <div>
            <span className="with-gap">Output:</span>
            <input readOnly type="text" value={result} />
        </div>
    </div>
}
