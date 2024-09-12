"use client";
import { Input } from "@/components/ui/input";
import TopBar from "./components/TopBar";
import Image from "next/image";
import MarketingTemplate from "./components/MarketingTemplate";
import CommentCard from "./components/CommentCard";
import BottomBar from "./components/BottomBar";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [emailId, setEmailId] = useState<string>("");

  useEffect(() => {
    const wrapper = document.querySelector(".image-wrapper") as HTMLElement;
    if (!wrapper) return;

    let scrollAmount = 0;
    const speed = 1;

    function scrollImages() {
      scrollAmount -= speed;
      wrapper.style.transform = `translateX(${scrollAmount}px)`;

      if (Math.abs(scrollAmount) >= wrapper.scrollWidth) {
        scrollAmount = 0;
      }

      requestAnimationFrame(scrollImages);
    }

    scrollImages();
  }, []);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (emailId) {
      const params = new URLSearchParams(window.location.search);
      params.set("mailId", emailId);
      const newUrl = `/signup?${params.toString()}`;
      window.location.href = newUrl;
      setEmailId("");
    }
  };
  return (
    <div>
      <TopBar />
      <div className="flex flex-col space-y-10 md:space-y-12">
        {/* template-1 */}
        <div className="px-4 sm:px-8 lg:px-12 bg-[url('/images/temp-1-bg.svg')] bg-contain bg-no-repeat">
          <div className="mx-auto mt-8 md:mt-12 max-w-5xl">
            <div className="flex flex-col space-y-4 md:space-y-6 text-center">
              <h1 className="text-[#1E255E] text-3xl font-bold md:text-4xl lg:text-[64px] lg:leading-[4.2rem]">
                Lorem ipsum dolor sit amet consectetur elit Ut et.
              </h1>
              <p className="text-[#1e255eb3] text-base font-normal md:text-lg lg:text-xl">
                Lorem ipsum dolor sit amet consectetur. Pellentesque risus purus
                est imperdiet interdum platea vestibulum vulputate. Nisi
                maecenas dis ac aenean. At aliquet proin. Sollicitudin odio
                morbi facilisis in.
              </p>
              <form
                onSubmit={(e) => {
                  handleSubmit(e);
                }}
                className="w-full"
              >
                <div className="flex flex-col gap-4 md:flex-row md:gap-6 items-center justify-center">
                  <Input
                    type="email"
                    required
                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value)}
                    className="w-full md:w-2/3 lg:w-3/4 rounded-full p-5 border border-[#1E255E] placeholder:text-[#1E255E] placeholder:text-sm"
                    placeholder="Enter your business email "
                  />
                  <Button className="bg-[#57C0DD] text-white text-sm py-5 px-8 rounded-full hover:bg-[#4cb9d1] mt-1 md:mt-0">
                    Sign up free
                  </Button>
                </div>
              </form>
              <div className="text-black font-light">Free 14-Day Trial</div>
            </div>
            <div className="relative flex flex-col items-center gap-4 mt-8 lg:mt-12">
              <div className="h-[300px] w-full max-w-[500px] bg-[#57C0DD] mx-auto rounded-xl"></div>
              <Image
                src="/images/stand.svg"
                className="-mt-7"
                alt="stand"
                width={130}
                height={150}
                priority
                quality={100}
              />
            </div>
          </div>
        </div>
        {/* template-2 */}
        <div className="bg-white  py-5  lg:py-12">
          <div className="text-[#1E255E] text-xl md:text-4xl font-bold flex flex-col space-y-1 mx-auto text-center max-w-4xl px-4">
            <span>Empowering companies</span>
            <span>to stand out with customer experience</span>
          </div>
          <div className="relative mt-7 md:mt-8 w-full mx-auto px-5 py-2 md:py-5">
            <div className="overflow-hidden mx-0 md:mx-7 ">
              <div className="image-wrapper flex ps-24">
                <Image
                  src="/images/company.svg"
                  alt="company"
                  layout="responsive"
                  width={1000}
                  height={500}
                  className="object-contain"
                  quality={100}
                />
                <Image
                  src="/images/company.svg"
                  alt="company"
                  layout="responsive"
                  width={1000}
                  height={500}
                  className="object-contain"
                  quality={100}
                />
                <Image
                  src="/images/company.svg"
                  alt="company"
                  layout="responsive"
                  width={1000}
                  height={500}
                  className="object-contain"
                  quality={100}
                />
              </div>
            </div>
          </div>
        </div>
        {/* template-3 */}
        <div className="py-4">
          <h2 className="text-[#1E255E] text-2xl md:text-4xl font-bold text-center px-4">
            Cover all customer journey touchpoint automatically
          </h2>
          <p className="text-lg font-normal text-[#1e255eb3] text-center px-4 mt-6 mb-8 md:mb-12 max-w-2xl mx-auto">
            Now your customer relations can focus on optimization, scale up
            through automation, and manage top-tier clients.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7 max-w-7xl mx-auto px-4">
            <MarketingTemplate
              imgSrc="/images/support.svg"
              title="Support"
              navigationText="Hire chatBot as support Agent"
            />
            <MarketingTemplate
              imgSrc="/images/marketing.svg"
              title="Marketing"
              navigationText="Hire chatBot as Marketer"
            />
            <MarketingTemplate
              imgSrc="/images/sales.svg"
              title="Sales"
              navigationText="Hire chatBot as Sales Rep"
            />
          </div>
        </div>
        {/* template-5 */}
        <div className="max-w-6xl gap-5 sm:gap-7 grid grid-cols-1 sm:grid-cols-2 mx-auto px-4">
          <CommentCard
            imgSrc="/images/person.svg"
            message="Lorem ipsum dolor sit amet consectetur. Nullam fames laoreet porttitor diam elementum pharetra aliquam et. Semper maecenas gravida semper morbi. Vel mattis a scelerisque leo nisl vitae lacus turpis. Vitae non malesuada mauris gravida feugiat sit habitant id vitae. Sed sed sit mi in."
            name="Krishty Lovely"
            position="Co-Founder of New Start-up"
          />
          <CommentCard
            imgSrc="/images/person.svg"
            message="Lorem ipsum dolor sit amet consectetur. Nullam fames laoreet porttitor diam elementum pharetra aliquam et. Semper maecenas gravida semper morbi. Vel mattis a scelerisque leo nisl vitae lacus turpis. Vitae non malesuada mauris gravida feugiat sit habitant id vitae. Sed sed sit mi in."
            name="Krishty Lovely"
            position="Co-Founder of New Start-up"
          />
        </div>
      </div>
      <BottomBar />
    </div>
  );
}
