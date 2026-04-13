/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import classnames from "classnames";
import useSound from "use-sound";

import Button from "../ui/Button";
import { LuArrowLeft, LuArrowRight, LuEye } from "react-icons/lu";
import correctAnswerSound from "../../utils/sounds/correct.mp3";
import incorrectAnswerSound from "../../utils/sounds/incorrect.mp3";

function QuizInterface({
  question,
  questionId,
  questions,
  goToPreviousQuestion,
  goToNextQuestion,
  goToRecap,
  setAnswers,
  answers,
}) {
  const notFirstQuestion = questionId > 0;
  const notLastQuestion =
    questionId < questions.length - 1 && questionId !== questions.length;
  const lastQuestion = questionId === questions.length - 1;
  const questionAnswered = answers[questionId];
  const questionAnsweredCorrectly = answers[questionId]?.result === "correct";
  const questionAnsweredIncorrectly =
    answers[questionId]?.result === "incorrect";

  const [playCorrectAnswer] = useSound(correctAnswerSound, {
    volume: 0.25,
  });
  const [playIncorrectAnswer] = useSound(incorrectAnswerSound, {
    volume: 0.25,
  });

  function selectChoice(value) {
    if (!answers[questionId]) {
      if (value === question?.choices[question?.answer]) {
        setAnswers([
          ...answers,
          {
            question: questionId,
            result: "correct",
            chosenAnswer: value,
            rightAnswer: question?.answer,
          },
        ]);
        playCorrectAnswer();
      } else {
        setAnswers([
          ...answers,
          {
            question: questionId,
            result: "incorrect",
            chosenAnswer: value,
            rightAnswer: question?.answer,
          },
        ]);
        playIncorrectAnswer();
      }
    }
  }

  return (
    <div className="sm:container m-auto">
      <p className="text-[#ffeecb] text-center font-bold">
        Question {questionId + 1}/{questions.length}
      </p>
      <h3 className="text-white text-3xl text-center py-8">
        {question?.entitled}
      </h3>
      <div className="grid-cols-2 grid gap-4 py-2">
        {question?.choices.map((value, index) => (
          <button
            key={index}
            className={classnames(
              "hover:opacity-50 font-bold p-12 col-span-2 md:col-span-1 mx-2 md:mx-0 rounded-md",
              { "cursor-not-allowed": questionAnswered },
              {
                "bg-green-600 text-white":
                  (questionAnsweredCorrectly &&
                    answers[questionId]?.chosenAnswer === value) ||
                  (questionAnsweredIncorrectly &&
                    question?.answer === index &&
                    answers[questionId]?.rightAnswer === index),
              },
              {
                "bg-red-600 text-white":
                  questionAnsweredIncorrectly &&
                  answers[questionId]?.chosenAnswer === value,
              },
              {
                "bg-white text-[#4A6DA7]":
                  !answers[questionId]?.result ||
                  (answers[questionId]?.result &&
                    answers[questionId]?.chosenAnswer !== value &&
                    answers[questionId]?.rightAnswer !== index),
              }
            )}
            onClick={() => selectChoice(value)}
          >
            {value}
          </button>
        ))}
      </div>
      <div className="pt-8">
        {notFirstQuestion && (
          <Button
            variant="secondary"
            iconLeft={<LuArrowLeft />}
            className="p-4 mr-4"
            onClick={goToPreviousQuestion}
          >
            Question précédente
          </Button>
        )}
        {notLastQuestion && (
          <Button
            variant="secondary"
            iconRight={<LuArrowRight />}
            className={classnames({
              "cursor-not-allowed opacity-50": !questionAnswered,
            })}
            onClick={goToNextQuestion}
          >
            Question suivante
          </Button>
        )}
        {lastQuestion && (
          <Button
            variant="secondary"
            iconRight={<LuEye />}
            className={classnames({
              "cursor-not-allowed opacity-50": !questionAnswered,
            })}
            onClick={goToRecap}
          >
            Voir le récapitulatif
          </Button>
        )}
      </div>
    </div>
  );
}

export default QuizInterface;
