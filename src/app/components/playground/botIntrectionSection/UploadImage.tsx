import Image from "next/image";
import React, { useState } from "react";
import { IoCameraSharp } from "react-icons/io5";

const UploadImage = ({ bg }: { bg?: string }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative group h-full  w-full ">
      {selectedImage ? (
        <Image
          src={selectedImage}
          alt="Selected"
          layout="fill"
          objectFit="cover"
          priority
          className="rounded"
        />
      ) : (
        <label
          className={`flex items-center justify-center rounded-md ${
            bg ? bg : "bg-white"
          } text-black h-full w-full p-2 cursor-pointer`}
        >
          <div className="flex flex-col items-center">
            <IoCameraSharp className="text-2xl" />
            <span className="text-sm sm:text-base text-center">Browse</span>
          </div>
        </label>
      )}
      <div className="absolute top-0 left-0 w-full h-full items-center justify-center hidden group-hover:flex">
        <label className="flex items-center justify-center rounded-md bg-[#57C0DD] text-white h-full w-full p-2 cursor-pointer">
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
          />
          <div className="flex flex-col items-center">
            <IoCameraSharp className="text-2xl" />
            <span className="text-sm sm:text-base text-center">Browse</span>
          </div>
        </label>
      </div>
    </div>
  );
};

export default UploadImage;
