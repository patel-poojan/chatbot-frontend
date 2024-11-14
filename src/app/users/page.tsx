"use client";
import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaRegCalendar, FaUser } from "react-icons/fa";
import {
  MdAlternateEmail,
  MdMoreVert,
  MdOutlinePersonAddAlt,
  MdSmartToy,
} from "react-icons/md";
import { Input } from "@/components/ui/input";
import { IoSearchSharp } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { VscSettings } from "react-icons/vsc";
import PermissionDialog from "../components/PermissionDialog";
import { axiosInstance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "../components/Loader";
import { DataFormatter } from "@/utils/formatter";
import { toast } from "sonner";
import { useDeleteUser } from "@/utils/user-api";
import { axiosError } from "@/types/axiosTypes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CreateUserDialog from "../components/CreateUserDialog";
// Define types for API responses
interface User {
  _id: string | null;
  username: string | null;
  email: string | null;
  createdAt: string | null;
  totalBots: number | null;
  lastTrainBot: number | null;
}

interface SubAdmin {
  _id: string | null;
  username: string | null;
  email: string | null;
  createdAt: string | null;
  permissions: { _id: string; name: string; resource: string }[];
}

interface FetchUserResponse {
  statusCode: number;
  data: User[] | [];
  message: string;
  success: boolean;
}

interface FetchSubAdminResponse {
  statusCode: number;
  data: SubAdmin[] | [];
  message: string;
  success: boolean;
}

const Details = ({
  type,
  details,
  refetch,
}: {
  type: string;
  details: User[] | SubAdmin[];
  refetch: () => void;
}) => {
  const [userOrAdminDetails, setUserOrAdminDetails] = useState<
    User[] | SubAdmin[] | []
  >(details);
  useEffect(() => {
    setUserOrAdminDetails(details);
  }, [details]);
  const { mutate: onDelete, isPending } = useDeleteUser({
    onSuccess(data) {
      refetch();
      toast.success(data?.message);
    },
    onError(error: axiosError) {
      const errorMessage =
        error?.response?.data?.errors?.message ||
        error?.response?.data?.message ||
        "Delete user failed";
      toast.error(errorMessage);
    },
  });
  const handleDelete = (id: string) => {
    if (type === "user") {
      onDelete({ id, userType: "user" });
    } else {
      onDelete({ id, userType: "subadmin" });
    }
  };
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      {isPending ? <Loader /> : null}
      <Table className="min-w-full md:table-fixed">
        <TableHeader className="bg-[#57C0DD1A] backdrop-blur-3xl sticky top-0 z-10">
          <TableRow>
            <TableHead className="py-2 text-start">
              <div className="flex items-center  flex-wrap justify-start gap-1">
                <FaUser className="text-[#57C0DD] text-base hidden lg:block" />
                <span className="break-all">Name</span>
              </div>
            </TableHead>
            <TableHead className="py-2 text-center">
              <div className="flex items-center  flex-wrap justify-center gap-1">
                <MdAlternateEmail className="text-[#57C0DD] text-base hidden lg:block" />
                <span className="break-all">Email</span>
              </div>
            </TableHead>
            {type === "user" && (
              <>
                <TableHead className="py-2 text-center">
                  <div className="flex items-center flex-wrap justify-center gap-2 ">
                    <FaRegCalendar className="text-[#57C0DD] text-base hidden lg:block" />
                    <span className="break-all">Last Train Bot</span>
                  </div>
                </TableHead>
                <TableHead className="py-2 text-center">
                  <div className="flex items-center  flex-wrap justify-center gap-1">
                    <MdSmartToy className="text-[#57C0DD] text-base hidden lg:block" />
                    <span className="break-all">Total Bots</span>
                  </div>
                </TableHead>
              </>
            )}
            <TableHead className="py-2 text-center">
              <div className="flex items-center  flex-wrap justify-center ">
                <MdMoreVert className="text-[#57C0DD] text-base hidden lg:block" />
                <span className="break-all">Action</span>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.isArray(userOrAdminDetails) &&
          userOrAdminDetails.length > 0 ? (
            userOrAdminDetails.map((detail, index) => (
              <TableRow key={index}>
                <TableCell className="text-left">
                  <div className="flex  break-all capitalize items-center justify-start ">
                    {detail.username ?? ""}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex  break-all items-center justify-center ">
                    {detail.email ?? ""}
                  </div>
                </TableCell>
                {type === "user" && (
                  <>
                    <TableCell className="text-center">
                      <div className="flex  items-center break-all justify-center ">
                        {"lastTrainBot" in detail
                          ? DataFormatter(detail.lastTrainBot ?? 0)
                          : ""}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex  items-center break-all justify-center ">
                        {"totalBots" in detail ? detail.totalBots : ""}
                      </div>
                    </TableCell>
                  </>
                )}

                <TableCell className="text-center">
                  <div className="flex flex-wrap items-center justify-center gap-1">
                    {type === "admin" && "permissions" in detail && (
                      <PermissionDialog
                        adminId={detail._id ?? ""}
                        permissions={detail.permissions ?? []}
                        name={detail.username ?? ""}
                        trigger={
                          <VscSettings className="text-lg rotate-90 cursor-pointer" />
                        }
                      />
                    )}
                    <RiDeleteBin6Line
                      className="text-lg cursor-pointer"
                      onClick={() => handleDelete(detail._id ?? "")}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                className="text-center"
                colSpan={type === "user" ? 5 : 3}
              >
                No data
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

const Page = () => {
  const [tab, setTab] = useState(0);
  const [searchTerms, setSearchTerms] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerms);
  const fetchUsers = async (): Promise<User[]> => {
    const response: FetchUserResponse = await axiosInstance.get(
      `/admin/users?search=${debouncedSearch}`
    );
    return response.data;
  };

  const fetchSubAdmins = async (): Promise<SubAdmin[]> => {
    const response: FetchSubAdminResponse = await axiosInstance.get(
      `/admin/subadmin?search=${debouncedSearch}`
    );
    return response.data;
  };

  const {
    data: usersDetails,
    isLoading: loadUsersDetails,
    isError: errorInUsersDetails,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ["Users"],
    queryFn: fetchUsers,
    // staleTime: 5 * 60 * 1000,
    enabled: tab === 1,
  });
  const {
    data: subAdminDetails,
    isLoading: loadSubAdminDetails,
    refetch: refetchSubAdmins,
    isError: errorInSubAdminDetails,
  } = useQuery({
    queryKey: ["subAdmins"],
    queryFn: fetchSubAdmins,
    enabled: tab === 0,
  });
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerms);
    }, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerms]);
  useEffect(() => {
    if (debouncedSearch.length > 2) {
      if (tab === 0) {
        refetchSubAdmins();
      } else {
        refetchUsers();
      }
    }
    if (debouncedSearch.length === 0) {
      if (tab === 0) {
        refetchSubAdmins();
      } else {
        refetchUsers();
      }
    }
  }, [debouncedSearch, refetchSubAdmins, refetchUsers, searchTerms, tab]);
  useEffect(() => {
    setSearchTerms("");
    setDebouncedSearch("");
  }, [tab]);

  useEffect(() => {
    if (errorInSubAdminDetails) {
      const errorMessage = "Failed to load sub-admins";
      toast.error(errorMessage);
    }
    if (errorInUsersDetails) {
      const errorMessage = "Failed to load users";
      toast.error(errorMessage);
    }
  }, [errorInSubAdminDetails, errorInUsersDetails]);

  return (
    <DashboardLayout>
      {(loadUsersDetails || loadSubAdminDetails) && <Loader />}
      <div className="flex flex-1 flex-col  overflow-hidden max-[500px]:p-4 gap-4 sm:gap-6 max-w-full">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                onClick={() => setTab(0)}
                className={`cursor-pointer ${
                  tab === 0
                    ? "text-base sm:text-lg text-[#1E255E] font-medium underline underline-offset-8 decoration-2 decoration-[#57C0DD]"
                    : "text-sm sm:text-base text-black font-light"
                }`}
              >
                Admin
              </div>
              <div
                onClick={() => setTab(1)}
                className={`cursor-pointer ${
                  tab === 1
                    ? "text-base sm:text-lg text-[#1E255E] font-medium underline underline-offset-8 decoration-2 decoration-[#57C0DD]"
                    : "text-sm sm:text-base text-black font-light"
                }`}
              >
                User
              </div>
            </div>
            <CreateUserDialog
              type={tab === 1 ? "user" : "subAdmin"}
              refetch={tab === 1 ? refetchUsers : refetchSubAdmins}
              trigger={
                <div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="bg-[#F8F8F8] flex items-center cursor-pointer justify-center rounded-xl px-3 h-10 md:h-11">
                          <MdOutlinePersonAddAlt className="text-lg text-[#1E255E]" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent
                        side="bottom"
                        align="center"
                        className="bg-[#1B1B20]"
                      >
                        <p className=" !text-[10px]">
                          {tab === 1 ? "Add User" : "Add sub Admin"}
                        </p>
                      </TooltipContent>
                    </Tooltip>{" "}
                  </TooltipProvider>
                </div>
              }
            />
          </div>
          <div className="flex items-center py-0 md:py-1 px-3  rounded-xl bg-[#F8F8F8] w-full sm:w-auto">
            <IoSearchSharp className="text-lg text-[#1E255E]" />
            <Input
              onChange={(e) => setSearchTerms(e.target.value)}
              className="w-full sm:w-32 border-none text-[#1E255E] placeholder:text-[#1E255E] bg-transparent focus-visible:ring-0 placeholder:font-light text-base"
              type="text"
              placeholder="Search"
            />
          </div>
        </div>

        {tab === 0 && (
          <Details
            type="admin"
            refetch={refetchSubAdmins}
            details={errorInSubAdminDetails ? [] : subAdminDetails ?? []}
          />
        )}
        {tab === 1 && (
          <Details
            type="user"
            refetch={refetchUsers}
            details={errorInUsersDetails ? [] : usersDetails ?? []}
          />
        )}
      </div>
    </DashboardLayout>
  );
};
export default Page;
