import { auth } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, Link } from "react-router-dom";

import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import "./Admin.css";

function Admin() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  if (user?.email !== "mark.charpent@gmail.com") return navigate("/");

  return (
    <div className="w-full h-full bg-gradient-to-r from-[#4A6DA7] to-[#a0b4d5]">
      <Nav />
      <div className="container mx-auto max-w-[768px]">
        <h1 className="text-[#fff] text-center text-5xl py-8">Admin</h1>
        <div className="grid-cols-2 grid gap-4 py-2 mb-10">
          <Link
            to="/add"
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          >
            <h3 className="text-[#4A6DA7] text-center text-2xl cursor-pointer">
              Ajouter une question/un quiz
            </h3>
          </Link>
          <Link
            to="/questions"
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          >
            <h3 className="text-[#4A6DA7] text-center text-2xl cursor-pointer">
              Voir les questions
            </h3>
          </Link>
          <Link
            to="/users"
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          >
            <h3 className="text-[#4A6DA7] text-center text-2xl cursor-pointer">
              Voir les utilisateurs
            </h3>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Admin;
