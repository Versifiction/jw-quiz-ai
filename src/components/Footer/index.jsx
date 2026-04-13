import { Link } from "react-router-dom";

import jwLogo from "../../assets/jwquiz.png";

const Footer = () => {
  const footerLinks = {
    Informations: [
      { name: "Mentions légales", href: "/mentions" },
      { name: "À propos", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "FAQ", href: "/faq" },
    ],
  };

  return (
    <footer className="w-full bg-white dark:bg-black">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 container max-w-[768px]">
        <div className="grid grid-cols-2 gap-3 md:gap-8 py-10 max-sm:max-w-sm max-sm:mx-auto gap-y-8">
          <div className="col-span-2 sm:col-span-1">
            {/* <Link to="/">
              <img src={jwLogo} className="w-12" />
            </Link> */}
            <h1>BibleQuiz</h1>
            <p className="py-8 text-sm text-gray-500 dark:text-gray-400 lg:max-w-xs">
              Bienvenue sur BibleQuiz, site où vous pourrez tester vos
              connaissances sur la Bible
            </p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div
              key={title}
              className="lg:mx-auto text-left col-span-2 sm:col-span-1"
            >
              <h4 className="text-lg text-gray-900 dark:text-white font-medium mb-7 capitalize">
                {title}
              </h4>
              <ul className="text-sm transition-all duration-500">
                {links.map((link, index) => (
                  <li
                    key={index}
                    className={index === links.length - 1 ? "" : "mb-2"}
                  >
                    <Link
                      to={link.href}
                      className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="text-center text-gray-500 dark:text-gray-400 text-sm pt-6 my-6 border-t border-gray-200 dark:border-gray-700">
          <p>&copy; BIBLE QUIZ - {new Date().getFullYear()}</p>
          <p className="mt-1">
            Conçu et désigné avec le&nbsp;
            <span className="text-red-500">&hearts;</span> par MC
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
