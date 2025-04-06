import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ButtonInteractionDialog from "./ButtonInteractionDialog";
import { RiDeleteBinLine } from "react-icons/ri";
import UploadImage from "./UploadImage";
import { ResponseInfo, TypeResponseList } from "@/types/node";
import { Attribute } from "../AttributesDialog";
import { useEffect, useRef, useState } from "react";
import { MentionsInput, Mention } from "react-mentions";

const generateShortId = (title: string) => {
  const timestamp = Date.now();
  return `Chatbot${(timestamp & 0xffffff).toString(16)}${title}`;
};
export const TextNodeResponse = ({
  info,
  setResponseList,
  index,
  attributes,
}: {
  info: ResponseInfo;
  setResponseList: React.Dispatch<React.SetStateAction<TypeResponseList[]>>;
  index: number;
  attributes: Attribute[];
}) => {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<Attribute[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cursor, setCursor] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSelect = (item: string) => {
    const before = value.slice(0, cursor);
    const after = value.slice(cursor + 1); // skip @
    const rest = after.replace(/^\w*/, ""); // remove whatever was typed after @

    const newText = `${before}{{${item}}}${rest}`;
    setValue(newText);
    setShowSuggestions(false);
    textareaRef.current?.focus();
  };

  useEffect(() => {
    // keep value synced to parent
    setResponseList((prev) => {
      const newList = [...prev];
      newList[index].info.description = value;
      return newList;
    });
  }, [value]);

  return (
    <>
      {/* <Textarea
        value={info.description}
        onChange={(event) => {
          const val = event.target.value;
          setValue(val);

          const lastAt = val.lastIndexOf("@");
          const textAfterAt = val.slice(lastAt + 1);

          if (val[lastAt] === "@" && textAfterAt.length >= 0) {
            const filtered = attributes.filter((attr) => attr.name.startsWith(textAfterAt.toLowerCase()));
            setSuggestions(filtered);
            setShowSuggestions(true);
            setCursor(lastAt);
          } else {
            setShowSuggestions(false);
          }
          // setResponseList((prev) => {
          //   const newList = [...prev];
          //   newList[index].info.description = event.target.value;
          //   return newList;
          // });
        }}
        placeholder="Entre bot response"
        rows={3}
        maxLength={1024}
        className="resize-none w-10/12 border border-transparent bg-white p-3 rounded-md shadow-none focus:outline-none hover:border-[#57C0DD] focus-visible:ring-0 overflow-y-auto"
      /> */}
      <MentionsInput
        value={info.description}
        onChange={(event) => {
          const val = event.target.value;
          setValue(val);

          const lastAt = val.lastIndexOf("@");
          const textAfterAt = val.slice(lastAt + 1);

          if (val[lastAt] === "@" && textAfterAt.length >= 0) {
            const filtered = attributes.filter((attr) => attr.name.startsWith(textAfterAt.toLowerCase()));
            setSuggestions(filtered);
            setShowSuggestions(true);
            setCursor(lastAt);
          } else {
            setShowSuggestions(false);
          }
          // setResponseList((prev) => {
          //   const newList = [...prev];
          //   newList[index].info.description = event.target.value;
          //   return newList;
          // });
        }}
        placeholder="Entre bot response"
        rows={3}
        className="resize-none w-10/12 border border-transparent bg-white p-3 rounded-md shadow-none focus:outline-none hover:border-[#57C0DD] focus-visible:ring-0 overflow-y-auto"
        style={{
          control: {
            fontSize: 16,
            fontWeight: "normal",
          },
          highlighter: {
            overflow: "hidden",
          },
          input: {
            margin: 0,
          },
        }}
      >
        <Mention
          trigger="@"
          data={attributes.map((a) => ({ id: a.name, display: a.name }))}
          markup="{{__id__}}"
          displayTransform={(id) => `{{${id}}}`}
          appendSpaceOnAdd
        />
      </MentionsInput>
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border shadow mt-1 w-48 rounded">
          {suggestions.map((s) => (
            <li key={s._id} onClick={() => handleSelect(s.name)} className="px-3 py-1 hover:bg-gray-100 cursor-pointer">
              {s.name}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export const ImageNodeResponse = ({
  info,
  setResponseList,
  index,
}: {
  info: ResponseInfo;
  setResponseList: React.Dispatch<React.SetStateAction<TypeResponseList[]>>;
  index: number;
}) => {
  return (
    <div className="w-8/12 h-64 rounded-md overflow-hidden">
      <UploadImage initialImage={info.file || ""} setResponseList={setResponseList} index={index} />
    </div>
  );
};

export const GalleryNodeResponse = ({
  info,
  setResponseList,
  index,
}: {
  info: ResponseInfo;
  setResponseList: React.Dispatch<React.SetStateAction<TypeResponseList[]>>;
  index: number;
}) => {
  const addNewButton = () => {
    setResponseList((prev) => {
      const prevList = [...prev];
      const currentButtons = prevList[index].info.button || [];

      prevList[index] = {
        ...prevList[index],
        info: {
          ...prevList[index].info,
          button: [
            ...currentButtons,
            {
              title: "button",
              type: "message",
              message: "message",
              id: generateShortId("gallery"),
            },
          ],
        },
      };

      return prevList;
    });
  };

  const handleDeleteButton = (buttonIndex: number) => {
    setResponseList((prev) => {
      const newList = [...prev];
      if (newList[index].info.button) {
        newList[index].info.button = newList[index].info.button.filter((_, i) => i !== buttonIndex);
      }
      return newList;
    });
  };

  return (
    <div className="w-8/12">
      <div className="h-52 rounded-t-md overflow-hidden">
        <UploadImage bg="bg-gray-200" initialImage={info.file || ""} setResponseList={setResponseList} index={index} />
      </div>

      <div>
        <div>
          <Input
            id="Title"
            value={info.title || ""}
            onChange={(event) => {
              setResponseList((prev) => {
                const newList = [...prev];
                newList[index].info.title = event.target.value;
                return newList;
              });
            }}
            className="px-4 py-3 bg-white shadow-none rounded-none border-transparent text-black focus:outline-none focus-visible:ring-0 hover:border-[#57C0DD] focus-visible:border-[#57C0DD] placeholder:text-base w-full"
            placeholder="Type card title"
          />
        </div>
        <div>
          <Textarea
            placeholder="Type card description"
            value={info.description || ""}
            onChange={(event) => {
              setResponseList((prev) => {
                const newList = [...prev];
                newList[index].info.description = event.target.value;
                return newList;
              });
            }}
            rows={2}
            maxLength={80}
            className="resize-none border-transparent bg-white p-3 rounded-md shadow-none focus:outline-none focus-visible:ring-0 hover:border-[#57C0DD] focus-visible:border-[#57C0DD] overflow-y-auto"
          />
        </div>
      </div>
      <div>
        {info?.button?.map((button, i) => (
          <div key={i} className="group relative">
            <ButtonInteractionDialog
              buttonList={info.button || []}
              setResponseList={setResponseList}
              index={i}
              responseIndex={index}
              trigger={
                <div className="text-[#57C0DD] py-2 border cursor-pointer bg-white border-b-0 border-s-0 border-r-0 mx-auto rounded-md text-center border-t">
                  {button.title}
                </div>
              }
            />
            {i !== 0 && (
              <div
                className="absolute top-1/2 -translate-y-1/2 right-[-12px] md:hidden md:group-hover:flex items-center justify-center bg-white rounded-full p-1 cursor-pointer shadow-md"
                onClick={() => handleDeleteButton(i)}
              >
                <RiDeleteBinLine className="text-red-500 h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        <div
          className="flex items-center text-sm justify-center mt-2 p-2 border border-dashed border-black text-black cursor-pointer"
          onClick={addNewButton}
        >
          <span>+</span>
          <span className="ml-2">Add Button</span>
        </div>
      </div>
    </div>
  );
};
export const ButtonNodeResponse = ({
  info,
  setResponseList,
  index,
}: {
  info: ResponseInfo;
  setResponseList: React.Dispatch<React.SetStateAction<TypeResponseList[]>>;
  index: number;
}) => {
  const addNewButton = () => {
    setResponseList((prev) => {
      const prevList = [...prev];
      const currentButtons = prevList[index].info.button || [];

      prevList[index] = {
        ...prevList[index],
        info: {
          ...prevList[index].info,
          button: [
            ...currentButtons,
            {
              title: "button",
              type: "message",
              message: "message",
              id: generateShortId("button"),
            },
          ],
        },
      };

      return prevList;
    });
  };

  const handleDeleteButton = (buttonIndex: number) => {
    setResponseList((prev) => {
      const newList = [...prev];
      if (newList[index].info.button) {
        newList[index].info.button = newList[index].info.button.filter((_, i) => i !== buttonIndex);
      }
      return newList;
    });
  };
  return (
    <div className="w-8/12">
      <div>
        <Textarea
          value={info.description || ""}
          onChange={(event) => {
            setResponseList((prev) => {
              const newList = [...prev];
              newList[index].info.description = event.target.value;
              return newList;
            });
          }}
          placeholder="Entre your message..."
          rows={4}
          maxLength={80}
          className="resize-none border border-transparent bg-white p-3 rounded-md shadow-none focus:outline-none focus-visible:ring-0 hover:border-[#57C0DD] focus-visible:border-[#57C0DD]  overflow-y-auto"
        />
      </div>
      {info?.button?.map((button, i) => (
        <div key={i} className="group relative">
          <ButtonInteractionDialog
            buttonList={info.button || []}
            setResponseList={setResponseList}
            index={i}
            responseIndex={index}
            trigger={
              <div className="text-[#57C0DD] py-2 rounded-md border cursor-pointer bg-white border-b-0 border-s-0 border-r-0 mx-auto text-center border-t">
                {button.title}
              </div>
            }
          />
          {i !== 0 && (
            <div
              className="absolute top-1/2 -translate-y-1/2 right-[-12px] md:hidden md:group-hover:flex items-center justify-center bg-white rounded-full p-1 cursor-pointer shadow-md"
              onClick={() => handleDeleteButton(i)}
            >
              <RiDeleteBinLine className="text-red-500 h-4 w-4" />
            </div>
          )}
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

export const QuickNodeResponse = ({
  info,
  setResponseList,
  index,
}: {
  info: ResponseInfo;
  setResponseList: React.Dispatch<React.SetStateAction<TypeResponseList[]>>;
  index: number;
}) => {
  const addNewButton = () => {
    setResponseList((prev) => {
      const prevList = [...prev];
      const currentButtons = prevList[index].info.button || [];

      prevList[index] = {
        ...prevList[index],
        info: {
          ...prevList[index].info,
          button: [
            ...currentButtons,
            {
              title: "button",
              type: "message",
              message: "message",
              id: generateShortId("button"),
            },
          ],
        },
      };

      return prevList;
    });
  };

  const handleDeleteButton = (buttonIndex: number) => {
    setResponseList((prev) => {
      const newList = [...prev];
      if (newList[index].info.button) {
        newList[index].info.button = newList[index].info.button.filter((_, i) => i !== buttonIndex);
      }
      return newList;
    });
  };

  return (
    <div className="flex flex-col gap-2 w-10/12">
      <Textarea
        value={info.description || ""}
        onChange={(event) => {
          setResponseList((prev) => {
            const newList = [...prev];
            newList[index].info.description = event.target.value;
            return newList;
          });
        }}
        placeholder="Enter Your message..."
        rows={3}
        className="resize-none border border-transparent bg-white p-3 rounded-md shadow-none focus:outline-none hover:border-[#57C0DD] focus-visible:ring-0 overflow-y-auto"
      />
      <div className="flex items-center flex-wrap gap-2">
        {info?.button?.map((button, i) => (
          <div key={i} className="group relative">
            <ButtonInteractionDialog
              buttonList={info.button || []}
              setResponseList={setResponseList}
              index={i}
              responseIndex={index}
              trigger={
                <div className="text-[#57C0DD] cursor-pointer py-1 px-4 border bg-white text-sm border-[#57C0DD] w-fit text-center rounded-[30px]">
                  {button.title}
                </div>
              }
            />
            {i !== 0 && (
              <div
                className="absolute top-1/2 -translate-y-1/2 right-[-12px] md:hidden md:group-hover:flex items-center justify-center bg-white rounded-full p-1 cursor-pointer shadow-md"
                onClick={() => handleDeleteButton(i)}
              >
                <RiDeleteBinLine className="text-red-500 h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        <div
          onClick={addNewButton}
          className="text-black cursor-pointer py-1 px-2 border text-sm border-black border-dashed w-fit text-center rounded-[30px]"
        >
          + Add button
        </div>
      </div>
    </div>
  );
};
