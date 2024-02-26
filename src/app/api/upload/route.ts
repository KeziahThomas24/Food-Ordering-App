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
import multer from 'multer';
import path from 'path';

// Define the type for the req.file object
type MulterFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
};

const upload = multer({
  dest: './public/uploads/', // Destination folder for uploaded files
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
});

export const config = {
  api: {
    bodyParser: false, // Disables automatic body parsing, let multer handle it
  },
};

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    await new Promise<void>((resolve, reject) => {
      upload.single('file')(req as any, res as any, (err: any) => {
        if (err instanceof multer.MulterError) {
          // res.status(400).json({ error: 'Multer error: ' + err.message });
          NextResponse.json({ error: 'Multer error' },{status:400})
          reject(err);
        } else if (err) {
          // res.status(500).json({ error: 'Internal server error' });
          NextResponse.json({ error: 'Internal server error' },{status:500})
          reject(err);
        } else {
          resolve();
        }
      });
    });

    const uploadedFile = (req as any).file as MulterFile;

    if (!uploadedFile) {
      // return res.status(400).json({ error: 'No file uploaded' });
      return NextResponse.json({ error: 'No file uploaded' },{status:400})
    }

    const filePath = uploadedFile.path;
    const fileName = uploadedFile.originalname;
    const fullPath = path.join(filePath);

    // res.status(200).json({ message: 'File uploaded successfully', path: fullPath });
    return NextResponse.json({ message: 'File uploaded successfully', path: fullPath },{status:200})
  } catch (error) {
    console.error('Error uploading file:', error);
    // res.status(500).json({ error: 'Internal server error' });
    return NextResponse.json({ error: 'Internal server error' })
  }
}
