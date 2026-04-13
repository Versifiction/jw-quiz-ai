import { LuLoaderCircle } from "react-icons/lu";

function Loading() {
  return (
    <div className="w-full h-screen bg-gradient-to-r from-[#4A6DA7] to-[#a0b4d5] relative">
      <div className="container h-screen mx-auto max-w-[768px]">
        <div className="text-[#fff] h-screen font-bold flex justify-center items-center py-8">
          <LuLoaderCircle className="animate-spin text-6xl" />
        </div>
      </div>
    </div>
  );
}

export default Loading;
