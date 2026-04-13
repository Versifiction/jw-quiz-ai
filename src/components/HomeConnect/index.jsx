import { MdNotificationsActive } from "react-icons/md";
import { FaSave } from "react-icons/fa";

function HomeConnect() {
  return (
    <div className="py-24">
      <h2 className="text-[#4A6DA7] text-center py-8 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
        Pourquoi me connecter ?
      </h2>
      <div className="container mx-auto max-w-[768px] py-8">
        <div className="flex justify-evenly items-center">
          <div className="flex items-center flex-col">
            <p className="text-center max-w-42">
              Sauvegarder mes quiz effectués
            </p>
            <br />
            <FaSave color="#4A6DA7" size={60} />
          </div>
          <div className="flex items-center flex-col">
            <p className="text-center max-w-42">
              Être notifié des nouveaux quiz postés (bientôt)
            </p>
            <br />
            <MdNotificationsActive color="#4A6DA7" size={60} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeConnect;
