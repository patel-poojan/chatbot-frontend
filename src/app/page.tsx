"use client";
import { Input } from "@/components/ui/input";
import TopBar from "./components/TopBar";
import Image from "next/image";
import MarketingTemplate from "./components/MarketingTemplate";
import CommentCard from "./components/CommentCard";
import BottomBar from "./components/BottomBar";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Head from "next/head";

export default function Home() {
  const [emailId, setEmailId] = useState<string>("");
  const [flowIndex, setFlowIndex] = useState<number>(0);
  const [emailIdForTopBar, setEmailIdForTopBar] = useState<string>("");
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
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>, key: string) => {
    e.preventDefault();
    if (emailIdForTopBar && key === "topBar") {
      const params = new URLSearchParams(window.location.search);
      params.set("mailId", emailIdForTopBar);
      const newUrl = `/signup?${params.toString()}`;
      window.location.href = newUrl;
      setEmailIdForTopBar("");
    }
    if (emailId && key === "template-1") {
      const params = new URLSearchParams(window.location.search);
      params.set("mailId", emailId);
      const newUrl = `/signup?${params.toString()}`;
      window.location.href = newUrl;
      setEmailId("");
    }
  };

  // annimation
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const texts = ["AI based", "24/7"];
  const typingSpeed = isDeleting ? 120 : 300;

  useEffect(() => {
    const currentText = texts[loopNum % texts.length];
    const updatedText = isDeleting ? currentText.substring(0, charIndex - 1) : currentText.substring(0, charIndex + 1);

    setDisplayedText(updatedText);

    if (!isDeleting && charIndex === currentText.length) {
      setTimeout(() => setIsDeleting(true), 1000);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
    }

    const timer = setTimeout(() => setCharIndex(charIndex + (isDeleting ? -1 : 1)), typingSpeed);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, loopNum, texts, typingSpeed]);
  return (
    <div>
      <Head>
        <link rel="preload" href={"/images/chatbot_temp.svg"} as="image" />
      </Head>
      <TopBar
        content={
          <div className="h-full flex flex-col w-full bg-white">
            <div className="w-full text-left flex-1">
              <p className="text-sm border-b border-[#F3F3F3] py-4 font-semibold text-[#1E255E]">Product</p>
              <p className="text-sm border-b border-[#F3F3F3] py-4 font-semibold text-[#1E255E]">Pricing</p>
              <p className="text-sm border-b border-[#F3F3F3] py-4 font-semibold text-[#1E255E]">Integration</p>
              <p className="text-sm border-b border-[#F3F3F3] py-4 font-semibold text-[#1E255E]">Resources</p>
            </div>
            <form
              onSubmit={(e) => {
                handleSubmit(e, "topBar");
              }}
              className="w-full"
            >
              <div className="mt-8 w-full">
                <Input
                  type="email"
                  required
                  value={emailIdForTopBar}
                  onChange={(e) => {
                    setEmailIdForTopBar(e.target.value);
                  }}
                  placeholder="Enter your business email"
                  className="w-full px-6 py-3 border rounded-full focus:outline-none focus:ring-0 border-[#1E255E] text-[#1E255EB2] font-medium text-sm"
                />
                <Button
                  type="submit"
                  className="mt-2 w-full px-6 py-3 bg-gradient-to-r from-[#58C8DD] to-[#53A7DD] hover:from-[#53A7DD] hover:to-[#58C8DD] text-white text-sm font-medium rounded-full"
                >
                  Sign up free
                </Button>
              </div>
            </form>
            {/* Footer text */}
            <div className="my-4 text-center">
              <p className="text-gray-500">
                Already have an account?{" "}
                <a href="/login" className="text-cyan-500 hover:underline">
                  Log in
                </a>
              </p>
            </div>
          </div>
        }
      />
      <div className="flex flex-col gap-6 md:gap-10 lg:gap-[72px]">
        {/* template-1 */}
        <div
          className="px-6 sm:px-12 py-10 sm:py-20 md:pb-36 sm:pt-30"
          style={{
            background:
              "linear-gradient(180deg, rgba(0, 0, 0, 0) 66.86%, #000000 100%) ,linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 63.34%),linear-gradient(180deg, #8711C1 0%, #2472FC 100%)",
          }}
          //       style={{
          //         background: `

          //   linear-gradient(90deg, #8711C1 0%, #2472FC 100%),
          //   linear-gradient(180deg, rgba(0, 0, 0, 0) 66.86%, #000000 100%),
          //   linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 63.34%)
          // `,
          //       }}
        >
          <div className="flex flex-col items-center justify-center">
            <div className="text-white font-bold text-4xl  sm:text-5xl md:text-7xl leading-tight sm:leading-normal">
              <div className="text_animation">
                {displayedText}
                <span className="cursor_animation"></span>
              </div>
            </div>
            <div className="text-white font-bold text-4xl sm:text-5xl md:text-[64px] mt-2 md:mt-5">
              Chat interactions
            </div>

            {/* Form Section */}
            <form
              onSubmit={(e) => handleSubmit(e, "topBar")}
              className="mx-auto w-full max-w-3xl sm:max-w-5xl mt-5 md:mt-9"
            >
              <div className="flex flex-col sm:flex-row items-center gap-3 px-4">
                <Input
                  type="email"
                  required
                  value={emailIdForTopBar}
                  onChange={(e) => setEmailIdForTopBar(e.target.value)}
                  placeholder="Enter your business email"
                  className="w-full sm:w-[82%] px-4 sm:px-6 py-2 sm:py-3 border rounded-xl focus:outline-none focus:ring-0 placeholder:text-white border-white text-white font-medium text-sm"
                />
                <Button
                  type="submit"
                  className="mt-2 sm:mt-0 w-full sm:w-[18%] px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#58C8DD] to-[#53A7DD] hover:from-[#53A7DD] hover:to-[#58C8DD] text-white text-sm font-medium rounded-xl"
                >
                  Sign up free
                </Button>
              </div>
            </form>

            {/* Image Section */}
            <div className="mt-6 sm:mt-12 w-full max-w-7xl">
              <Image
                src={`/images/chatbot_temp.svg`}
                alt="chatbot"
                layout="responsive"
                width={630}
                height={506}
                quality={70}
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>

        {/* template-2 */}
        <div className="px-4 ">
          <div
            className="mx-auto w-fit  flex gap-6 items-center bg-[#F9F9F9] rounded-xl p-3 mb-8 md:mb-12"
            style={{ boxShadow: "0px 0px 2px 0px #0000001F" }}
          >
            <div
              onClick={() => setFlowIndex(0)}
              style={{
                boxShadow: flowIndex === 0 ? "0px 0px 2px 0px #0000001F" : "none",
              }}
              className={`${
                flowIndex === 0
                  ? "bg-white  rounded-md text-black font-medium"
                  : "text-[#1E255EB2] bg-transparent font-normal"
              } py-2 px-12  cursor-pointer`}
            >
              Scan
            </div>
            <div
              onClick={() => setFlowIndex(1)}
              style={{
                boxShadow: flowIndex === 1 ? "0px 0px 2px 0px #0000001F" : "none",
              }}
              className={`${
                flowIndex === 1
                  ? "bg-white  rounded-md text-black font-medium"
                  : "text-[#1E255EB2] bg-transparent font-normal"
              } py-2 px-12 cursor-pointer `}
            >
              Tune
            </div>
          </div>
          <div className="flex justify-center max-w-7xl mx-auto">
            {flowIndex === 0 ? (
              <Image
                src="/images/dashboard.svg"
                alt="Scan"
                // sizes="(max-width: 768px) 90vw, 50vw"
                style={{
                  width: "100%",
                  // maxWidth: "1000px",
                  height: "auto",
                }}
                width={1000}
                height={800}
                quality={100}
              />
            ) : (
              <Image
                src="/images/playground.svg"
                alt="Tune"
                // sizes="100vw"
                // style={{
                //   width: "auto",
                //   height: "80vh",
                // }}
                // width={200}
                // height={300}
                // sizes="(max-width: 768px) 90vw, 50vw"
                style={{
                  width: "100%",
                  // maxWidth: "1000px" ,
                  height: "auto",
                }}
                width={1000}
                height={800}
                quality={100}
              />
            )}
          </div>
        </div>
        {/* template-3 */}
        <div>
          <div className="text-primary text-2xl md:text-4xl lg:text-5xl font-bold flex flex-col mx-auto text-center max-w-5xl px-4 mb-8 md:mb-12">
            <span>Empowering companies</span>
            <span>to stand out with customer experience</span>
          </div>
          <div className="relative  w-full mx-auto px-5 ">
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
        {/* template-4 */}
        <div className="py-6 md:py-10 lg:py-16 px-4 max-w-7xl mx-auto">
          <h2 className="text-primary text-2xl md:text-4xl lg:text-5xl font-bold text-center mb-3 mb:mb-4 lg:mb-6 ">
            Cover all customer journey touchpoint automatically
          </h2>
          <p className="text-lg font-normal text-[#1e255eb3] text-center px-4  mb-8 md:mb-12 max-w-4xl mx-auto">
            Now your customer relations can focus on optimization, scale up through automation, and manage top-tier
            clients.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7 mx-auto px-0 sm:px-4">
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
            <MarketingTemplate imgSrc="/images/sales.svg" title="Sales" navigationText="Hire chatBot as Sales Rep" />
          </div>
        </div>

        {/* template 5 */}

        <div className=" px-4 max-w-7xl mx-auto">
          <h2 className="text-center text-2xl md:text-4xl lg:text-5xl font-bold text-primary mb-3 mb:mb-4 lg:mb-6 ">
            Transform Your Data into a Powerful Chatbot
          </h2>
          <p className="mb-6 mb:mb-8 lg:mb-12 text-[#1E255EB2] text-center font-normal max-w-6xl text-base sm:text-lg mx-auto">
            By integrating your resources—internal documents, website content, and expert knowledge—we develop a chatbot
            that efficiently delivers relevant information and enhances user engagement.
          </p>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-full md:w-1/2">
              <Image
                src={`/images/chatbotflow_1.svg`}
                alt="chatbotflow_1"
                layout="responsive"
                width={630}
                height={506}
                quality={100}
                className="object-contain"
              />
            </div>
            <div className="w-full md:w-1/2">
              <Image
                src={`/images/chatbotflow_2.svg`}
                alt="chatbotflow_2"
                layout="responsive"
                width={630}
                height={506}
                quality={100}
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* template 6 */}
        <div className="py-6 md:py-10 lg:py-16 px-4 bg-white">
          <h2 className="text-center text-2xl md:text-4xl lg:text-5xl font-bold text-primary mb-8 mb:mb-10 lg:mb-14 ">
            Boost Your Marketing Strategy Using Conversational AI
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-9 max-w-[90vw] mx-2 sm:mx-auto">
            {[
              {
                imgName: "marketing_template_1.png",
                title: "Generate Qualified Leads Faster",
                message:
                  "Conversational AI engages visitors in real-time, identifying and capturing qualified leads efficiently.",
              },
              {
                imgName: "marketing_template_2.png",
                title: "Enhance Customer Support and Satisfaction",
                message:
                  "Provide instant, 24/7 support, resolving customer inquiries quickly and improving satisfaction.",
              },
              {
                imgName: "marketing_template_3.png",
                title: "Drive Deeper Customer Engagement",
                message:
                  "AI-powered chatbots offer personalized suggestions, keeping customers engaged with relevant options..",
              },
              {
                imgName: "marketing_template_4.png",
                title: "Increase Sales and Maximize Conversions",
                message:
                  "Guide users through the buying process smoothly, leading to higher conversion rates and increased sales.",
              },
            ].map((feature, index) => (
              <div className="flex flex-col gap-4 h-full" key={index}>
                <Image
                  src={`/images/${feature.imgName}`}
                  alt={feature.imgName ?? ""}
                  width={90}
                  height={90}
                  quality={100}
                  className="object-cover"
                />
                <div>
                  <h3 className="text-2xl text-primary font-semibold mb-2">{feature.title}</h3>
                  <p className="text-[#1E255EB2] text-xl">{feature.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* template-7 */}
        <div
          className="h-[30vh] md:h-[40vh] px-2 flex flex-col align-middle justify-center"
          style={{
            background:
              "linear-gradient(180deg, rgba(0, 0, 0, 0) 66.86%, #000000 100%) ,linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 63.34%),linear-gradient(180deg, #8711C1 0%, #2472FC 100%)",
          }}
        >
          <p className="text-white text-lg sm:text-2xl md:text-4xl text-center font-bold">
            Watch your business grow with Chatbot
          </p>
          <form
            onSubmit={(e) => {
              handleSubmit(e, "topBar");
            }}
            className="mx-auto w-full max-w-5xl"
          >
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-2 px-4">
              <Input
                type="email"
                required
                value={emailIdForTopBar}
                onChange={(e) => setEmailIdForTopBar(e.target.value)}
                placeholder="Enter your business email"
                className="w-full sm:w-[82%] px-6 py-3 border rounded-xl focus:outline-none focus:ring-0 placeholder:text-white border-white text-white font-medium text-sm"
              />
              <Button
                type="submit"
                className="mt-2 sm:mt-0 w-full sm:w-[18%] px-6 py-3 bg-gradient-to-r from-[#58C8DD] to-[#53A7DD] hover:from-[#53A7DD] hover:to-[#58C8DD] text-white text-sm font-medium rounded-xl"
              >
                Sign up free
              </Button>
            </div>
          </form>
        </div>

        {/* template-8 */}
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-10 lg:py-16">
          <h2 className="text-[#1E255E] text-center font-bold mb-6 mb:mb-8 lg:mb-12 text-2xl md:text-4xl lg:text-5xl">
            Our customers say it best
          </h2>
          <div className=" gap-5 sm:gap-7 grid grid-cols-1 sm:grid-cols-2 mx-auto px-0 sm:px-4">
            {[
              {
                imgSrc: "/images/person.svg",
                message:
                  "Lorem ipsum dolor sit amet consectetur. Nullam fames laoreet porttitor diam elementum pharetra aliquam et. Semper maecenas gravida semper morbi. Vel mattis a scelerisque leo nisl vitae lacus turpis. Vitae non malesuada mauris gravida feugiat sit habitant id vitae. Sed sed sit mi in.",
                name: "Krishty Lovely",
                position: "Co-Founder of New Start-up",
              },
              {
                imgSrc: "/images/person.svg",
                message:
                  "Lorem ipsum dolor sit amet consectetur. Nullam fames laoreet porttitor diam elementum pharetra aliquam et. Semper maecenas gravida semper morbi. Vel mattis a scelerisque leo nisl vitae lacus turpis. Vitae non malesuada mauris gravida feugiat sit habitant id vitae. Sed sed sit mi in.",
                name: "Krishty Lovely",
                position: "Co-Founder of New Start-up",
              },
            ].map((comment, index) => (
              <CommentCard
                key={index}
                imgSrc={comment.imgSrc}
                message={comment.message}
                name={comment.name}
                position={comment.position}
              />
            ))}
          </div>
        </div>

        <BottomBar />
      </div>
    </div>
  );
}
