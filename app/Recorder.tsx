'use client'

import React, { useState, useEffect } from 'react';
import { Uploader } from './Uploader';

export const AudioRecorder = ({ language }: { language: string }) => {
    const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [startedAt, setStartedAt] = useState(new Date());
    const [currentTime, setCurrentTime] = useState(new Date());
    const [stoppedAt, setStoppedAt] = useState<Date | null>(null);

    const isRecorded = !isRecording && audioChunks.length > 0

    useEffect(() => {
        setCurrentTime(new Date());
        const id = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(id);
    }, []);

    const blob = new Blob(audioChunks, { type: "audio/wav" })


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
            setStoppedAt(new Date())
        }
    };

    useEffect(() => {
        return () => {
            // Cleanup: Stop recording and release resources when the component unmounts
            if (recorder && recorder.state === 'recording') {
                recorder.stop();
                setRecorder(null)
            }
        };
    }, [recorder]);

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
    const stoppedDuration = stoppedAt && computeDuration(startedAt, stoppedAt)

    const label = isRecording
        ? <p>Recording: {duration}</p>
        : isRecorded
            ? <p>Recorded: {stoppedDuration}</p>
            : <p>Record your voice once you're done. You will be asked to upload your recording later.</p>

    return (
        <div className='recorder'>
            {label}
            <div className='recording-buttons'>
                <button className='with-gap' onClick={startRecording} disabled={isRecording}>
                    Start Recording
                </button>
                <button onClick={stopRecording} disabled={!isRecording}>
                    Stop Recording
                </button>
                {isRecorded && (
                    <Uploader blob={blob} language={language} />
                )}
            </div>
        </div>
    );
};
