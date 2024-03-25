'use client'

import React, { useState, useEffect, useCallback } from 'react';

export type AudioRecorderProps = {
    confirmRecording: (blob: Blob) => void;
    disabled: boolean;
    isLastProgram: boolean;
    programsCompleted: number;
    programsTotal: number;
}

export const AudioRecorder = ({ disabled, confirmRecording, isLastProgram, programsCompleted, programsTotal }: AudioRecorderProps) => {
    const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [startedAt, setStartedAt] = useState<Date | null>(null);
    const [stoppedAt, setStoppedAt] = useState<Date | null>(null);

    const isRecorded = !isRecording && audioChunks.length > 0

    useEffect(() => {
        setCurrentTime(new Date());
        const id = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(id);
    }, []);

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

    const duration = startedAt && computeDuration(startedAt, currentTime)
    const stoppedDuration = startedAt && stoppedAt && computeDuration(startedAt, stoppedAt)

    const label = disabled
        ? <p><em>Please select programming languages first</em></p>
        : isRecording
            ? <p>Recording: {duration}</p>
            : isRecorded
                ? <p>Recorded: {stoppedDuration}</p>
                : <p>Record your voice here. You will be asked to share your recording later.</p>

    const handleNextProgram = useCallback(() => {
        // setAudioChunks([]) + if (isRecorded) ensures that the callback isn't evaluated recursively
        if (isRecorded) {
            const blob = new Blob(audioChunks, { type: "audio/wav" })
            setAudioChunks([])
            setRecorder(null)
            setStartedAt(null);
            setStoppedAt(null)
            confirmRecording(blob)
        }
    }, [isRecorded, audioChunks, confirmRecording, setRecorder, setAudioChunks, setStartedAt, setStoppedAt])

    return (
        <div className='recorder'>
            {label}
            <div className='recording-buttons'>
                <button className='with-gap' onClick={startRecording} disabled={isRecording || disabled}>
                    Start Recording
                </button>
                <button className='with-gap' onClick={stopRecording} disabled={!isRecording || disabled}>
                    Stop Recording
                </button>
                <button onClick={handleNextProgram} disabled={!isRecorded || disabled}>
                    {isLastProgram ? "Finish experiment" : `Next program (${programsCompleted}/${programsTotal})`}
                </button>
            </div>
        </div>
    );
};
