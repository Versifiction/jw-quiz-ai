import { LuLoaderCircle } from "react-icons/lu";

function Loading() {
  return (
    <div className="w-full h-screen bg-[#07050F] relative">
      <div className="container h-screen mx-auto max-w-[768px]">
        <div className="text-[#09A472] h-screen font-bold flex justify-center items-center py-8">
          <LuLoaderCircle className="animate-spin text-6xl" />
        </div>
      </div>
    </div>
  );
}

export default Loading;
