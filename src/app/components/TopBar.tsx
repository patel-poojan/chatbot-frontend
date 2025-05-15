'use client';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FiAlignJustify } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { motion } from 'framer-motion';
const TopBar = ({
  content,
}: {
  content: React.ReactNode | ((toggleDrawer: () => void) => React.ReactNode);
}) => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  return (
    <div className='flex sticky backdrop-blur-xl z-20 top-0 items-center justify-between px-6 py-4 bg-[#ffffff7a] shadow-lg md:px-10 lg:px-20'>
      <div className='flex items-center gap-2' onClick={() => router.push('/')}>
        <Image
          src='/images/bot-icon.svg'
          alt='chatbot logo'
          width={30}
          height={30}
          priority
          quality={100}
        />
        <div className='text-xl font-medium md:text-2xl text-[#1E255E]'>
          ChatAgent
        </div>
      </div>
      <div className='hidden min-[850px]:flex gap-6 items-center text-base text-[#1E255E] '>
        <Link href='/' className='hover:underline flex  items-center '>
          Product <RiArrowDropDownLine className='text-lg' />
        </Link>
        <Link href='/' className='hover:underline flex  items-center'>
          Pricing
        </Link>
        <Link href='/' className='hover:underline flex  items-center'>
          Integration <RiArrowDropDownLine className='text-lg' />
        </Link>
        <Link href='/' className='hover:underline flex  items-center'>
          Resources <RiArrowDropDownLine className='text-lg' />
        </Link>
      </div>
      <div className='flex relative min-[850px]:hidden'>
        {!isOpen ? (
          <FiAlignJustify
            className='text-2xl cursor-pointer'
            onClick={() => setIsOpen(!isOpen)}
          />
        ) : (
          <IoClose
            className='text-2xl cursor-pointer'
            onClick={() => setIsOpen(!isOpen)}
          />
        )}

        {isOpen && (
          <>
            <div className='fixed inset-0  ' onClick={toggleDrawer} />
            <motion.div
              initial={{ y: '-calc(100vh - 62px)', opacity: 0 }} // Start hidden off-screen just below 62px
              animate={{ y: 0, opacity: 1 }} // Animate to the visible position
              exit={{ y: '-calc(100vh - 62px)', opacity: 0 }} // Exit by sliding back up
              transition={{ type: 'tween', duration: 0.3 }} // Smooth animation
              className='fixed top-[62px] md:top-[64px] right-0 h-[calc(100dvh-62px)] md:h-[calc(100dvh-64px)] w-full bg-white drop-shadow-xl border-t-2 z-50 px-3 pb-3'
              onClick={(e) => e.stopPropagation()}
            >
              {typeof content === 'function' ? content(toggleDrawer) : content}
            </motion.div>
          </>
        )}
      </div>
      <div className='hidden min-[850px]:flex gap-4 items-center'>
        <Button
          className='border border-[#57C0DD] text-sm text-[#57C0DD] py-2 px-6 lg:px-8 bg-transparent rounded-full hover:bg-[#f0faff]'
          onClick={() => {
            router.push('/login');
          }}
        >
          Log in
        </Button>
        <Button
          className='bg-[#57C0DD] text-white text-sm py-2 px-6 lg:px-8 rounded-full hover:bg-[#4cb9d1]'
          onClick={() => {
            router.push('/signup');
          }}
        >
          Sign up
        </Button>
      </div>
    </div>
  );
};

export default TopBar;
