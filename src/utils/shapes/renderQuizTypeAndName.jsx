import { GlassBadge } from "../../components/ui/GlassBadge";
import { LiaUserSolid } from "react-icons/lia";
import { PiBooks } from "react-icons/pi";
import { FiSettings } from "react-icons/fi";

function renderQuizTypeAndName(params) {
  const { type } = params;
  return (
    <>
      {type === "difficulte" && (
        <GlassBadge className="text-rose-500">
          <span className="ml-1">{type}</span>&nbsp;
          <FiSettings />
        </GlassBadge>
      )}
      {type === "personnages" && (
        <GlassBadge className="text-purple-500">
          <span className="ml-1">{type}</span>&nbsp;
          <LiaUserSolid />
        </GlassBadge>
      )}
      {type === "livres" && (
        <GlassBadge className="text-orange-500">
          <span className="ml-1">{type}</span>&nbsp;
          <PiBooks />
        </GlassBadge>
      )}
    </>
  );
}

export default renderQuizTypeAndName;
