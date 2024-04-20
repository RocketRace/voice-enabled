## Voice-enabled coding experiment

This project is part of my thesis on the application of voice-enabled programming into programming language design, specifically in order to determine which language features improve a language's usability. This web application was used to perform a case study with the aim of determining differences in usability across programming languages, and whether these effects on usability are observable and measurable through voice-enabled programming.

![Screenshot of the experiment page](https://raw.githubusercontent.com/RocketRace/voice-enabled/f60dea2b0e85b3cc6e2fce3228ab37a1cc909739/experiment.png)

The technical steps are as follows:
1. The web experiment is hosted on [Vercel](https://vercel.com/) at https://voice-enabled.vercel.app/, using the [Next.js](https://nextjs.org/) framework.
2. The experiment presents users with instructions and a multiple-choice list of programming languages to be used in the experiment.
   - Python + JavaScript are mandatory, Rust / Rust / Java are optional.
3. After choosing, the user goes through a randomized sequence of programs in the selected languages.
   - There are three different programs for each programming language: A loop-based Fibonacci function, a recursive factorial function, and a small terminal IO application.
4. For each program, the user can experiment with the program by executing it and observing the output.
   - This is implemented using the [Attempt This Online](https://ato.pxeger.com/about) websocket API.
5. The user is prompted to record audio of themselves recreating each program by voice.
   - This uses the brower's [MediaStream Recording API](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API) through JavaScript.
6. The user accepts to upload their voice recordings to the server.
   - The voice recordings are stored in an [AWS S3 bucket](https://aws.amazon.com/s3/) using [presigned URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html).
7. The user is prompted to fill in a brief questionnaire asking for some relevant metrics and unstructured feedback.

## Running locally

A recent version of [npm](https://www.npmjs.com/) is required.

The following environment variables must be set (either using your shell or inside a `.env.local` file in the project directory). Note that environment variables starting with `NEXT_PUBLIC_` are public to the users of the experiment, whereas all the other variables are hidden and should not be shared!
* `NEXT_PUBLIC_FORM_URL`: The URL to the questionnaire given at the end of the experiment
* `NEXT_PUBLIC_BASE_URL`: The base URL of the web app. Typically the empty string.
* `AWS_REGION`: The AWS region that the S3 bucket is in
* `AWS_BUCKET_NAME`: The name of the S3 bucket
* `AWS_ACCESS_KEY_ID`: The ID of the access key used to access S3
* `AWS_SECRET_ACCESS_KEY`: The access key used to access S3
* `VERIFICATION_KEY`: The shared password that users must enter in order to upload their recordings

Install the dependencies:

```bash
npm i
```

Run the application:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
