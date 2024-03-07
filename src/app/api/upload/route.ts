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

export async function POST(req: NextRequest, res: NextResponse) {

  console.log(req);

  // Multer Configuration
  const upload = multer({
    storage: multer.diskStorage({
      destination: "./public/uploads",
      filename: (req, file, cb) => cb(null, file.originalname), // Save files with their original names
    }),
  });

  // Add multer as a middleware
  const uploadMiddleware = upload.single("file"); // for single file upload
  await new Promise<void>((resolve, reject) => {
    uploadMiddleware(req as any, res as any, (error: any) => {
      if (error) {
        return reject(error);
      }
      // const link = 'http://localhost:3000/uploads/' + (req as any).file.originalname;
        // await NextResponse.json(link); // Return the link as JSON
      resolve();
    });
  });

  const data = await req.formData();
  if (data.get('file')) {
    // upload the file
    const file = data.get('file');
  }
    

  // const filename = req.formData.file.originalname;
  const link = 'https://www.godubrovnik.com/wp-content/uploads/pizza.jpg'

  // Process a POST request
  return NextResponse.json(link);
  return NextResponse.json({ data: "success" });
  
};
















// export const config = {
//   api: {
//     bodyParser: false, // Disallow body parsing
//   },
// };
