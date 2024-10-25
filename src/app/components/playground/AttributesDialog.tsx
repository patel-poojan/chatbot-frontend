import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useRef, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { FaPlus } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import { RiDeleteBinLine } from "react-icons/ri";

interface AttributesDialogProps {
  attributesHandler: () => void;
}

const AttributesDialog: React.FC<AttributesDialogProps> = ({
  attributesHandler,
}) => {
  const [tab, setTab] = useState(0);
  const [title, setTitle] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const titleInputRef = useRef<HTMLInputElement>(null);
  const attributeList = [
    { title: "Title1", value: "value1" },
    { title: "Title2", value: "value2" },
    { title: "Title3", value: "value3" },
  ];

  useEffect(() => {
    if (tab === 0) {
      setTitle("");
      setValue("");
    }
  }, [tab]);

  const handleSave = () => {
    console.log("Saved value:", title, value);
    // Implement save logic
  };
  const handleEditClick = () => {
    titleInputRef.current?.focus();
  };
  return (
    <div
      className="absolute md:right-6 top-32 min-[699px]:top-20 px-4 pb-4 sm:px-6 sm:pb-4 pt-2 sm:pt-3 w-[-webkit-fill-available]  bg-[#F8F8F8] md:w-[600px] min-[870px]:w-[700px] h-auto md:h-[70vh] mx-6 md:mx-0 rounded-lg overflow-hidden"
      style={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" }}
    >
      <div className="flex items-center justify-between mb-1 md:mb-3 ">
        <div> </div>
        <div className="text-primary font-medium text-lg">Attributes</div>
        <IoCloseOutline
          className="text-2xl cursor-pointer  "
          onClick={() => attributesHandler()}
          aria-label="Close dialog"
        />
      </div>

      <div className="flex md:flex-row flex-col gap-4 md:gap-3 mt-0 md:mt-4 ">
        <div className="w-full md:w-4/6 ">
          {tab === 0 ? (
            <div className="flex flex-col gap-3 md:gap-4">
              <div className="w-full">
                <label
                  htmlFor="title"
                  className="text-black font-normal text-lg"
                >
                  Title
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Add title"
                  className="mt-2 p-5 text-[#1E255EB2] bg-white flex-1 border-[#EFEFEF] rounded focus-visible:ring-0 placeholder:text-sm w-full"
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="value"
                  className="text-black font-normal text-lg"
                >
                  Value
                </label>
                <Input
                  id="value"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Add value"
                  className="mt-2 p-5 text-[#1E255EB2] bg-white flex-1 border-[#EFEFEF] rounded focus-visible:ring-0 placeholder:text-sm w-full"
                />
              </div>
              <Button
                className="w-fit text-white bg-gradient-to-r from-[#58C8DD] to-[#53A7DD] py-3 rounded hover:from-[#53A7DD] hover:to-[#58C8DD]"
                onClick={handleSave}
              >
                Save value
              </Button>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between">
                <Input
                  id="title"
                  value={title}
                  ref={titleInputRef}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Add title"
                  className="p-0 max-w-[200px] !shadow-none text-primary font-medium text-lg bg-transparent !w-fit border-none rounded focus-visible:px-2 placeholder:text-sm"
                />
                <div className="flex gap-2 items-center">
                  <div
                    className="bg-white p-2 rounded cursor-pointer flex items-center gap-1"
                    onClick={handleEditClick}
                  >
                    <BiEditAlt />
                    <span className="text-sm hidden md:block font-normal text-primary">
                      Rename
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded cursor-pointer flex items-center gap-1">
                    <RiDeleteBinLine className="text-[#FF0000]" />
                    <span className="text-sm hidden md:block font-normal text-[#FF0000]">
                      Delete
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-full mt-4">
                <label
                  htmlFor="value"
                  className="text-black font-normal text-lg"
                >
                  Value
                </label>
                <Input
                  id="value"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Add value"
                  className="mt-2 p-5 text-[#1E255EB2] bg-white flex-1 border-[#EFEFEF] rounded focus-visible:ring-0 placeholder:text-sm w-full"
                />
              </div>
            </div>
          )}
        </div>

        <div
          className="w-full md:w-2/6 h-auto md:h-[55vh] p-5 bg-white rounded-xl flex flex-col gap-4"
          style={{ boxShadow: "1px 0px 8px 2px #00000014" }}
        >
          <div className="flex flex-col gap-3">
            {attributeList.map((item, index) => (
              <span
                key={index}
                onClick={() => {
                  setTab(1);
                  setTitle(item.title);
                  setValue(item.value);
                }}
                className="text-primary cursor-pointer font-normal text-sm"
              >
                {item.title}
              </span>
            ))}
            <div
              className="flex items-center cursor-pointer gap-2"
              onClick={() => setTab(0)}
            >
              <FaPlus className="text-[#7A7A7A]" />
              <span className="text-[#7A7A7A] font-normal text-sm">
                Add new
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttributesDialog;
