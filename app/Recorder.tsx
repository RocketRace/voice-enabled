'use client'

export const Recorder = () => {
    const consent = () => alert("you have consented")

    return <div>
        <p>Record your voice here</p>
        <button type="button" onClick={consent}>your consent</button>
    </div>
}