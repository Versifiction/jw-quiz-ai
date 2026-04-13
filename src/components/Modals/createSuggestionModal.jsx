/* eslint-disable react/prop-types */
import Toast from "../Toast";
import Button from "../ui/Button";
import { LuSendHorizontal, LuX } from "react-icons/lu";

export default function CreateSuggestionModal({
  suggestion,
  setSuggestion,
  isOpen,
  onClose,
  children,
  submitSuggestion,
  message,
}) {
  const messageIsEmpty = message === "empty_field";
  const suggestionCreated = message === "suggestion_created";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
        <h1 className="text-[#4A6DA7] text-3xl text-center py-8">
          Rédiger une suggestion
        </h1>
        {messageIsEmpty && (
          <Toast type="error" title="Un champ obligatoire est vide" />
        )}
        {suggestionCreated && (
          <Toast type="success" title="La suggestion a bien été créée" />
        )}
        <label htmlFor="suggestion-type">Choisissez un motif* :</label>
        <select
          name="suggestions"
          id="suggestion-type"
          onChange={(e) =>
            setSuggestion({ ...suggestion, type: e.target.value })
          }
        >
          <option value="">--Motif--</option>
          <option value="spelling_issue">Problème d'orthographe</option>
          <option value="answer_issue">Problème avec la question</option>
          <option value="question_issue">Problème avec la réponse</option>
        </select>
        <label
          className="block text-gray-700 text-sm font-bold my-4"
          htmlFor="message"
        >
          Précisions*
        </label>
        <input
          className="mb-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="message"
          type="text"
          placeholder="L'intitulé de la question n'est pas correct"
          onChange={(e) =>
            setSuggestion({ ...suggestion, message: e.target.value })
          }
          value={suggestion?.message}
        />
        <p>* champs obligatoires</p>
        <Button
          variant="primary"
          iconRight={<LuSendHorizontal />}
          onClick={submitSuggestion}
          className="my-2 mr-2"
        >
          Soumettre
        </Button>
        <Button variant="outline" iconRight={<LuX />} onClick={onClose}>
          Annuler
        </Button>
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &#x2715;
        </button>

        {children}
      </div>
    </div>
  );
}
