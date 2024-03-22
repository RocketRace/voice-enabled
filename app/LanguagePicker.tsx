import { FormEvent, MouseEvent } from "react";

export type PickedLanguage = { name: string, required: boolean }

export type LanguagePickerProps = {
    choices: PickedLanguage[]
    onSelect: (selections: string[]) => void
}

const LanguageChoice = ({ name, required }: PickedLanguage) => {
    const idSafeName = name.replaceAll("+", "plus")
    const handleClick = (e: MouseEvent) => {
        e.preventDefault();
        const input = document.querySelector<HTMLInputElement>(`#${idSafeName}`)
        if (input && !required) {
            input.checked = !input.checked
        }
    }
    return <li className="language-choice-item" onClick={handleClick}>
        <input type="checkbox" name={name} id={idSafeName} defaultChecked={required} disabled={required} />
        <span className="picker-lang">{name}</span>
    </li>
}

export const SelectedLanguages = ({ languages }: { languages: string[] }) => {
    return <p className="selections">You have selected the following languages:
        <span> <b>{languages[0]}</b></span>{languages.slice(1).map(l => <span key={l}>, <b>{l}</b></span>)}
    </p>
}

export const LanguagePicker = ({ choices, onSelect }: LanguagePickerProps) => {
    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        let chosen = []
        const target = event.target as typeof event.target & {
            [i: number]: { name: string, checked: boolean }
        }
        for (let i = 0; i < choices.length; i++) {
            const selection = target[i];
            if (selection.checked) {
                chosen.push(selection.name)
            }
        }
        onSelect(chosen)
    }

    return <div className="language-picker">
        <p className="editor-label">
            Please select the programming languages that will be used in this experiment.
            Python and JavaScript will always be included.
        </p>
        <form onSubmit={handleSubmit}>
            <ul className="picker-list">
                {choices.map(({ name, required }) =>
                    <LanguageChoice name={name} required={required} key={name} />
                )}
            </ul>
            <input type="submit" value="Confirm selection" />
        </form>
    </div>
}
