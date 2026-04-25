import { Link } from "react-router-dom";

import Nav from "../../components/Nav";
import ErrorContent from "../../components/ErrorContent";
import Footer from "../../components/Footer";

function Error() {
  return (
    <div>
      <Nav />
      <ErrorContent />
      <Footer />
    </div>
  );
}

export default Error;
