import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BsPersonFill } from "react-icons/bs";
import { IoGrid } from "react-icons/io5";
import {
  MdKeyboardArrowRight,
  MdLockReset,
  MdOutlineLogout,
  MdOutlinePeopleAlt,
  MdOutlineQuickreply,
} from "react-icons/md";
import TopBar from "../components/TopBar";
import { usePathname, useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLogout } from "@/utils/api";
import ResetPasswordDialog from "./ResetPasswordDialog";
import { toast } from "sonner";
import { Loader } from "./Loader";
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathName = usePathname();
  // const [isOpenPopup, setIsOpenPopup] = useState<boolean>(false);

  const router = useRouter();
  const { mutate, isPending } = useLogout({
    onSuccess(data) {
      toast.success(data?.message);
      router.push("/");
    },
  });
  return (
    <div className="min-[500px]:bg-[#1B1B20] h-dvh  flex  p-0 min-[500px]:p-3">
      {isPending ? <Loader /> : <></>}
      <div className="pr-3 hidden min-[500px]:flex flex-col justify-between py-3  lg:items-center">
        <div className="flex flex-col gap-3 items-center">
          <Link href={"/"}>
            <Image
              className="bg-white rounded-full cursor-pointer"
              src="/images/bot-icon.svg"
              alt="chatbot logo"
              width={45}
              height={45}
              priority
              quality={100}
            />
          </Link>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={"/chatbotlist"}>
                  <div
                    className={`${
                      pathName === "/chatbotlist" || pathName === "/create"
                        ? "bg-[#3D3D4A]"
                        : "bg-transparent"
                    } hover:bg-[#3D3D4A] h-11 w-11 flex items-center justify-center rounded-md cursor-pointer`}
                  >
                    <IoGrid className="text-white text-2xl" />
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                align="center"
                className="bg-[#1B1B20]"
                sideOffset={14}
              >
                <p>ChatBots</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={"/users"}>
                  <div
                    className={`${
                      pathName === "/users" ? "bg-[#3D3D4A]" : "bg-transparent"
                    } hover:bg-[#3D3D4A] h-11 w-11 flex items-center justify-center rounded-md cursor-pointer`}
                  >
                    <MdOutlinePeopleAlt className="text-2xl text-white cursor-pointer" />
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                align="center"
                className="bg-[#1B1B20]"
                sideOffset={14}
              >
                <p>users</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={"/training"}>
                  <div
                    className={`${
                      pathName === "/training"
                        ? "bg-[#3D3D4A]"
                        : "bg-transparent"
                    } hover:bg-[#3D3D4A] h-11 w-11 flex items-center justify-center rounded-md cursor-pointer`}
                  >
                    <MdOutlineQuickreply className="text-2xl text-white cursor-pointer" />
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent
                className="bg-[#1B1B20]"
                side="right"
                align="center"
                sideOffset={14}
              >
                <p>training</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Popover>
          <PopoverTrigger>
            <BsPersonFill className="text-black text-4xl cursor-pointer p-1 rounded-full bg-white" />
          </PopoverTrigger>
          <PopoverContent
            className="mb-1 ms-3 border border-[#EFEFEF] rounded-xl w-fit p-1"
            style={{ boxShadow: "0px 0px 12px 4px #00000014" }}
          >
            <ResetPasswordDialog
              trigger={
                <div className="text-black font-medium text-base flex gap-1 pt-2 px-4 pb-1 hover:bg-[#58C8DD4a] items-center cursor-pointer">
                  <MdLockReset className="text-xl" /> Reset Password
                </div>
              }
            />

            <div
              className="text-black font-medium text-base gap-1 hover:bg-[#58C8DD4a] pb-2 px-4 pt-1 flex items-center cursor-pointer"
              onClick={() => mutate()}
            >
              <MdOutlineLogout className="text-xl" /> Log Out
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex-1 w-full flex flex-col bg-white max-[500px]:p-0 p-6 lg:p-8 xl:px-16 xl:py-12  min-[500px]:rounded-3xl overflow-hidden h-full">
        <div className="block min-[500px]:hidden">
          <TopBar
            content={
              <div className="h-full flex flex-col w-full bg-white pt-3">
                <div className="w-full  flex-1">
                  <Link href={"/chatbotlist"}>
                    <div
                      className={`flex gap-3 items-center  rounded-lg py-3 ${
                        pathName === "/chatbotlist" || pathName === "/create"
                          ? "px-3 blue-gradient"
                          : ""
                      }`}
                    >
                      <div
                        className={
                          pathName === "/chatbotlist" || pathName === "/create"
                            ? "p-2 rounded-md bg-[#3D3D4A33]"
                            : ""
                        }
                      >
                        <IoGrid
                          className={
                            pathName === "/chatbotlist" ||
                            pathName === "/create"
                              ? "text-white text-xl"
                              : "text-lg text-[#1e255eb2]"
                          }
                        />
                      </div>
                      <p
                        className={`text-base  ${
                          pathName === "/chatbotlist" || pathName === "/create"
                            ? "text-white"
                            : "text-[#1e255eb2]"
                        }  font-medium`}
                      >
                        Dashboard
                      </p>
                    </div>
                  </Link>
                  <Link href={"/users"}>
                    <div
                      className={`flex gap-3 items-center   rounded-lg py-3 ${
                        pathName === "/users" ? "px-3 blue-gradient" : ""
                      }`}
                    >
                      <div
                        className={
                          pathName === "/users"
                            ? "p-2 rounded-md bg-[#3D3D4A33] "
                            : ""
                        }
                      >
                        <MdOutlinePeopleAlt
                          className={
                            pathName === "/users"
                              ? "text-white text-xl"
                              : "text-2xl text-[#1e255eb2]"
                          }
                        />
                      </div>
                      <p
                        className={`text-base  ${
                          pathName === "/users"
                            ? "text-white"
                            : "text-[#1e255eb2]"
                        }  font-medium`}
                      >
                        User
                      </p>
                    </div>
                  </Link>
                  <Link href={"/training"}>
                    <div
                      className={`flex gap-3 items-center  rounded-lg py-3 ${
                        pathName === "/training" ? "px-3 blue-gradient" : ""
                      }`}
                    >
                      <div
                        className={
                          pathName === "/training"
                            ? "p-2 rounded-md bg-[#3D3D4A33]"
                            : ""
                        }
                      >
                        <MdOutlineQuickreply
                          className={
                            pathName === "/training"
                              ? "text-white text-xl"
                              : "text-2xl text-[#1e255eb2]"
                          }
                        />
                      </div>
                      <p
                        className={`text-base  ${
                          pathName === "/training"
                            ? "text-white"
                            : "text-[#1e255eb2]"
                        }  font-medium`}
                      >
                        Training
                      </p>
                    </div>
                  </Link>
                </div>
                <Popover>
                  <PopoverTrigger>
                    <div className="flex justify-between items-center border-2 bg-[#e9e9e933] rounded-xl border-[#F3F3F3] p-2">
                      <div className="flex items-center gap-3">
                        <BsPersonFill className="text-white text-4xl cursor-pointer p-2 rounded-full bg-black" />
                        <div className="text-start">
                          <p className="text-[#1e255eb2] font-medium text-base">
                            User Name
                          </p>
                          <p className="text-[#1e255eb2] font-light text-base">
                            useremail123@gmail.com
                          </p>
                        </div>
                      </div>
                      <MdKeyboardArrowRight className="text-xl text-[#1E255E]" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent
                    className="mb-1 border  border-[#EFEFEF] rounded-xl w-[95vw]  p-1"
                    style={{ boxShadow: "0px 0px 12px 4px #00000014" }}
                  >
                    <ResetPasswordDialog
                      trigger={
                        <div className="text-black font-medium text-base  flex gap-1 pt-2 px-6  items-center cursor-pointer">
                          <MdLockReset className="text-xl" /> Reset Password
                        </div>
                      }
                    />
                    <div className="border-b-2 border-[#EFEFEF] my-2 mx-3 "></div>
                    <div
                      className="text-[red] font-medium text-base gap-1  pb-2 px-6  flex items-center cursor-pointer"
                      onClick={() => mutate()}
                    >
                      <MdOutlineLogout className="text-xl" /> Log Out
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            }
          />
        </div>
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
