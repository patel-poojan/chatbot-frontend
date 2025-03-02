"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FaArrowLeftLong, FaArrowRightLong, FaMinus, FaPlus } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "./Loader";
import { axiosInstance } from "@/utils/axiosInstance";
import { toast } from "sonner";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { IBDA, IDeletecategory, ISubcategory, IUpdateQuestion } from "@/types/BDA";
import { RiDeleteBinLine } from "react-icons/ri";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import CustomAlertDialog from "./CustomAlertDialog";
import useWindowDimensions from "@/utils/windowSize";

type FetchIndustryListResponse = {
  message: string;
  statusCode: number;
  success: boolean;
  data: {
    id?: string;
    category: string;
    subcategories: string[];
  }[];
};
const ChooseIndustryTemplate = ({
  stepHandler,
  setSubIndustry,
  setIndustry,
  industryValue,
  subIndustryValue,
  setIndustryValue,
  setSubIndustryValue,
  refetchBDAQuestion,
  adminAction = false,
  botId,
}: {
  stepHandler: (type: "up" | "down") => void;
  setIndustry: React.Dispatch<React.SetStateAction<string>>;
  setSubIndustry: React.Dispatch<React.SetStateAction<string>>;
  industryValue: string;
  subIndustryValue: string;
  setIndustryValue: React.Dispatch<React.SetStateAction<string>>;
  setSubIndustryValue: React.Dispatch<React.SetStateAction<string>>;
  refetchBDAQuestion: () => void;
  adminAction?: boolean;
  botId?: string;
}) => {
  const [loader, setLoader] = useState(false);
  const [openIndustryPopup, setOpenIndustryPopup] = useState(false);
  const [openSubIndustryPopup, setOpenSubIndustryPopup] = useState(false);
  const [openAddIndustry, setOpenAddIndustry] = useState(false);
  const [openAddSubIndustry, setOpenAddSubIndustry] = useState(false);
  const [industry, setindustry] = useState<string>("");
  const [subIndustry, setsubIndustry] = useState<string>("");
  const [industryAlert, setIndustryAlert] = useState({
    open: false,
    data: { categoryID: "", category: "" },
  });
  const [subIndustryAlert, setSubIndustryAlert] = useState({
    open: false,
    data: { category: "", subcategory: "" },
  });

  // Initialize state with a single input field
  const [inputs, setInputs] = useState([{ id: 1, value: "" }]);

  // Function to handle adding new input
  const addInput = () => {
    setInputs([...inputs, { id: inputs.length + 1, value: "" }]);
  };

  // Function to delete an input field
  const deleteInput = (id: number) => {
    setInputs(inputs.filter((input) => input.id !== id));
  };

  // Function to handle changes in input values
  const handleInputChange = (id: number, newValue: string) => {
    setInputs(inputs.map((input) => (input.id === id ? { ...input, value: newValue } : input)));
  };

  const fetchIndustry = async () => {
    const response: FetchIndustryListResponse = await axiosInstance.get(`/bda/get-category`);
    if (response.data.length >= 0) {
      return response.data;
    } else {
      return [];
    }
  };

  const {
    data: IndustryList,
    isLoading: loadIndustryList,
    isFetching: fetchingIndustryList,
    isError: errorInIndustryList,
    refetch: refetchIndustryList,
  } = useQuery({
    queryKey: ["Industries", "List"],
    queryFn: fetchIndustry,
  });

  const continueHandler = () => {
    if (!industryValue) {
      toast.warning("Please select industry");
    } else if (!subIndustryValue) {
      toast.warning("Please select sub industry");
    } else {
      setIndustry(industryValue);
      setSubIndustry(subIndustryValue);
      refetchBDAQuestion();
      stepHandler("up");
    }
  };

  const addIndustry = async (body: IBDA) => {
    if (body.category == "") {
      toast.warning("Please enter correct data");
      return;
    }
    setLoader(true);
    axiosInstance
      .post(`/bda/categories`, body)
      .then(() => {
        setOpenAddIndustry(false);
        setindustry("");
        refetchIndustryList();
        setLoader(false);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message);
        setLoader(false);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const deleteIndustry = async (body: IDeletecategory) => {
    if (body.categoryID == "") {
      toast.warning("Please enter correct data");
      return;
    }
    setLoader(true);
    axiosInstance
      .delete(`/bda/categories/${body.categoryID}`)
      .then(() => {
        setIndustryAlert({
          open: false,
          data: { categoryID: "", category: "" },
        });
        setOpenAddIndustry(false);
        setindustry("");
        refetchIndustryList();
        if (industryValue == body.category) {
          setIndustryValue("");
          setSubIndustryValue("");
          setInputs([]);
        }
        setLoader(false);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message);
        setLoader(false);
      });
  };

  const addSubCategory = async (body: ISubcategory) => {
    if (body.category == "" || body.subcategory == "") {
      toast.warning("Please enter correct data");
      return;
    }
    setLoader(true);
    axiosInstance
      .post(`/bda/subcategories`, body)
      .then(() => {
        setOpenAddSubIndustry(false);
        setsubIndustry("");
        refetchIndustryList();
        setLoader(false);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message);
        setLoader(false);
      });
  };

  const deleteSubIndustry = async (body: ISubcategory) => {
    if (body.category == "" || body.subcategory == "") {
      toast.warning("Please enter correct data");
      return;
    }
    setLoader(true);
    axiosInstance
      .put(`/bda/subcategories/delete`, body)
      .then(() => {
        refetchIndustryList();
        setSubIndustryAlert({
          open: false,
          data: { category: "", subcategory: "" },
        });
        if (subIndustryValue == body.subcategory) {
          setSubIndustryValue("");
          setInputs([]);
        }
        setLoader(false);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message);
        setLoader(false);
      });
  };

  const updateQuestion = async () => {
    const questions = inputs.filter((input) => input.value !== "").map((input) => input.value);
    const body: IUpdateQuestion = {
      category: industryValue,
      subcategory: subIndustryValue,
      questions,
    };
    const category = IndustryList?.find((industry) => industry.category == body.category);
    if (body.category == "" && !category) {
      toast.warning("Please enter correct data");
      return;
    }
    if (questions.length == 0) {
      toast.warning("Please enter atleast one question");
      return;
    }
    setLoader(true);
    await axiosInstance
      .put(`/bda/categories/${category?.id}`, body)
      .then(() => {
        refetchIndustryList();
        toast.success("BDA Updated successfuly");
        setLoader(false);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message);
        setLoader(false);
      });
  };

  type FetchBDAQuestionListResponse = {
    message: string;
    statusCode: number;
    success: boolean;
    data: {
      questions: string[];
    };
  };

  const fetchBDAQuestion = async () => {
    const response: FetchBDAQuestionListResponse = await axiosInstance.post(`/bda/questions`, {
      category: industryValue,
      subcategory: subIndustryValue,
    });
    if (response.data.questions.length >= 0) {
      setInputs(
        response.data.questions.map((question: string, index: number) => {
          return { id: index, value: question };
        })
      );
      return response.data.questions;
    } else {
      setInputs([]);
      return [];
    }
  };

  useEffect(() => {
    if (industryValue !== "" && subIndustryValue !== "") {
      fetchBDAQuestion();
    }
  }, [subIndustryValue]);

  return (
    <>
      <div className={`w-full ${!adminAction && "max-w-7xl"} flex-1 mx-auto h-auto flex flex-col`}>
        {(loadIndustryList || fetchingIndustryList || loader) && <Loader />}
        <div className="flex justify-between items-center gap-3 mb-2">
          <div className="flex justify-between flex-col">
            <div className="text-lg md:text-xl font-semibold text-black">Select your industry</div>
            {!adminAction && (
              <div className="text-base hidden sm:block md:text-xl mt-1 font-normal text-black">
                Knowing your industry will help us
              </div>
            )}
          </div>
          {!adminAction && (
            <Button
              onClick={continueHandler}
              className="bg-gradient-to-r hover:from-[#53A7DD] hover:to-[#58C8DD]  from-[#58C8DD] to-[#53A7DD] text-white flex gap-2 items-center py-0 md:py-4 px-2 md:px-9 text-xs max-[500px]:h-7 md:text-lg rounded md:my-3"
            >
              Continue
              <FaArrowRightLong className="text-base md:text-lg text-white" />
            </Button>
          )}
        </div>
        <Popover open={openIndustryPopup} onOpenChange={setOpenIndustryPopup}>
          <PopoverTrigger asChild className="mt-3 md:mt-2">
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openIndustryPopup}
              className="w-full justify-between !bg-transparent"
            >
              {industryValue ? (
                industryValue
              ) : (
                <span className="text-[#6F7288B2] text-sm opacity-90">Select your industry</span>
              )}
              {openIndustryPopup ? (
                <IoIosArrowUp className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              ) : (
                <IoIosArrowDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className=" me-7 w-[180px] md:w-[250px] p-0 ">
            <Command>
              <CommandInput placeholder="Search framework..." />
              <CommandList className="max-h-[120px] md:max-h-[250px] overflow-scroll">
                <CommandEmpty>No industry found.</CommandEmpty>
                <CommandGroup>
                  {adminAction && (
                    <Button
                      className="flex gap-4 bg-primary px-2 py-0 w-full hover:bg-primary mb-2 justify-start"
                      onClick={() => {
                        setOpenAddIndustry((pre) => !pre);
                      }}
                    >
                      <FaPlus />
                      <span>Add Industry</span>
                    </Button>
                  )}
                  {!errorInIndustryList &&
                    IndustryList &&
                    IndustryList.map((Industry) => (
                      <CommandItem
                        key={Industry.category}
                        value={Industry.category}
                        onSelect={(currentValue) => {
                          setSubIndustryValue("");
                          setIndustryValue(currentValue === industryValue ? "" : currentValue);
                          setOpenIndustryPopup(false);
                          setInputs([]);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            industryValue === Industry.category ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {Industry.category}
                        {adminAction && (
                          <RiDeleteBinLine
                            className="text-red-600 ml-auto cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setIndustryAlert({
                                open: true,
                                data: {
                                  categoryID: Industry.id!,
                                  category: Industry.category,
                                },
                              });
                              // deleteIndustry({ categoryID: Industry.id!, category: Industry.category });
                            }}
                          />
                        )}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <div className="text-lg md:text-xl font-semibold text-black mt-4 md:mt-6 ">Select sub industry</div>
        <Popover open={openSubIndustryPopup} onOpenChange={setOpenSubIndustryPopup}>
          <PopoverTrigger asChild className=" mt-3 md:mt-2">
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openSubIndustryPopup}
              className="w-full justify-between !bg-transparent"
            >
              {subIndustryValue ? (
                subIndustryValue
              ) : (
                <span className="text-[#6F7288B2] text-sm opacity-90">Select your sub industry</span>
              )}
              {openSubIndustryPopup ? (
                <IoIosArrowUp className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              ) : (
                <IoIosArrowDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className=" me-7 w-[180px] md:w-[250px] p-0 ">
            <Command>
              <CommandInput placeholder="Search framework..." />
              <CommandList className="max-h-[120px] md:max-h-[250px] overflow-scroll">
                <CommandEmpty>No subindustry found.</CommandEmpty>
                <CommandGroup>
                  {adminAction && industryValue !== "" && (
                    <Button
                      className="flex gap-4 bg-primary px-2 py-0 w-full hover:bg-primary mb-2 justify-start"
                      onClick={() => {
                        setOpenAddSubIndustry((pre) => !pre);
                      }}
                    >
                      <FaPlus />
                      <span>Add Sub Industry</span>
                    </Button>
                  )}
                  {!errorInIndustryList &&
                    IndustryList &&
                    IndustryList.find((data) => data.category === industryValue)?.subcategories.map((subIndustry) => (
                      <CommandItem
                        key={subIndustry}
                        value={subIndustry}
                        onSelect={(currentValue) => {
                          setSubIndustryValue(currentValue === subIndustryValue ? "" : currentValue);
                          setOpenSubIndustryPopup(false);
                        }}
                      >
                        <Check
                          className={cn("mr-2 h-4 w-4", subIndustryValue === subIndustry ? "opacity-100" : "opacity-0")}
                        />
                        {subIndustry}
                        {adminAction && (
                          <RiDeleteBinLine
                            className="text-red-600 ml-auto cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setSubIndustryAlert({
                                open: true,
                                data: {
                                  category: industryValue,
                                  subcategory: subIndustry,
                                },
                              });
                              // deleteSubIndustry({ category: industryValue, subcategory: subIndustry });
                            }}
                          />
                        )}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {!adminAction && botId && (
          <CustomAlertDialog
            botId={botId as string}
            trigger={
              <div className="flex items-center gap-2 cursor-pointer mt-4 md:mt-6">
                <FaArrowLeftLong className="text-[#57C0DD] text-lg" />
                <span className="text-[#57C0DD] text-base md:text-lg">Back</span>
              </div>
            }
          />
        )}
        {adminAction && inputs && subIndustryValue && industryValue && (
          <div className="mt-4 md:mt-6 px-1 flex flex-col items-end w-full">
            <div className="text-lg md:text-xl mb-3 font-semibold text-black">Questions</div>
            {inputs.map((input, index) => (
              <div className="flex gap-3 w-full" key={input.id}>
                <Input
                  type="text"
                  value={input.value}
                  onChange={(e) => handleInputChange(input.id, e.target.value)}
                  placeholder={`Question ${index + 1}`}
                  style={{ display: "block", marginBottom: "8px" }}
                />
                <Button
                  onClick={() => {
                    deleteInput(input.id);
                  }}
                  className="hover:bg-primary"
                >
                  <FaMinus />
                </Button>
              </div>
            ))}
            <Button onClick={addInput} className="hover:bg-primary mb-2 !w-40 ml-auto">
              <FaPlus />
            </Button>
            <div className="flex gap-4 ml-auto">
              <Button onClick={updateQuestion} className="min-w-40 hover:bg-[#53ABDC] bg-[#53ABDC]">
                Submit
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Add Industry Modal */}
      <Dialog open={openAddIndustry}>
        <DialogContent overlayOnClick={() => setOpenAddIndustry(false)}>
          <DialogHeader>
            <DialogTitle>Add Industry</DialogTitle>
            <DialogClose
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
              onClick={() => {
                setOpenAddIndustry(false);
              }}
            >
              <Cross2Icon className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          <Input
            placeholder="Industry name"
            onChange={(e) => {
              setindustry(e.target.value);
            }}
          />
          <Button
            className="hover:bg-primary"
            onClick={() => {
              const body = {
                category: industry,
              };
              addIndustry(body);
            }}
          >
            Submit
          </Button>
        </DialogContent>
      </Dialog>

      {/* Add Sub Industry Modal */}
      <Dialog open={openAddSubIndustry}>
        <DialogContent overlayOnClick={() => setOpenAddSubIndustry(false)}>
          <DialogHeader>
            <DialogTitle>Add Sub Industry</DialogTitle>
            <DialogClose
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
              onClick={() => {
                setOpenAddSubIndustry(false);
              }}
            >
              <Cross2Icon className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          <Input
            placeholder="Sub Industry name"
            onChange={(e) => {
              setsubIndustry(e.target.value);
            }}
          />
          <Button
            className="hover:bg-primary"
            onClick={() => {
              const body: ISubcategory = {
                category: industryValue,
                subcategory: subIndustry,
              };
              addSubCategory(body);
            }}
          >
            Submit
          </Button>
        </DialogContent>
      </Dialog>

      {/* Delete Industry confirm alert */}
      <AlertDialog open={industryAlert.open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Industry <b>{industryAlert.data.category}</b> will be deleted. You will lose all the data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() =>
                setIndustryAlert({
                  open: false,
                  data: { categoryID: "", category: "" },
                })
              }
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-700"
              onClick={() => deleteIndustry(industryAlert.data)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Sub-Industry confirm alert */}
      <AlertDialog open={subIndustryAlert.open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              SubIndustry <b>{subIndustryAlert.data.subcategory}</b> will be deleted. You will lose all the data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() =>
                setSubIndustryAlert({
                  open: false,
                  data: { category: "", subcategory: "" },
                })
              }
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-700"
              onClick={() => deleteSubIndustry(subIndustryAlert.data)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ChooseIndustryTemplate;
