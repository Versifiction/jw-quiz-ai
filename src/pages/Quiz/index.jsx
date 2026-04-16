import { useParams } from "react-router";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { LuGamepad2 } from "react-icons/lu";
import Button from "../../components/ui/Button";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import renderQuizTypeAndName from "../../utils/shapes/renderQuizTypeAndName.jsx";

function Quiz() {
  const params = useParams();
  const location = useLocation();

  function startQuiz() {}

  return (
    <div>
      <Nav />
      <div className="w-full bg-gradient-to-r from-[#4A6DA7] to-[#a0b4d5] py-8">
        <h2 className="text-[#fff] text-5xl text-center py-8">Quiz</h2>
        <p className="text-white text-center py-8">
          Vous êtes sur le point de jouer à un quiz type
          <span className="mx-2">{renderQuizTypeAndName(params)}</span>
          sur {location?.state?.name || params?.name}
        </p>
        <div className="flex justify-center py-2">
          <Button
            variant="secondary"
            iconRight={<LuGamepad2 />}
            onClick={startQuiz}
          >
            Commencer le quiz
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Quiz;
