'use client'
import { useState } from "react"

export type InputType = "text"

export const Executor = ({ type }: { type: InputType }) => {
    const [input, setInput] = useState("")
    const [result, setResult] = useState("")

    const downloadVirus = () => {
        setResult(input)
    }

    return <div>
        <p>Input here:</p>
        <input
            type={type}
            value={input}
            onChange={e => setInput(e.target.value)}
        />
        <p>and execute it!</p>
        <button type="button" onClick={downloadVirus}>download virus</button>
        <input readOnly type="text" value={result} />
    </div>
}