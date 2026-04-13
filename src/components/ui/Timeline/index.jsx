/* eslint-disable react/prop-types */
const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl bg-white p-12 text-sm leading-7 text-gray-700 shadow-black/5 dark:bg-gray-950 dark:text-gray-300 dark:shadow-white/5 ${className}`}
  >
    {children}
  </div>
);
const Badge = ({ children, className = "" }) => (
  <span
    className={`inline-flex items-center rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-medium text-sky-800 dark:bg-sky-900/30 dark:[#4A6DA7] ${className}`}
  >
    {children}
  </span>
);
const defaultTimelineData = [
  {
    id: "1.0.1",
    title: "Deuxième Version",
    company: "JWQuiz",
    date: "Septembre 2025",
    description: "Deuxième version stable du site",
  },
  {
    id: "1.0.0",
    title: "Première Version",
    company: "JWQuiz",
    date: "Septembre 2025",
    description: "Première version stable du site",
  },
];
export default function Timeline({
  data = defaultTimelineData,
  className = "",
}) {
  return (
    <div
      className={`relative grid min-h-screen grid-cols-[1fr_2.5rem_auto_2.5rem_1fr] grid-rows-[0fr_1px_auto_1px_0fr] bg-white [--pattern-fg:rgb(3_7_18_/_0.05)] dark:bg-gray-950 dark:[--pattern-fg:rgb(255_255_255_/_0.1)] ${className}`}
    >
      <div className="col-start-3 row-start-3 flex max-w-2xl flex-col p-2 dark:bg-white/10">
        <Card>
          <div className="space-y-10">
            {data.map((item, index) => (
              <div
                key={item.id}
                className="relative group transition-all duration-300 hover:translate-x-1"
              >
                {index !== data.length - 1 && (
                  <div className="absolute left-3 top-8 h-full w-0.5 bg-gradient-to-b from-black via-gray-400 to-white opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                )}
                <div className="flex gap-6">
                  <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#4A6DA7] to-sky-600 mt-1 group-hover:scale-110 transition-transform duration-300">
                    <div className="h-2.5 w-2.5 rounded-full bg-white" />
                  </div>
                  <div className="flex-1 space-y-3 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg text-gray-950 dark:text-white group-hover:[#4A6DA7] dark:group-hover:[#4A6DA7] transition-colors duration-300">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <p className="text-sky-600 dark:text-[#4A6DA7] font-medium">
                          {item.company}
                        </p>
                        <Badge>{item.date}</Badge>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed group-hover:bg-gray-50 dark:group-hover:bg-gray-800/30 rounded-lg p-3 -m-3 transition-all duration-300">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
