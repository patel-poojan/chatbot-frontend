import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { IoCameraSharp } from 'react-icons/io5';
import { toast } from 'sonner';
import { TypeResponseList } from '@/types/node';

interface UploadImageProps {
  bg?: string;
  onImageUpload?: (url: string) => void;
  initialImage: string;
  setResponseList?: React.Dispatch<React.SetStateAction<TypeResponseList[]>>;
  index?: number;
}

const UploadImage: React.FC<UploadImageProps> = ({
  bg,
  onImageUpload,
  initialImage,
  setResponseList,
  index,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (initialImage) {
      setSelectedImage(initialImage);
      setIsImageLoading(true);
      setImageError(false);
    }
  }, [initialImage]);

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      toast.warning('Please upload JPG or PNG files only');
      return false;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.warning('File size must be less than 5MB');
      return false;
    }

    return true;
  };

  const updateResponseList = (
    newFile: File | null,
    previewUrl: string | null
  ) => {
    if (setResponseList && typeof index === 'number') {
      setResponseList((prev) => {
        const newList = [...prev];
        newList[index] = {
          ...newList[index],
          info: {
            ...newList[index].info,
            file: previewUrl || '',
            pendingFile: newFile,
            previousFileUrl: newFile ? initialImage : null,
          },
        };
        return newList;
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) return;

    try {
      setIsImageLoading(true);
      setImageError(false);

      const previewUrl = URL.createObjectURL(file);
      setSelectedImage(previewUrl);
      updateResponseList(file, previewUrl);

      if (onImageUpload) {
        onImageUpload(previewUrl);
      }
    } catch (error) {
      console.error('Error handling file selection:', error);
      toast.error('Failed to process image');
      setImageError(true);
    } finally {
      setIsImageLoading(false);
    }
  };

  const handleImageError = () => {
    setSelectedImage(null);
    setIsImageLoading(false);
    setImageError(true);
    updateResponseList(null, null);
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
    setImageError(false);
  };

  return (
    <div className='relative group h-full w-full'>
      {selectedImage ? (
        <>
          {imageError ? (
            <div className='absolute inset-0 flex items-center justify-center bg-gray-100 rounded-md'>
              <div className='text-sm text-gray-500'>Unable to load image</div>
            </div>
          ) : (
            <>
              <Image
                src={selectedImage}
                alt='Selected'
                layout='fill'
                objectFit='cover'
                priority
                onError={handleImageError}
                onLoadingComplete={handleImageLoad}
              />
              {isImageLoading && (
                <div className='absolute inset-0 opacity-60 flex items-center justify-center bg-gray-100 rounded-md'>
                  <div className='w-10 h-10 border-4 border-gray-200 border-t-[#3bc5dd] rounded-full animate-spin' />
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <label
          className={`flex items-center justify-center ${
            bg ? bg : 'bg-white'
          } text-black h-full w-full p-2 cursor-pointer`}
        >
          <div className='flex flex-col items-center'>
            <IoCameraSharp className='text-2xl' />
            <span className='text-sm sm:text-base text-center'>Browse</span>
          </div>
        </label>
      )}
      <div className='absolute top-0 left-0 w-full h-full items-center justify-center hidden group-hover:flex'>
        <label
          className={`flex items-center justify-center ${
            selectedImage ? 'bg-[#57C0DD7a]' : 'bg-[#57C0DD]'
          } text-white h-full w-full p-2 cursor-pointer`}
        >
          <input
            type='file'
            className='hidden'
            onChange={handleFileChange}
            accept='.jpg,.jpeg,.png'
          />
          <div className='flex flex-col items-center'>
            <IoCameraSharp className='text-2xl' />
            <span className='text-sm sm:text-base text-center'>Browse</span>
          </div>
        </label>
      </div>
    </div>
  );
};

export default UploadImage;
