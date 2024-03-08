// import { NextRequest, NextResponse } from 'next/server';
// import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
// import uniqid from 'uniqid';

// export async function POST(req: NextRequest, res: NextResponse) {
//   const data = await req.formData();
//   if (data.get('file')) {
//     // upload the file
//     const file = data.get('file');

//     const s3Client = new S3Client({
//       region: 'us-east-1',
//       credentials: {
//         accessKeyId: process.env.MY_AWS_ACCESS_KEY!,
//         secretAccessKey: process.env.MY_AWS_SECRET_KEY!,
//       },
//     });

//     const ext = file?.name.split('.').slice(-1)[0];
//     const newFileName = uniqid() + '.' + ext;

//     const chunks: Uint8Array[] = [];
//     for await (const chunk of file?.stream()) {
//       chunks.push(chunk);
//     }
//     const buffer = Buffer.concat(chunks);

//     const bucket = 'dawid-food-ordering';
//     await s3Client.send(new PutObjectCommand({
//       Bucket: bucket,
//       Key: newFileName,
//       ACL: 'public-read',
//       ContentType: file?.type,
//       Body: buffer,
//     }));

//     const link = 'https://' + bucket + '.s3.amazonaws.com/' + newFileName;
//     return NextResponse.json(link);
//   }
//   return NextResponse.json(true);
// }
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import uniqid from 'uniqid';

export async function POST(req: NextRequest, res: NextResponse) {
  const data = await req.formData();
  const fileEntry = data.get('file');

  if (fileEntry instanceof Blob) {
    // Handle single file
    const link = await saveFile(fileEntry);
    return NextResponse.json({ link });
  } else if (Array.isArray(fileEntry)) {
    // Handle multiple files (if applicable)
    for (const file of fileEntry) {
      if (file instanceof Blob) {
        await saveFile(file);
      }
    }
    return NextResponse.json('https://www.godubrovnik.com/wp-content/uploads/pizza.jpg');
  }

  return NextResponse.json({ error: 'No file uploaded' });
}

async function saveFile(file: Blob): Promise<string> {
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const ext = getFileExtension(file.type);
  if (!ext) {
    throw new Error('Unsupported file type');
  }
  const newFileName = uniqid() + '.' + ext;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  const filePath = path.join(uploadDir, newFileName);

  fs.mkdirSync(uploadDir, { recursive: true });
  fs.writeFileSync(filePath, fileBuffer);

  // Return the link to the uploaded file if needed
  const link = '/uploads/' + newFileName;
  console.log('File saved at:', filePath);

  return link;
}

function getFileExtension(mimeType: string): string | null {
  const extensions: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
  };
  return extensions[mimeType] || null;
}



// export const config = {
//   api: {
//     bodyParser: false, // Disallow body parsing
//   },
// };
