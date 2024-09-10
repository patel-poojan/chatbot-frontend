import Image from "next/image";
import React from "react";
import { FaChevronRight } from "react-icons/fa";
import { MdOutlineCheckCircle } from "react-icons/md";

const MarketingTemplate = ({
  imgSrc,
  title,
  navigationText,
}: {
  imgSrc: string;
  title: string;
  navigationText: string;
}) => {
  return (
    <div className="px-6 py-8 sm:py-10 lg:py-12 bg-white rounded-3xl shadow-md">
      <div className="flex flex-col items-center gap-3">
        <Image
          src={imgSrc}
          alt={title}
          width={60}
          height={60}
          className="mx-auto"
        />
        <h3 className="text-[#1E255E] font-semibold text-xl sm:text-2xl text-center">
          {title}
        </h3>
      </div>
      <div className="flex flex-col gap-2 mt-4 sm:mt-6">
        {Array(5)
          .fill("")
          .map((_, index) => (
            <div className="flex gap-2 items-start" key={index}>
              <MdOutlineCheckCircle className="text-lg sm:text-xl mt-[1px]" />
              <p className="text-sm sm:text-base leading-snug">
                Lorem ipsum dolor sit amet consectetur. Sollicitudin leo in.
              </p>
            </div>
          ))}
      </div>
      <div className="mt-4 sm:mt-6 flex items-center justify-center gap-2">
        <span className="text-[#1E255E] font-semibold text-base sm:text-lg">
          {navigationText}
        </span>
        <FaChevronRight className="text-[#1E255E] cursor-pointer" />
      </div>
    </div>
  );
};

export default MarketingTemplate;
