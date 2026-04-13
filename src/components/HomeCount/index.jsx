import { useEffect, useState } from "react";
import { collection, getCountFromServer } from "firebase/firestore";
import { db } from "../../config/firebase";
import NumberTicker from "../ui/NumberTicker";
import { AuroraText } from "../ui/AuroraText";

function HomeCount() {
  const [questionsNumber, setQuestionsNumber] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const coll = collection(db, "questions");
      const snapshot = await getCountFromServer(coll);
      setQuestionsNumber(snapshot.data().count);
    }
    fetchData();
  }, []);

  return (
    <div className="text-center p-32">
      <AuroraText speed={1} colors={["#4A6DA7", "#a0b4d5"]}>
        <NumberTicker
          value={questionsNumber}
          duration={2500}
          decimalPlaces={0}
        />
      </AuroraText>
      <p className="text-[#111827]">
        questions sont actuellement disponibles sur le site
      </p>
    </div>
  );
}

export default HomeCount;
