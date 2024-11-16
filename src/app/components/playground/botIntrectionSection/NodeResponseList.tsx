import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IoCameraSharp } from "react-icons/io5";
import ButtonInteractionDialog from "./ButtonInteractionDialog";
import { useState } from "react";
import { RiDeleteBinLine } from "react-icons/ri";

export const TextNodeResponse = () => {
  return (
    <Textarea
      placeholder="Entre bot response"
      rows={3}
      maxLength={1024}
      className="resize-none border border-transparent bg-white p-3 rounded-md shadow-sm focus:outline-none hover:border-[#57C0DD] focus-visible:ring-0 overflow-y-auto"
    />
  );
};

export const ImageNodeResponse = () => {
  return (
    <div className="w-9/12">
      <label className="flex items-center justify-between rounded-md bg-white text-black hover:text-white hover:bg-[#57C0DD] h-64 w-full  p-2 cursor-pointer">
        <input
          type="file"
          className="hidden"
          //  onChange={handleFileChange}
        />
        <div className="mx-auto  flex flex-col items-center justify-center">
          <IoCameraSharp className="text-2xl" />
          <span className="text-sm sm:text-base w-full text-center ">
            Browse
          </span>
        </div>
      </label>
    </div>
  );
};

export const GalleryNodeResponse = () => {
  const [buttonList, setButtonList] = useState<
    { title: string; type: string }[]
  >([{ title: "Button", type: "message" }]);

  const addNewButton = () => {
    setButtonList((prev) => [...prev, { title: "Button", type: "message" }]);
  };
  const handleDeleteButton = (index: number) => {
    setButtonList((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-8/12">
      <div>
        <label className="flex items-center justify-between rounded-md bg-gray-200 h-52 w-full  text-black hover:text-white hover:bg-[#57C0DD]  p-2 cursor-pointer">
          <input type="file" className="hidden" />
          <div className="mx-auto  flex flex-col items-center justify-center">
            <IoCameraSharp className="text-2xl" />
            <span className="text-sm sm:text-base w-full text-center ">
              Browse
            </span>
          </div>
        </label>
      </div>

      <div>
        <div>
          <Input
            id="Message"
            className="px-4 py-3 bg-white shadow-none rounded-none border-transparent text-black focus:outline-none focus-visible:ring-0 hover:border-[#57C0DD] focus-visible:border-[#57C0DD] placeholder:text-base w-full"
            placeholder="Type card title"
          />
        </div>
        <div>
          <Textarea
            placeholder="Type card description"
            rows={2}
            maxLength={80}
            className="resize-none border-transparent bg-white p-3 rounded-md shadow-sm focus:outline-none focus-visible:ring-0 hover:border-[#57C0DD] focus-visible:border-[#57C0DD] overflow-y-auto"
          />
        </div>
      </div>
      <div>
        {buttonList.map((button, index) => (
          <div key={index} className="group relative">
            <ButtonInteractionDialog
              buttonList={buttonList}
              setButtonList={setButtonList}
              index={index}
              trigger={
                <div className="text-[#57C0DD] py-2 border cursor-pointer bg-white border-b-0 border-s-0 border-r-0 mx-auto text-center border-t">
                  {button.title}
                </div>
              }
            />
            {index !== 0 ? (
              <div
                className="absolute top-1/2 -translate-y-1/2 right-[-12px] hidden group-hover:flex items-center justify-center bg-white rounded-full p-1 cursor-pointer shadow-md"
                onClick={() => handleDeleteButton(index)}
              >
                <RiDeleteBinLine className="text-red-500 h-4 w-4" />
              </div>
            ) : null}
          </div>
        ))}

        <div
          className="flex items-center text-sm justify-center mt-2 p-2 border border-dashed border-black text-black cursor-pointer"
          onClick={addNewButton}
        >
          <span>+</span>
          <span className="ml-2 ">Add Button</span>
        </div>
      </div>
    </div>
  );
};

export const ButtonNodeResponse = () => {
  const [buttonList, setButtonList] = useState<
    { title: string; type: string }[]
  >([{ title: "Button", type: "message" }]);
  const addNewButton = () => {
    setButtonList((prev) => [...prev, { title: "Button", type: "message" }]);
  };
  const handleDeleteButton = (index: number) => {
    setButtonList((prev) => prev.filter((_, i) => i !== index));
  };
  return (
    <div className="w-8/12">
      <div>
        <Textarea
          placeholder="Entre your message..."
          rows={4}
          maxLength={80}
          className="resize-none border border-transparent bg-white p-3 rounded-md shadow-sm focus:outline-none focus-visible:ring-0 hover:border-[#57C0DD] focus-visible:border-[#57C0DD]  overflow-y-auto"
        />
      </div>
      {buttonList.map((button, index) => (
        <div key={index} className="group relative">
          <ButtonInteractionDialog
            buttonList={buttonList}
            setButtonList={setButtonList}
            index={index}
            trigger={
              <div className="text-[#57C0DD] cursor-pointer py-2 border bg-white border-b-0 border-s-0 border-r-0 mx-auto text-center border-t ">
                {button.title}
              </div>
            }
          />
          {index !== 0 ? (
            <div
              className="absolute top-1/2 -translate-y-1/2 right-[-12px] hidden group-hover:flex items-center justify-center bg-white rounded-full p-1 cursor-pointer shadow-md"
              onClick={() => handleDeleteButton(index)}
            >
              <RiDeleteBinLine className="text-red-500 h-4 w-4" />
            </div>
          ) : null}
        </div>
      ))}
      <div
        className="flex items-center  justify-center mt-2 p-2 border border-dashed border-black text-sm text-black cursor-pointer"
        onClick={addNewButton}
      >
        <span>+</span>
        <span className="ml-2">Add Button</span>
      </div>
    </div>
  );
};

export const QuickNodeResponse = () => {
  const [buttonList, setButtonList] = useState<
    { title: string; type: string }[]
  >([{ title: "Button", type: "message" }]);

  const handleAddButton = () => {
    setButtonList((prev) => [...prev, { title: `Button`, type: "message" }]);
  };

  const handleDeleteButton = (index: number) => {
    setButtonList((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-2">
      <Textarea
        placeholder="Enter Your message..."
        rows={3}
        className="resize-none border border-transparent bg-white p-3 rounded-md shadow-sm focus:outline-none hover:border-[#57C0DD] focus-visible:ring-0 overflow-y-auto"
      />
      <div className="flex items-center flex-wrap gap-2">
        {buttonList.map((item, index) => (
          <div key={index} className="relative group">
            <ButtonInteractionDialog
              buttonList={buttonList}
              index={index}
              setButtonList={setButtonList}
              trigger={
                <div className="text-[#57C0DD] cursor-pointer py-1 px-4 border bg-white text-sm border-[#57C0DD] w-fit text-center rounded-[30px]">
                  {item.title}
                </div>
              }
            />
            {index !== 0 ? (
              <div
                className="absolute -top-3 -right-1 hidden group-hover:flex items-center justify-center bg-white rounded-full p-1 cursor-pointer"
                onClick={() => handleDeleteButton(index)}
              >
                <RiDeleteBinLine className="text-red-500 h-4 w-4" />
              </div>
            ) : (
              <></>
            )}
          </div>
        ))}

        <div
          onClick={handleAddButton}
          className="text-black cursor-pointer py-1 px-2 border text-sm border-black border-dashed w-fit text-center rounded-[30px]"
        >
          + Add button
        </div>
      </div>
    </div>
  );
};
