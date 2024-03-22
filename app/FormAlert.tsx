export const FormAlert = ({ visible }: { visible: boolean }) => {
    const form_url = process.env.NEXT_PUBLIC_FORM_URL

    return visible && <div className="cover">
        <div className="after-upload">
            <p>
                Uploaded successfully!
            </p>
            <div className="form-prompt">
                <p>
                    Please fill out the following form to finish the experiment:
                </p>
                <a href={form_url}>
                    <button className="with-gap">Click here to go to the form</button>
                </a>
                <p>Or use this link: <a href={form_url}>{form_url}</a></p>
            </div>
            <p>
                <b>Thank you for participating!</b>
            </p>
        </div>
    </div >
}