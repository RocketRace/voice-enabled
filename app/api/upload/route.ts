import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { S3Client } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
    const payload = await request.json()
    const filename: string = payload.filename;
    const projectPhase: string = payload.projectPhase;
    const contentType: string = payload.contentType;

    const AWS_REGION = process.env.AWS_REGION;
    const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
    const VERIFICATION_KEY = process.env.VERIFICATION_KEY;

    if (!AWS_REGION || !AWS_BUCKET_NAME || !VERIFICATION_KEY) {
        return Response.json({ error: "Misconfigured environment variables" })
    }

    if (VERIFICATION_KEY != projectPhase) {
        return Response.json({ error: "Wrong phase" })
    }

    try {
        const client = new S3Client({ region: AWS_REGION })
        const { url, fields } = await createPresignedPost(client, {
            Bucket: AWS_BUCKET_NAME,
            Key: `${uuidv4()}-audio`,
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

        return Response.json({ url, fields })
    } catch (error: any) {
        return Response.json({ error: error.message })
    }
}
