import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { S3Client } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
    const payload = await request.json()
    const projectPhase: string = payload.projectPhase.trim();
    const contentType: string = payload.contentType.trim();
    const participantNumber: string = payload.participantNumber.trim().slice(0, 128);
    const safeParticipantNumber = encodeURI(participantNumber);
    const language: string = payload.language.trim();
    const variant: string = payload.variant.trim();

    const timestamp = new Date().toISOString();

    const objectKey = `${timestamp}-${language}-${variant}-${uuidv4()}-${safeParticipantNumber}.wav`
    console.log("created key", objectKey)

    const AWS_REGION = process.env.AWS_REGION;
    const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
    const VERIFICATION_KEY = process.env.VERIFICATION_KEY;

    if (!AWS_REGION || !AWS_BUCKET_NAME || !VERIFICATION_KEY) {
        console.log("Bad configuration:")
        if (!AWS_REGION) {
            console.log("AWS_REGION")
        }
        if (!AWS_BUCKET_NAME) {
            console.log("AWS_BUCKET_NAME")
        }
        if (!VERIFICATION_KEY) {
            console.log("VERIFICATION_KEY")
        }
        return Response.json({ error: "Server error" })
    }

    if (VERIFICATION_KEY != projectPhase) {
        console.log("Bad verification key")
        return Response.json({ error: "Shared password" })
    }

    try {
        const client = new S3Client({ region: AWS_REGION })
        const { url, fields } = await createPresignedPost(client, {
            Bucket: AWS_BUCKET_NAME,
            Key: objectKey,
            Conditions: [
                ['content-length-range', 0, 10485760], // up to 10 MB
                ['starts-with', '$Content-Type', contentType],
            ],
            Fields: {
                acl: 'private',
                'Content-Type': contentType,
            },
            Expires: 600, // Seconds before the presigned post expires. 3600 by default.
        })
        console.log("Sucessful upload")
        return Response.json({ url, fields })
    } catch (error: any) {
        console.log("Presigned post error", error)
        return Response.json({ error: "Server error" })
    }
}
