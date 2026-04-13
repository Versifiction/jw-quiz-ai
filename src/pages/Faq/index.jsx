import Accordion from "../../components/Accordion";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";

function Faq() {
  return (
    <div className="w-full bg-gradient-to-r from-[#4A6DA7] to-[#a0b4d5]">
      <Nav />
      <div className="container mx-auto max-w-[768px]">
        <h2 className="text-[#fff] text-5xl text-center py-8">FAQ</h2>
      </div>
      <div className="my-8">
        <Accordion />
      </div>
      <Footer />
    </div>
  );
}

export default Faq;
