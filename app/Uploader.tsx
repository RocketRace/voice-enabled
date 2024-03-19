import { FormEvent, useEffect, useRef, useState } from "react";

export type UploaderProps = {
    blob: Blob;
    language: string;
};

export const Uploader = ({ blob, language }: UploaderProps) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const verificationRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const [uploading, setUploading] = useState(false)
    const [uploaded, setUploaded] = useState(false)

    const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? ''

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const email = emailRef.current?.value

        if (!email) {
            alert("Please include your email address.")
            return
        }

        const files = inputRef.current?.files;

        if (!files || files.length === 0) {
            alert('Please select a file to upload.')
            return
        }
        setUploading(true)
        const file = files[0]

        const response = await fetch(
            NEXT_PUBLIC_BASE_URL + '/api/upload',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contentType: file.type,
                    projectPhase: verificationRef.current?.value ?? "",
                    email: email,
                    language: language
                }),
            }
        )

        if (response.ok) {
            // obtained the presigned url
            const { url, fields } = await response.json()

            const formData = new FormData()
            Object.entries(fields).forEach(([key, value]) => {
                formData.append(key, value as string)
            })
            formData.append('file', file)

            const uploadResponse = await fetch(url, {
                method: 'POST',
                body: formData,
            })

            if (uploadResponse.ok) {
                alert('Upload successful!')
                setUploaded(true)
            } else {
                console.error('S3 Upload Error:', uploadResponse)
                alert('Upload failed.')
            }
        } else {
            alert('Failed to get pre-signed URL.')
        }

        setUploading(false)
    }

    useEffect(() => {
        const fileInput = inputRef.current;
        if (fileInput) {
            // Create a File object from the Blob
            const file = new File([blob], 'audio.wav', { type: 'audio/wav' });

            // Set the File object as the value of the file input
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files;
        }
    }, [inputRef])

    const label = !uploading ? "Enter your email address and the shared password to upload your audio recording to the server:" : "Uploading..."
    const buttonText = uploaded ? "Already uploaded" : "Upload"

    return (
        <form className="uploader" onSubmit={handleSubmit}>
            <p>{label}</p>
            <input hidden type="file" name="file" id="file" accept=".wav" ref={inputRef} />
            <div>
                <span className="with-gap">Email:</span>
                <input className="with-gap" required type="email" id="email" ref={emailRef} />
            </div>
            <div>
                <span className="with-gap">Shared password:</span>
                <input required name="verification" id="verification" ref={verificationRef} />
            </div>
            <div>
                <button type="submit" disabled={uploaded}>{buttonText}</button>
            </div>
        </form>
    )
}
