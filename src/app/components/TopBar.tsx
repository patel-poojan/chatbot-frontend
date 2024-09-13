"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FiAlignJustify } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { RiArrowDropDownLine } from "react-icons/ri";
import { motion } from "framer-motion"; // Import motion

const TopBar = ({ content }: { content: React.ReactNode }) => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  return (
    <div className="flex sticky backdrop-blur-xl z-10 top-0 items-center justify-between px-6 py-4 bg-[#ffffff7a] shadow-lg md:px-10 lg:px-20">
      <div className="flex items-center gap-2">
        <Image
          src="/images/bot-icon.svg"
          alt="chatbot logo"
          width={30}
          height={30}
          priority
          quality={100}
        />
        <div className="text-xl font-medium md:text-2xl text-[#1E255E]">
          ChatBot
        </div>
      </div>
      <div className="hidden min-[850px]:flex gap-6 items-center text-base text-[#1E255E] ">
        <Link href="/" className="hover:underline flex  items-center ">
          Product <RiArrowDropDownLine className="text-lg" />
        </Link>
        <Link href="/" className="hover:underline flex  items-center">
          Pricing
        </Link>
        <Link href="/" className="hover:underline flex  items-center">
          Integration <RiArrowDropDownLine className="text-lg" />
        </Link>
        <Link href="/" className="hover:underline flex  items-center">
          Resources <RiArrowDropDownLine className="text-lg" />
        </Link>
      </div>
      <div className="flex relative min-[850px]:hidden">
        {!isOpen ? (
          <FiAlignJustify
            className="text-2xl cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          />
        ) : (
          <IoClose
            className="text-2xl cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          />
        )}

        {isOpen && (
          <>
            <div className="fixed inset-0  z-40" onClick={toggleDrawer} />
            <motion.div
              initial={{ y: "-calc(100vh - 62px)", opacity: 0 }} // Start hidden off-screen just below 62px
              animate={{ y: 0, opacity: 1 }} // Animate to the visible position
              exit={{ y: "-calc(100vh - 62px)", opacity: 0 }} // Exit by sliding back up
              transition={{ type: "tween", duration: 0.3 }} // Smooth animation
              className="fixed top-[62px] md:top-[64px] right-0 h-[calc(100dvh-62px)] md:h-[calc(100dvh-64px)] w-full bg-white drop-shadow-xl border-t-2 z-50 px-3 pb-3"
              onClick={(e) => e.stopPropagation()}
            >
              {content}
            </motion.div>
          </>
        )}
      </div>
      <div className="hidden min-[850px]:flex gap-4 items-center">
        <Button
          className="border border-[#57C0DD] text-sm text-[#57C0DD] py-2 px-6 lg:px-8 bg-transparent rounded-full hover:bg-[#f0faff]"
          onClick={() => {
            router.push("/login");
          }}
        >
          Log in
        </Button>
        <Button
          className="bg-[#57C0DD] text-white text-sm py-2 px-6 lg:px-8 rounded-full hover:bg-[#4cb9d1]"
          onClick={() => {
            router.push("/signup");
          }}
        >
          Sign up
        </Button>
      </div>
    </div>
  );
};

export default TopBar;

// {isOpen && (
//   <>
//     <div className="fixed inset-0  z-40" onClick={toggleDrawer} />
//     <div
//       className="fixed top-[62px] md:top-[64px]npm install framer-motion  right-0 h-[calc(100dvh-62px)] md:h-[calc(100dvh-64px)] w-full bg-white drop-shadow-xl border-t-2  z-50 px-3 pb-3"
//       onClick={(e) => e.stopPropagation()}
//     >
//       <div className="h-full flex flex-col w-full bg-white">
//         <div className="w-full  text-left  flex-1">
//           <p className="text-sm border-b border-[#F3F3F3] py-4 font-semibold text-[#1E255E]">
//             Product
//           </p>
//           <p className="text-sm border-b border-[#F3F3F3] py-4 font-semibold text-[#1E255E]">
//             Pricing
//           </p>
//           <p className="text-sm border-b border-[#F3F3F3] py-4 font-semibold text-[#1E255E]">
//             Integration
//           </p>
//           <p className="text-sm border-b border-[#F3F3F3] py-4 font-semibold text-[#1E255E]">
//             Resources
//           </p>
//         </div>
//         <form onSubmit={handleSubmit} className="w-full">
//           <div className="mt-8 w-full ">
//             <Input
//               type="email"
//               required
//               value={emailId}
//               onChange={(e) => {
//                 setEmailId(e.target.value);
//               }}
//               placeholder="Enter your business email"
//               className="w-full px-6 py-3 border rounded-full focus:outline-none focus:ring-0 border-[#1E255E] text-[#1E255EB2] font-medium text-sm"
//             />
//             <Button
//               type="submit"
//               className="mt-2 w-full px-6 py-3 bg-gradient-to-r from-[#58C8DD] to-[#53A7DD] text-white text-sm font-medium rounded-full"
//             >
//               Sign up free
//             </Button>
//           </div>
//         </form>

//         {/* Footer text */}
//         <div className="my-4 text-center">
//           <p className="text-gray-500">
//             Already have an account?{" "}
//             <a href="/login" className="text-cyan-500 hover:underline">
//               Log in
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   </>
// )}
