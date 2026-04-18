import { Link } from "react-router-dom";

import jwQuiz from "../../../assets/jwquiz.png";

function Logo({ width, height }) {
  return (
    <Link to="/" className="flex justify-center">
      <img src={jwQuiz} width={width || 60} height={height || 60} />
    </Link>
  );
}

export default Logo;
