import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { LuInfo, LuFileWarning } from "react-icons/lu";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../config/firebase";
import useSound from "use-sound";

import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import QuizInterface from "../../components/QuizInterface";
import QuizRecap from "../../components/QuizRecap";
import QuizSettings from "../../components/QuizSettings";
import { db } from "../../config/firebase";
import Tooltip from "../../components/Tooltip";
import CreateSuggestionModal from "../../components/Modals/createSuggestionModal";
import defaultSuggestion from "../../utils/shapes/defaultSuggestion";
import nextStepSound from "../../utils/sounds/next.wav";

function Solo() {
  const [message, setMessage] = useState("");
  const [quizStatus, setQuizStatus] = useState("not_started");
  const [currentQuestion, setCurrentQuestion] = useState();
  const [currentQuestionId, setCurrentQuestionId] = useState();
  const [answers, setAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [suggestion, setSuggestion] = useState(defaultSuggestion);
  const [user] = useAuthState(auth);
  const [playNextStep] = useSound(nextStepSound, {
    volume: 0.25,
  });

  useEffect(() => {
    async function getQuestions() {
      const questionsRef = collection(db, "questions");
      const questionsSnap = await getDocs(questionsRef);
      const questionsSnapArray = [];
      questionsSnap.forEach((doc) => {
        questionsSnapArray.push({ id: doc.id, ...doc.data() });
      });
      setQuestions(questionsSnapArray);
    }

    getQuestions();
  }, []);

  useEffect(() => {
    if (quizStatus === "started") {
      setCurrentQuestion(questions[0]);
      setCurrentQuestionId(0);
    }
  }, [quizStatus]);

  useEffect(() => {
    if (message === "suggestion_created") {
      setTimeout(() => {
        setMessage("");
        setModalOpen(false);
      }, 5000);
    }
  }, [message]);

  function startQuiz() {
    playNextStep();
    setQuizStatus("started");
  }

  function goToPreviousQuestion() {
    if (currentQuestionId > 0) {
      setCurrentQuestion(questions[currentQuestionId - 1]);
      setCurrentQuestionId((prevCount) => prevCount - 1);
    }
  }

  function goToNextQuestion() {
    if (answers[currentQuestionId]?.result) {
      if (currentQuestionId < questions.length - 1) {
        setCurrentQuestion(questions[currentQuestionId + 1]);
        setCurrentQuestionId((prevCount) => prevCount + 1);
      }
    }
  }

  function goToRecap() {
    if (answers[currentQuestionId]?.result) {
      if (currentQuestionId === questions.length - 1) {
        setQuizStatus("finished");
      }
    }
  }

  async function submitSuggestion(e) {
    e.preventDefault();

    if (suggestion.type === "" || suggestion.message === "") {
      setMessage("empty_field");
      return;
    }

    const newSuggestionRef = doc(collection(db, "suggestions"));

    const newSuggestionObject = {
      createdAt: new Date(),
      id: newSuggestionRef.id,
      handled: false,
      message: suggestion?.message,
      questionId: currentQuestion?.id,
      type: suggestion?.type,
      userId: user?.uid || null,
    };

    await setDoc(newSuggestionRef, newSuggestionObject);

    setSuggestion(defaultSuggestion);
    setMessage("suggestion_created");
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }

  return (
    <div className="w-full bg-gradient-to-r from-[#4A6DA7] to-[#a0b4d5]">
      <Nav />
      <div className="container mx-auto md:max-w-[768px] p-4 relative">
        {quizStatus === "started" && (
          <div className="absolute top-4 md:left-4 left-0">
            <LuFileWarning
              color="red"
              className="text-2xl cursor-pointer"
              onClick={() => setModalOpen(true)}
            />
          </div>
        )}
        <CreateSuggestionModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={submitSuggestion}
          suggestion={suggestion}
          setSuggestion={setSuggestion}
          submitSuggestion={submitSuggestion}
          message={message}
        />
        {quizStatus === "started" &&
          currentQuestion?.explanation !== "" &&
          answers[currentQuestionId] && (
            <div className="absolute top-4 md:right-4 right-0">
              <Tooltip text={currentQuestion?.explanation}>
                <LuInfo color="white" className="text-2xl cursor-pointer" />
              </Tooltip>
            </div>
          )}
        {quizStatus === "not_started" && (
          <>
            <h2 className="text-[#fff] text-5xl text-center py-8">Solo</h2>
            <QuizSettings />
            {/* <div className="flex justify-center py-2">
              <Button
                variant="secondary"
                iconRight={<LuGamepad2 />}
                onClick={startQuiz}
              >
                Commencer le quiz
              </Button>
            </div> */}
          </>
        )}
        {quizStatus === "started" && (
          <QuizInterface
            question={currentQuestion}
            questionId={currentQuestionId}
            questions={questions}
            goToPreviousQuestion={goToPreviousQuestion}
            goToNextQuestion={goToNextQuestion}
            goToRecap={goToRecap}
            setAnswers={setAnswers}
            answers={answers}
          />
        )}
        {quizStatus === "finished" && (
          <QuizRecap answers={answers} questions={questions} />
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Solo;
