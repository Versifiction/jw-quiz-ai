import { app } from "../../config/firebase";

import Nav from "../../components/Nav";
import HomeLanding from "../../components/HomeLanding";
import Footer from "../../components/Footer";

function Home() {
  return (
    <>
      <Nav />
      <HomeLanding firebaseApp={app} />
      <Footer />
    </>
  );
}

export default Home;
