import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IoCameraSharp } from "react-icons/io5";
import ButtonInteractionDialog from "./ButtonInteractionDialog";

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
  return (
    <div className="w-8/12">
      <div>
        <label className="flex items-center justify-between rounded-md bg-gray-200 h-52 w-full  text-black hover:text-white hover:bg-[#57C0DD]  p-2 cursor-pointer">
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
      <div>
        <div>
          <Input
            // value={name}
            // onChange={(e) => setName(e.target.value)}
            id="Message"
            className="px-4 py-3 bg-white shadow-none rounded-none border-transparent  text-black  focus:outline-none focus-visible:ring-0 hover:border-[#57C0DD] focus-visible:border-[#57C0DD]  placeholder:text-base w-full"
            placeholder="Type card title"
          />
        </div>
        <div>
          <Textarea
            placeholder="Type card description"
            rows={2}
            maxLength={80}
            className="resize-none border-transparent bg-white p-3 rounded-md shadow-sm focus:outline-none focus-visible:ring-0 hover:border-[#57C0DD] focus-visible:border-[#57C0DD]   overflow-y-auto"
          />
        </div>
      </div>
      <ButtonInteractionDialog
        trigger={
          <div className="text-[#57C0DD] py-2 border cursor-pointer bg-white border-b-0 border-s-0 border-r-0 mx-auto text-center border-t ">
            Button
          </div>
        }
      />
    </div>
  );
};

export const ButtonNodeResponse = () => {
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
      <ButtonInteractionDialog
        trigger={
          <div className="text-[#57C0DD] cursor-pointer py-2 border bg-white border-b-0 border-s-0 border-r-0 mx-auto text-center border-t ">
            Button
          </div>
        }
      />
    </div>
  );
};

export const QuickNodeResponse = () => {
  return (
    <div className="flex flex-col gap-2">
      <Textarea
        placeholder="Entre Your message..."
        rows={3}
        // maxLength={1024}
        className="resize-none border border-transparent bg-white p-3 rounded-md shadow-sm focus:outline-none hover:border-[#57C0DD] focus-visible:ring-0 overflow-y-auto"
      />
      <ButtonInteractionDialog
        trigger={
          <div className="text-[#57C0DD] cursor-pointer py-1 px-3 border bg-white text-sm border-[#57C0DD]  w-fit text-center rounded-[30px] ">
            Button
          </div>
        }
      />
    </div>
  );
};
