import { app } from "../../config/firebase";
import { useParams } from "react-router-dom";
import Nav from "../../components/Nav";
import ProfileInfos from "../../components/ProfileInfos";
import MeInfos from "../../components/MeInfos";
import Footer from "../../components/Footer";

export default function Profile() {
  let params = useParams();
  return (
    <>
      <Nav />
      {params.id ? (
        <ProfileInfos firebaseApp={app} paramId={params.id} />
      ) : (
        <MeInfos firebaseApp={app} />
      )}
      <Footer />
    </>
  );
}
