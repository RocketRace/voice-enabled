import { FormEvent, useEffect, useRef } from "react";

export const Uploader = ({ blob }: { blob: Blob }) => {
    const backendUrl = "http://127.0.0.1:5000/upload"

    const inputRef = useRef<HTMLInputElement>(null)

    const handleSubmit = async (event: FormEvent) => {
        // Prevent the default form submission behavior which redirects
        event.preventDefault();

        try {
            const formData = new FormData();
            if (inputRef.current?.files) {
                formData.append('file', inputRef.current.files[0]);

                const response = await fetch(backendUrl, {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    alert('File uploaded successfully');
                } else {
                    alert('File upload failed');
                }
            }
        } catch (error) {
            console.error('Error during file upload:', error);
        }
    };

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

    return (
        <form onSubmit={handleSubmit}>
            <input hidden type="file" name="file" id="file" accept=".wav" ref={inputRef} />
            <button type="submit">Upload audio recording to server</button>
        </form>
    )
}