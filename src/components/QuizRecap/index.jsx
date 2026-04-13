/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { LuBadgeCheck, LuBadgeX } from "react-icons/lu";
import { IoReturnDownBack } from "react-icons/io5";

import Button from "../components/ui/Button";
import awful from "../../assets/awful.gif";
import notgood from "../../assets/notgood.gif";
import good from "../../assets/good.gif";
import verygood from "../../assets/verygood.gif";
import perfect from "../../assets/perfect.gif";

function QuizRecap({ answers, questions }) {
  function changeImageSrc(ratio) {
    if (ratio < 20) {
      return <img src={awful} className="w-32 h-32" />;
    }

    if (ratio >= 20 && ratio < 50) {
      return <img src={notgood} className="w-32 h-32" />;
    }

    if (ratio >= 50 && ratio < 70) {
      return <img src={good} className="w-32 h-32" />;
    }

    if (ratio >= 70 && ratio < 100) {
      return <img src={verygood} className="w-32 h-32" />;
    }

    if (ratio === 100) {
      return <img src={perfect} className="w-32 h-32" />;
    }
  }

  return (
    <div>
      <h2 className="text-[#fff] text-5xl text-center py-8">Récapitulatif</h2>
      <div className="gif flex justify-center my-8">
        {changeImageSrc(
          (answers.filter((answer) => answer.result === "correct").length /
            answers.length) *
            100,
        )}
      </div>
      <div className="flex justify-center mb-8">
        <div className="text-4xl flex items-center mr-2">
          <span className="font-bold text-[#33FF57] mr-1">
            {answers.filter((answer) => answer.result === "correct").length}
          </span>
          <LuBadgeCheck color="#33FF57" />
        </div>
        <div className="text-4xl flex items-center">
          <span className="font-bold text-[#FF5733] mr-1">
            {answers.filter((answer) => answer.result === "incorrect").length}
          </span>
          <LuBadgeX color="#FF5733" />
        </div>
      </div>
      {questions?.map((question, index) => (
        <div key={question?.id} className="flex items-center">
          <span className="text-white mr-2">
            {index + 1}. {question?.entitled}
          </span>
          {answers[index].result === "correct" ? (
            <span className="flex items-center text-white font-bold">
              <p>{question.choices[question.answer]}</p>
              <LuBadgeCheck color="#33FF57" className="ml-1" />
            </span>
          ) : (
            <div className="flex items-center text-white font-bold">
              <span className="flex items-center mr-1">
                {answers[index].chosenAnswer}
                <LuBadgeX color="#FF5733" className="ml-1" />
              </span>
              <span className="flex items-center">
                {question?.choices[question?.answer]}
                <LuBadgeCheck color="#33FF57" className="ml-1" />
              </span>
            </div>
          )}
        </div>
      ))}
      <div className="mt-8 flex justify-center">
        <Button variant="secondary" iconRight={<IoReturnDownBack />}>
          Retourner à l'accueil
        </Button>
      </div>
    </div>
  );
}

export default QuizRecap;
