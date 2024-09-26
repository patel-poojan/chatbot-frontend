export const Loader = () => {
  return (
    <div className="bg-blur bg-[#a6dae41a] fixed inset-0 z-50 flex items-center justify-center  backdrop-blur-[3px]">
      <div role="status">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#3bc5dd] rounded-full animate-spin"></div>
      </div>
    </div>
  );
};
