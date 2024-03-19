'use client'

import React, { useState, useEffect } from 'react';
import { Uploader } from './Uploader';

export const AudioRecorder = ({ language }: { language: string }) => {
    const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [startedAt, setStartedAt] = useState(new Date());
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const id = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(id);
    }, []);

    const blob = new Blob(audioChunks, { type: "audio/wav" })
    const getUrl = () => URL.createObjectURL(new Blob(audioChunks, { type: 'audio/wav' }))

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            let chunks: Blob[] = []; // Temporary array to store chunks during recording

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunks.push(event.data);
                }
            };

            recorder.onstop = () => {
                const audioBlob = new Blob(chunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                setIsRecording(false);
                setAudioChunks((prevChunks) => [...prevChunks, ...chunks]);
                console.log("audio url:", audioUrl)
            };

            recorder.start();
            setStartedAt(new Date());
            setRecorder(recorder);
            setIsRecording(true);
        } catch (error) {
            console.error(`Error accessing microphone!\nTechnical details: ${error}`);
        }
    };


    const stopRecording = () => {
        if (recorder && recorder.state === 'recording') {
            recorder.stop();
        }
    };

    useEffect(() => {
        return () => {
            // Cleanup: Stop recording and release resources when the component unmounts
            if (recorder && recorder.state === 'recording') {
                recorder.stop();
            }
        };
    }, [recorder]);

    const uploadRecording = async () => {
        const url = getUrl();
        console.log(url)

    }

    const computeDuration = (start: Date, end: Date) => {
        const delta = end.valueOf() - start.valueOf()
        if (delta <= 0) {
            return ''
        }
        // Convert the time difference to hours and minutes
        const fullSecs = Math.floor(delta / 1000)
        const minutes = Math.floor(fullSecs / 60);
        const secs = Math.floor(fullSecs % 60)

        // Format the result
        const durationString = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        return durationString;
    }

    const duration = computeDuration(startedAt, currentTime)

    return (
        <div className='recorder'>
            {!isRecording && <p>Record your voice once you're done. You will be asked to upload your recording later.</p>}
            {isRecording && duration}
            <div className='recording-buttons'>
                <button onClick={startRecording} disabled={isRecording}>
                    Start Recording
                </button>
                <button onClick={stopRecording} disabled={!isRecording}>
                    Stop Recording
                </button>
                {!isRecording && audioChunks.length > 0 && (
                    <Uploader blob={blob} language={language} />
                )}
            </div>
        </div>
    );
};
