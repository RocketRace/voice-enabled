export const FormAlert = ({ visible }: { visible: boolean }) => {
    const form_url = process.env.NEXT_PUBLIC_FORM_URL

    return visible && <div className="cover">
        <div className="after-upload">
            <p>
                Uploaded successfully!
            </p>
            <p>
                Thank you for participating in this experiment!
            </p>
            <p>
                Please fill out the following form to finish:
            </p>
            <a href={form_url}>
                <button className="with-gap">Click here to go to the form</button>
            </a>
            <span>Or use this link: <a href={form_url}>{form_url}</a></span>
        </div>
    </div>
}