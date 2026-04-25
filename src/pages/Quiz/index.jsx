import { useLocation } from "react-router-dom";

import QuizBrowser from "../../components/QuizBrowser";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";

function Quiz() {
  const location = useLocation();

  return (
    <div>
      <Nav />
      <QuizBrowser />
      <Footer />
    </div>
  );
}

export default Quiz;
