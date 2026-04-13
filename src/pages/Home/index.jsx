import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import HomeLanding from "../../components/HomeLanding";
import HomeConnect from "../../components/HomeConnect";
import HomeCount from "../../components/HomeCount";
import HomeScroller from "../../components/HomeScroller";

function Home() {
  return (
    <div className="w-full">
      <Nav />
      <HomeLanding />
      <HomeConnect />
      <HomeScroller />
      <HomeCount />
      <Footer />
    </div>
  );
}

export default Home;
