import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../config/firebase";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { MdAdminPanelSettings } from "react-icons/md";
import { LuLogOut } from "react-icons/lu";
import { TiUserDelete } from "react-icons/ti";

import useCollection from "../../utils/hooks/useCollection";
import Nav from "../../components/Nav";
import userTimestampToDate from "../../utils/functions/userTimestampToDate";
import Button from "../../components/ui/Button";
import DeleteAccountModal from "../../components/Modals/deleteAccountModal";

function Me() {
  const [user] = useAuthState(auth);
  const [signOut, loading, error] = useSignOut(auth);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const userIsSuperAdmin = user?.email === "mark.charpent@gmail.com";
  const { data: userDataFromDatabase } = useCollection(db, "users", [
    where("id", "==", user?.uid),
  ]);

  const logOutAndRedirect = async () => {
    const success = await signOut();
    if (success) navigate("/");
  };

  const deleteAccount = async () => {
    await deleteDoc(doc(db, "users", user?.uid));
    logOutAndRedirect();
  };

  useEffect(() => {
    console.log("user : ", user);
  }, [user]);

  // useEffect(() => {
  //   async function getUser() {
  //     const q = query(collection(db, "users"), where("id", "==", user?.uid));
  //     const querySnapshot = await getDocs(q);
  //     querySnapshot.forEach((doc) => {
  //       setUserDataFromDatabase(doc.data());
  //     });
  //   }

  //   getUser();
  // }, []);

  if (!user) return navigate("/");

  return (
    <div className="w-full bg-gradient-to-r from-[#4A6DA7] to-[#a0b4d5]">
      <Nav />
      <div className="container mx-auto max-w-[768px]">
        <h2 className="text-[#fff] text-5xl text-center py-8">Mon profil</h2>
        <div className="text-center">
          <div className="flex justify-center pt-2">
            <img
              src={user?.photoURL}
              className="rounded-full"
              referrerpolicy="no-referrer"
            />
          </div>
          <div className="mt-4">
            <p className="my-2 text-white">{user?.displayName}</p>
          </div>
          <div className="mt-4">
            <p className="my-2 text-white">
              Compte crée le&nbsp;
              {userDataFromDatabase && user
                ? userTimestampToDate(userDataFromDatabase?.createdAt.seconds)
                : "/"}
            </p>
            <p className="my-2 text-white">
              Dernière connexion le&nbsp;
              {userDataFromDatabase && user
                ? userTimestampToDate(userDataFromDatabase?.lastSeen.seconds)
                : "/"}
            </p>
          </div>
          {userIsSuperAdmin && (
            <div>
              <Link to="/admin">
                <Button
                  variant="secondary"
                  iconRight={<MdAdminPanelSettings />}
                  className="my-2 z-0"
                >
                  Aller à la page Admin
                </Button>
              </Link>
            </div>
          )}
          <div>
            <Button
              variant="secondary"
              iconRight={<LuLogOut />}
              className="my-2 z-0"
              onClick={logOutAndRedirect}
            >
              Se déconnecter
            </Button>
          </div>
          <div>
            <Button
              variant="destructive"
              iconRight={<TiUserDelete />}
              className="my-2 z-0"
              onClick={() => setModalOpen(true)}
            >
              Supprimer mon compte
            </Button>
          </div>
        </div>
        <DeleteAccountModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          deleteAccount={deleteAccount}
        />
      </div>
    </div>
  );
}

export default Me;
