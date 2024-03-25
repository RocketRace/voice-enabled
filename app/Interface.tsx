'use client'
import { useEffect, useState } from "react"
import { Editor } from "./Editor"
import { Executor } from "./Executor"
import { Instructions } from "./Instructions"
import { LanguagePicker, SelectedLanguages } from "./LanguagePicker"
import { AudioRecorder } from "./Recorder"
import { Uploader } from "./Uploader"
import { languages, variants, programHere } from "./programs"

function shuffleInplace<T>(array: T[]) {
    let currentIndex = array.length
    let randomIndex;
    while (currentIndex > 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
}

export type InterfaceProps = {
    programs: {
        variantName: string;
        source: string;
        languageName: string;
    }[][]
}

type ProgramEntry = {
    variantName: string;
    source: string;
    languageName: string;
}

export type Result = {
    recording: Blob;
    language: string;
    variant: string;
}

export const Interface = ({ programs }: InterfaceProps) => {
    const languageIndex = 0;
    const variantIndex = 0;

    let choices = []
    for (const language in languages) {
        if (Object.prototype.hasOwnProperty.call(languages, language)) {
            choices.push({ name: language, required: languages[language].required })
        }
    }

    let blob: any // TODO

    const [selections, setSelections] = useState<string[]>([])

    const [programEntries, setProgramEntries] = useState<ProgramEntry[]>([])
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);
    const [currentProgram, setCurrentProgram] = useState<ProgramEntry | null>(null);
    useEffect(() => {
        let filteredLanguages: ProgramEntry[] = []
        // inefficient double loop but whatever
        programs.forEach(program => {
            selections.forEach(selection => {
                if (program[0].languageName === selection) {
                    filteredLanguages.push(...program)
                }
            });
        })
        shuffleInplace(filteredLanguages)
        setProgramEntries(filteredLanguages)
        if (filteredLanguages.length > 0) {
            setCurrentIndex(0)
        }
    }, [selections])

    useEffect(() => {
        if (currentIndex !== null) {
            setCurrentProgram(programEntries[currentIndex])
        }
    }, [programEntries, currentIndex, setCurrentProgram])

    const isSelected = !!currentProgram

    const [recordings, setRecordings] = useState<Blob[]>([])
    const [isFinished, setIsFinished] = useState(false)

    const [results, setResults] = useState<Result[]>([])

    return <div className='page'>
        <header className="header">
            <h1 className="big-text">Voice Programming Experiment</h1>
        </header>
        <main className="main">
            <div className="right-pane">
                <Instructions />
                {isFinished
                    ? <Uploader results={results} />
                    : <AudioRecorder
                        disabled={!isSelected}
                        confirmRecording={b => {
                            setRecordings([...recordings, b]);
                            if (currentProgram) {
                                setResults([...results, {
                                    recording: b,
                                    language: currentProgram?.languageName,
                                    variant: currentProgram?.variantName
                                }])
                            }
                            if (currentIndex === programEntries.length - 1) {
                                setIsFinished(true)
                            }
                            setCurrentIndex((currentIndex ?? 0) + 1)
                        }}
                        isLastProgram={currentIndex === programEntries.length - 1}
                    />}
            </div>
            <div className="left-pane">
                {isSelected || isFinished
                    ? <SelectedLanguages languages={selections} />
                    : <LanguagePicker choices={choices} onSelect={setSelections} />
                }
                {isSelected && <Editor
                    source={currentProgram.source}
                    editorId={languages[currentProgram.languageName].editorId}
                    languageName={currentProgram.languageName}
                />}
                {isSelected && <Executor
                    io={variants[currentProgram.variantName].io}
                    executorId={languages[currentProgram.languageName].executorId}
                    code={currentProgram.source}
                    wrapper={
                        variants[currentProgram.variantName].io === "value"
                            ? languages[currentProgram.languageName].wrapper
                            : programHere
                    }
                    funcName={
                        variants[currentProgram.variantName].funcName   
                    }
                />}
            </div>
        </main>
    </div>
}