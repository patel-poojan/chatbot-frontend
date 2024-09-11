import Image from "next/image";
import React from "react";

const CommentCard = ({
  name,
  position,
  imgSrc,
  message,
}: {
  name: string;
  message: string;
  position: string;
  imgSrc: string;
}) => {
  return (
    <div className="bg-white p-6 sm:p-8 lg:p-12 shadow-md rounded-2xl">
      <p className="text-black text-sm sm:text-base lg:text-lg font-light leading-relaxed">
        {message}
      </p>
      <div className="mt-4 sm:mt-6 flex items-center gap-4">
        <Image
          src={imgSrc}
          alt="bot-icon"
          width={40}
          height={40}
          priority
          quality={100}
        />
        <div>
          <p className="text-[#1E255E] font-semibold text-base sm:text-xl">
            {name}
          </p>
          <p className="text-[#1E255EB2] font-medium text-sm sm:text-lg">
            {position}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
