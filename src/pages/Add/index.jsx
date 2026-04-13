import { useEffect, useState } from "react";
import { auth, db } from "../../config/firebase.js";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  addDoc,
  setDoc,
  collection,
  doc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  limit,
} from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import {
  LuCirclePlus,
  LuCircleMinus,
  LuBookOpenText,
  LuTag,
  LuCalendarDays,
  LuCircleAlert,
  LuFlagTriangleRight,
} from "react-icons/lu";

import Toast from "../../components/Toast/index.jsx";
import Nav from "../../components/Nav/index.jsx";
import Footer from "../../components/Footer/index.jsx";
import books from "../../utils/shapes/books.jsx";
import difficulties from "../../utils/shapes/difficulties.js";
import emptyQuestion from "../../utils/shapes/emptyQuestion.js";
import timestampToDate from "../../utils/functions/questionTimestampToDate.js";
import { shuffle } from "../../utils/functions/shuffle.js";

function QuestionAdd() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [question, setQuestion] = useState(emptyQuestion);
  const [questionsList, setQuestionsList] = useState([]);
  const [addQuestionToggle, setAddQuestionToggle] = useState(false);
  const [message, setMessage] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    const q = query(
      collection(db, "questions"),
      orderBy("createdAt", "desc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      const fetchedQuestions = [];

      QuerySnapshot.forEach((doc) => {
        fetchedQuestions.push({ ...doc.data(), id: doc.id });
      });
    });

    return () => unsubscribe;
  }, []);

  async function sendQuestion(e) {
    e.preventDefault();

    let questionAlreadyExists = 0;

    questionsList.forEach((q) => {
      if (q.entitled === question.entitled) {
        questionAlreadyExists++;
      }
    });

    if (
      question.entitled === "" ||
      question.answer1 === "" ||
      question.answer2 === "" ||
      question.answer3 === "" ||
      question.answer4 === "" ||
      question.books ||
      question.difficulty
    ) {
      setMessage("empty_field");
      return;
    }

    if (questionAlreadyExists === 0) {
      const answersArray = [
        question?.answer1,
        question?.answer2,
        question?.answer3,
        question?.answer4,
      ];

      const shuffledAnswersArray = shuffle(answersArray);

      const newQuestionRef = doc(collection(db, "questions"));

      const newQuestionObject = {
        answer: shuffledAnswersArray.indexOf(question?.answer1),
        author: user?.uid,
        books: question?.books,
        choices: shuffledAnswersArray,
        createdAt: new Date(),
        difficulty: question?.difficulty,
        entitled: question?.entitled,
        explanation: question?.explanation,
        id: newQuestionRef.id,
        tags: tags.split(","),
        updatedAt: null,
      };

      await setDoc(newQuestionRef, newQuestionObject);

      setTags("");
      setQuestion(emptyQuestion);
      setMessage("question_created");
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    } else {
      setMessage("already_exists");
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }

  async function deleteQuestion(id) {
    await deleteDoc(doc(db, "questions", id));

    setQuestionsList(questionsList.filter((q) => q.id !== id));
  }

  useEffect(() => {
    if (message === "question_created") {
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  }, [message]);

  if (!user) return navigate("/");

  return (
    <div className="w-full h-full bg-gradient-to-r from-[#4A6DA7] to-[#a0b4d5]">
      <Nav />
      <div className="container mx-auto max-w-[768px] py-24">
        <h1 className="text-[#fff] text-center text-5xl py-8">Ajout</h1>
        {message === "already_exists" && (
          <Toast type="error" title="Cette question existe déjà" />
        )}
        {message === "empty_field" && (
          <Toast type="error" title="Un champ obligatoire est vide" />
        )}
        {message === "question_created" && (
          <Toast type="success" title="La question a bien été créée" />
        )}
        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={(e) => sendQuestion(e)}
        >
          <div
            className="flex justify-start items-center"
            onClick={() => setAddQuestionToggle(!addQuestionToggle)}
          >
            <h3 className="text-[#4A6DA7] text-center text-2xl cursor-pointer">
              Ajouter une question
            </h3>
            {!addQuestionToggle ? (
              <LuCirclePlus className="ml-2" />
            ) : (
              <LuCircleMinus className="ml-2" />
            )}
          </div>
          {addQuestionToggle && (
            <div className="pt-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="entitled"
              >
                Intitulé*
              </label>
              <input
                className="mb-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="entitled"
                type="text"
                placeholder="Quel animal adressa la parole à Eve ?"
                onChange={(e) =>
                  setQuestion({ ...question, entitled: e.target.value })
                }
                value={question?.entitled}
              />
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="answer1"
              >
                Bonne réponse*
              </label>
              <input
                className="mb-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:mb-4 -outline"
                id="answer1"
                type="answer1"
                placeholder="Un serpent"
                onChange={(e) =>
                  setQuestion({
                    ...question,
                    answer1: e.target.value,
                  })
                }
                value={question?.answer1}
              />
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="answer2"
              >
                Réponse 2*
              </label>
              <input
                className="mb-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="answer2"
                type="answer2"
                placeholder="Un oiseau"
                onChange={(e) =>
                  setQuestion({
                    ...question,
                    answer2: e.target.value,
                  })
                }
                value={question?.answer2}
              />
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="answer3"
              >
                Réponse 3*
              </label>
              <input
                className="mb-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="answer3"
                type="answer3"
                placeholder="Un lion"
                onChange={(e) =>
                  setQuestion({
                    ...question,
                    answer3: e.target.value,
                  })
                }
                value={question?.answer3}
              />
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="answer4"
              >
                Réponse 4*
              </label>
              <input
                className="mb-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="answer4"
                type="answer4"
                placeholder="Un agneau"
                onChange={(e) =>
                  setQuestion({
                    ...question,
                    answer4: e.target.value,
                  })
                }
                value={question?.answer4}
              />
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="explanation"
              >
                Explication
              </label>
              <input
                className="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="explanation"
                type="explanation"
                placeholder="Le diable a pris l'apparence d'un serpent pour parler à Eve"
                onChange={(e) =>
                  setQuestion({ ...question, explanation: e.target.value })
                }
                value={question?.explanation}
              />
              <label
                className="block text-gray-700 text-sm font-bold mb-2 mt-2"
                htmlFor="difficulty"
              >
                Difficulté*
              </label>
              <select
                onChange={(e) =>
                  setQuestion({ ...question, difficulty: e.target.value })
                }
                value={question?.difficulty}
                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              >
                {difficulties?.map((difficulty) => (
                  <option key={difficulty.slug}>{difficulty.name}</option>
                ))}
              </select>
              <label
                className="block text-gray-700 text-sm font-bold mb-2 mt-2"
                htmlFor="books"
              >
                Livre*
              </label>
              <select
                onChange={(e) =>
                  setQuestion({ ...question, books: e.target.value })
                }
                value={question?.books}
                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              >
                {books?.map((book) => (
                  <option key={book.slug} name={book.slug}>
                    {book.name}
                  </option>
                ))}
              </select>
              <label
                className="block text-gray-700 text-sm font-bold mb-2 mt-2"
                htmlFor="tags"
              >
                Tags
              </label>
              <input
                className="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="tags"
                type="tags"
                placeholder="abraham,isaac,rebecca"
                onChange={(e) => setTags(e.target.value)}
                value={tags}
              />
              <p>* champs obligatoires</p>
              <div className="flex items-center justify-between">
                <button
                  className="bg-[#4A6DA7] mt-2 hover:opacity-50 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Ajouter
                </button>
              </div>
            </div>
          )}
        </form>
        <div className="grid-cols-2 grid gap-2">
          {questionsList.map((question) => (
            <div
              key={question?.id}
              className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            >
              <p className="font-bold text-2xl">{question?.entitled}</p>
              <p className="text-green-500 font-bold">{question?.choices[0]}</p>
              <p>{question?.choices[1]}</p>
              <p>{question?.choices[2]}</p>
              <p>{question?.choices[3]}</p>
              <div className="flex items-baseline">
                <LuCircleAlert className="mr-1" />
                <p>{question?.explanation}</p>
              </div>
              <div className="flex items-center">
                <LuFlagTriangleRight className="mr-1" />
                <p>{question?.difficulty}</p>
              </div>
              <div className="flex items-center">
                <LuBookOpenText className="mr-1" />
                <p>{question?.books}</p>
              </div>
              <div className="flex items-center">
                <LuTag className="mr-1" />
                <p>{question?.tags}</p>
              </div>
              <div className="flex items-center">
                <LuCalendarDays className="mr-1" />
                <p>
                  Question créée le
                  {timestampToDate(question?.createdAt?.seconds)}
                </p>
              </div>
              <br />
              <button className="bg-[#4A6DA7] hover:opacity-50 text-white font-bold my-1 py-2 px-4">
                <Link to={`/update/question/${question?.id}`}>Modifier</Link>
              </button>
              <button
                onClick={() => deleteQuestion(question?.id)}
                className="bg-[#4A6DA7] hover:opacity-50 text-white font-bold my-1 py-2 px-4"
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default QuestionAdd;
