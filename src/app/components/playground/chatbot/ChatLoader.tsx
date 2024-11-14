const ChatLoader = () => {
  return (
    <div className="flex justify-start bg-white w-fit rounded-lg p-2 my-2 ">
      <div className="flex space-x-1 items-center">
        <div className="w-2 h-2 bg-[#57C0DD] rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-[#57C0DD] rounded-full animate-bounce delay-100"></div>
        <div className="w-2 h-2 bg-[#57C0DD] rounded-full animate-bounce delay-200"></div>
      </div>
    </div>
  );
};

export default ChatLoader;
