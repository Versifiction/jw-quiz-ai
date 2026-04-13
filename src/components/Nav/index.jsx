import { useEffect } from "react";
import { auth, db } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Link } from "react-router-dom";
import { LuLogIn } from "react-icons/lu";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

import jwLogo from "../../assets/jwquiz.png";

function Nav() {
  const [user] = useAuthState(auth);

  useEffect(() => {
    async function addOrUpdateUserInDatabase() {
      if (user) {
        const userRef = doc(db, "users", user?.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          await updateDoc(userRef, {
            lastSeen: new Date(),
          });
        } else {
          await setDoc(userRef, {
            createdAt: new Date(),
            displayName: user?.displayName,
            email: user?.email,
            lastSeen: new Date(),
            photoUrl: user?.photoURL,
            id: user?.uid,
          });
        }
      }
    }

    addOrUpdateUserInDatabase();
  }, [user]);

  function googleSignIn() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  }

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-md flex flex-wrap items-center justify-between mx-auto p-4">
        {/* <h2 className="text-[#4A6DA7] font-bold text-3xl text-center py-2">
          <Link to="/">BibleQuiz</Link>
        </h2> */}
        <div>
          {/* <Link to="/">
            <img src={jwLogo} className="w-12" />
          </Link> */}
          <Link to="/">
            <h1>BibleQuiz</h1>
          </Link>
        </div>
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {user ? (
            <Link to="/me">
              <button
                type="button"
                className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                id="user-menu-button"
                aria-expanded="false"
                data-dropdown-toggle="user-dropdown"
                data-dropdown-placement="bottom"
              >
                <img
                  className="w-12 h-12 rounded-full"
                  src={user?.photoURL}
                  alt="user photo"
                />
              </button>
            </Link>
          ) : (
            <LuLogIn className="size-6 cursor-pointer" onClick={googleSignIn} />
          )}
        </div>
      </div>
    </nav>
  );
}

export default Nav;
