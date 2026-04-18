import { app } from "../../config/firebase";

import Nav from "../../components/Nav";
import ProfileInfos from "../../components/ProfileInfos";
import Footer from "../../components/Footer";

export default function Profile() {
  return (
    <>
      <Nav />
      <ProfileInfos firebaseApp={app} />
      <Footer />
    </>
  );
}
