/* eslint-disable react/prop-types */
function Tooltip({ children, text }) {
  return (
    <div className="relative group" aria-describedby="tooltip-id">
      {children}
      <div
        className="absolute right-[-100px] w-[200px] transform -translate-x-1/2 top-full mb-2 hidden group-hover:block bg-white text-[#4A6DA7] rounded my-2 py-1 px-2 z-10 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        role="tooltip"
        id="tooltip-id"
      >
        {text}
      </div>
    </div>
  );
}

export default Tooltip;
