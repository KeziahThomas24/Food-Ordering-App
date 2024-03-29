import { useState } from "react";
import toast from "react-hot-toast";

type EditableImageProps = {
  link: string;
  setLink: React.Dispatch<React.SetStateAction<string>>
}

export default function EditableImage({ link, setLink }: EditableImageProps) {
  async function handleFileChange(ev: React.ChangeEvent<HTMLInputElement>) {
    const files = ev.target.files;
    if (files?.length === 1) {
      const data = new FormData();
      data.set('file', files[0]);

      const uploadPromise = fetch('/api/upload', {
        method: 'POST',
        body: data,
      }).then(response => {
        if (response.ok) {
          return response.json().then(link => {
            console.log("linksaeed" + link);
            setLink(link.link);
          })
        }
        throw new Error('Something went wrong');
      })
      .catch(error => {
        console.error('Error during file upload:', error);
        throw error; // Rethrow the error to be caught by the toast.promise
      });

      await toast.promise(uploadPromise, {
        loading: 'Uploading...',
        success: 'Upload complete',
        error: 'Upload error',
      });
    }
  }

  return (
    <>
    {console.log('Link:', link)} 
      {link && (
        <img className="rounded-lg w-full h-full mb-1" src={link} width={250} height={250} alt={link} />
      )}
      {!link && (
        <div className="text-center bg-gray-200 p-4 text-gray-500 rounded-lg mb-1">
          No image
        </div>
      )}
      <label>
        <input type="file" className="hidden" onChange={handleFileChange} />
        <span className="block border border-gray-300 rounded-lg p-2 text-center cursor-pointer">Change image</span>
      </label>
    </>
  );
}
