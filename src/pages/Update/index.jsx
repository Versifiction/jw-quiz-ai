import { useEffect, useState } from "react";
import {
  collection,
  updateDoc,
  query,
  where,
  getDocs,
  doc,
} from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";

import Toast from "../../components/Toast";
import Nav from "../../components/Nav";
import { db } from "../../config/firebase";
import books from "../../utils/shapes/books.jsx";
import difficulties from "../../utils/shapes/difficulties";
import { shuffle } from "../../utils/functions/shuffle.js";

function QuestionUpdate() {
  const [question, setQuestion] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    async function getQuestion() {
      const q = query(collection(db, "questions"), where("id", "==", id));

      const querySnapshot = await getDocs(q);
      const fetchedQuestions = [];
      querySnapshot.forEach((doc) => {
        fetchedQuestions.push({ ...doc.data(), id: doc.id });
      });

      // fetchedQuestions.filter((q) => q.id == id);
      // fetchedQuestions[0].answer1 = fetchedQuestions[0].choices[0];
      // fetchedQuestions[0].answer2 = fetchedQuestions[0].choices[1];
      // fetchedQuestions[0].answer3 = fetchedQuestions[0].choices[2];
      // fetchedQuestions[0].answer4 = fetchedQuestions[0].choices[3];

      // fetchedQuestions.filter((q) => q.id == id);
      fetchedQuestions[0].answer1 =
        fetchedQuestions[0].choices[fetchedQuestions[0].answer];

      fetchedQuestions[0].choices = fetchedQuestions[0].choices.filter(
        (choice) =>
          choice !== fetchedQuestions[0].choices[fetchedQuestions[0].answer]
      );

      fetchedQuestions[0].answer2 = fetchedQuestions[0].choices[0];
      fetchedQuestions[0].answer3 = fetchedQuestions[0].choices[1];
      fetchedQuestions[0].answer4 = fetchedQuestions[0].choices[2];

      fetchedQuestions.filter((q) => q.id == id);

      setTags(fetchedQuestions[0].tags.toString());
      setQuestion(fetchedQuestions[0]);
    }

    getQuestion();
  }, []);

  async function updateQuestion(e) {
    e.preventDefault();

    const updatedQuestionRef = doc(db, "questions", id);

    if (
      question.entitled === "" ||
      question.answer1 === "" ||
      question.answer2 === "" ||
      question.answer3 === "" ||
      question.answer4 === ""
    ) {
      setMessage("empty_field");
    }

    const answersArray = [
      question?.answer1,
      question?.answer2,
      question?.answer3,
      question?.answer4,
    ];

    const shuffledAnswersArray = shuffle(answersArray);

    const updatedQuestionObject = {
      answer: shuffledAnswersArray.indexOf(question?.answer1),
      author: question?.author,
      books: question?.books,
      choices: shuffledAnswersArray,
      createdAt: question?.createdAt,
      difficulty: question?.difficulty,
      entitled: question?.entitled,
      explanation: question?.explanation,
      id: question?.id,
      tags: tags.split(","),
      updatedAt: new Date(),
    };
    console.log("up: ", updatedQuestionObject);
    await updateDoc(updatedQuestionRef, updatedQuestionObject);

    setMessage("question_updated");
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }

  if (!id) return navigate("/");

  return (
    <div className="w-full bg-gradient-to-r from-[#4A6DA7] to-[#a0b4d5]">
      <Nav />
      <div className="container mx-auto max-w-[768px]">
        <h1 className="text-[#fff] text-5xl font-bold text-center py-8">
          Editer une question
        </h1>
        {message === "empty_field" && (
          <Toast type="error" title="Un champ obligatoire est vide" />
        )}
        {message === "question_updated" && (
          <Toast type="success" title="La question a bien été éditée" />
        )}
        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={(e) => updateQuestion(e)}
        >
          <div className="">
            <div className="pt-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="entitled"
              >
                Intitulé
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
                Bonne réponse
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
                Réponse 2
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
                Réponse 3
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
                Réponse 4
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
                Difficulté
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
                htmlFor="book"
              >
                Livre
              </label>
              <select
                onChange={(e) =>
                  setQuestion({ ...question, book: e.target.value })
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
                placeholder="abraham isaac rebecca"
                onChange={(e) => setTags(e.target.value)}
                value={tags}
              />
              <div className="flex items-center justify-between">
                <button
                  className="bg-[#4A6DA7] mt-2 hover:opacity-50 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Editer
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default QuestionUpdate;
