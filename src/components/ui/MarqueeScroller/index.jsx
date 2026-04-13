/* eslint-disable react/prop-types */
import React from "react";

import books from "../../../utils/shapes/books.jsx";

const logos1 = books.map((book, index) => ({ id: index, component: book.jsx }));
const logos2 = books
  .map((book, index) => ({ id: index, component: book.jsx }))
  .reverse();

function Logomarquee() {
  React.useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      @keyframes marquee-move {
        to {
          transform: translateX(calc(-100cqw - var(--item-gap)));
        }
      }
    `;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);
  const Marquee = ({ logos, direction = "forwards" }) => {
    const numItems = logos.length;
    const speed = "25s";
    const itemWidth = "120px";
    const itemGap = "25px";
    return (
      <div
        className="max-w-full overflow-hidden"
        style={{
          "--speed": speed,
          "--numItems": numItems,
          "--item-width": itemWidth,
          "--item-gap": itemGap,
          "--direction": direction,
          maskImage:
            "linear-gradient(to right, transparent, black 2rem, black calc(100% - 2rem), transparent)",
        }}
      >
        <div
          className="w-max flex"
          style={{
            "--track-width": `calc(var(--item-width) * ${numItems})`,
            "--track-gap": `calc(var(--item-gap) * ${numItems})`,
          }}
        >
          {[...logos, ...logos].map((logo, index) => (
            <div
              key={index}
              className="flex-shrink-0 flex justify-center items-center bg-white/10 border border-black text-white w-[120px] h-[120px]"
              style={{
                width: "var(--item-width)",
                aspectRatio: "1 / 1.2",
                marginRight: "var(--item-gap)",
                animation: `marquee-move var(--speed) linear infinite ${direction}`,
              }}
            >
              <div className="w-3/5 h-auto">{logo.component}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  return (
    <div className="items-center overflow-hidden">
      <div className="w-full flex flex-col gap-y-6">
        <Marquee logos={logos1} />
        <Marquee logos={logos2} direction="reverse" />
      </div>
    </div>
  );
}
export default Logomarquee;
