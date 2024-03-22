'use client'
import { FormEvent, useEffect, useRef, useState } from "react";
import { FormAlert } from "./FormAlert";
import { Result } from "./Interface";

export type UploaderProps = {
    results: Result[]
};

export const Uploader = ({ results }: UploaderProps) => {
    const verificationRef = useRef<HTMLInputElement>(null)
    const participantRef = useRef<HTMLInputElement>(null)
    const [uploading, setUploading] = useState(false)
    const [uploaded, setUploaded] = useState(false)

    const [uploadCount, setUploadCount] = useState(0)
    console.log(results)

    const uploader_frontend_debug = process.env.NEXT_PUBLIC_DEBUG === "true"

    const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? ''

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (uploader_frontend_debug) {
            console.log("debug", uploader_frontend_debug)
            setUploaded(true)
            return
        }

        const participantNumber = participantRef.current?.value

        if (!participantNumber) {
            alert("Please include your participant number.")
            return
        }

        setUploading(true)
        for (let i = 0; i < results.length; i++) {
            const result = results[i];

            const response = await fetch(
                NEXT_PUBLIC_BASE_URL + '/api/upload',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contentType: 'audio/wav',
                        projectPhase: verificationRef.current?.value ?? "",
                        participantNumber: participantNumber,
                        language: result.language,
                        variant: result.variant
                    }),
                }
            )

            if (response.ok) {
                const j = await response.json()
                if (j.error) {
                    alert('Incorrect shared password')
                    break;
                }
                else {
                    // obtained the presigned url
                    const { url, fields } = await response.json()

                    const formData = new FormData()
                    Object.entries(fields).forEach(([key, value]) => {
                        formData.append(key, value as string)
                    })
                    const file = new File([result.recording], "audio.wav", { type: "audio/wav" })
                    formData.append('file', file)

                    const uploadResponse = await fetch(url, {
                        method: 'POST',
                        body: formData,
                    })

                    if (uploadResponse.ok) {
                        if (uploadCount === results.length - 1) {
                            setUploaded(true)
                        }
                        setUploadCount(uploadCount + 1)
                    } else {
                        console.error('S3 Upload Error:', uploadResponse)
                        alert('Upload failed.')
                    }
                }
            } else {
                alert('Failed to get pre-signed URL.')
            }
        }

        setUploading(false)
    }

    const label = !uploading ? "Enter your participant number and the shared password to upload your audio recordings to the server:" : "Uploading..."
    const buttonText = uploaded ? "Already uploaded" : "Upload"

    const notYetUploaded = (
        <>
            <form className="uploader" onSubmit={handleSubmit}>
                <p>{label}</p>
                <div>
                    <span className="with-gap">Participant number:</span>
                    <input className="with-gap" required type="text" id="participantNumber" ref={participantRef} />
                </div>
                <div>
                    <span className="with-gap">Shared password:</span>
                    <input required name="verification" id="verification" ref={verificationRef} />
                </div>
                <div>
                    <button type="submit" disabled={uploaded}>{buttonText}</button>
                </div>
            </form>
            <FormAlert visible={uploaded} />
        </>
    )

    return notYetUploaded
}
