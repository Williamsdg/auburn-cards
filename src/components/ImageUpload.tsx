"use client";

import { useState, useRef } from "react";
import Image from "next/image";

type UploadedImage = {
  url: string;
  publicId: string;
};

export default function ImageUpload({
  images,
  onImagesChange,
  folder,
  maxImages = 6,
}: {
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  folder?: string;
  maxImages?: number;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImages: UploadedImage[] = [];

    for (const file of Array.from(files)) {
      if (images.length + newImages.length >= maxImages) break;

      const formData = new FormData();
      formData.append("file", file);
      if (folder) formData.append("folder", folder);

      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.url) {
          newImages.push({ url: data.url, publicId: data.publicId });
        }
      } catch (err) {
        console.error("Upload failed:", err);
      }
    }

    onImagesChange([...images, ...newImages]);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeImage(index: number) {
    onImagesChange(images.filter((_, i) => i !== index));
  }

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
        {images.map((img, i) => (
          <div key={i} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
            <Image src={img.url} alt={`Upload ${i + 1}`} fill className="object-cover" sizes="150px" />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              X
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-auburn hover:text-auburn transition-colors"
          >
            {uploading ? (
              <span className="text-xs">Uploading...</span>
            ) : (
              <>
                <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-xs">Add Photo</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
}
