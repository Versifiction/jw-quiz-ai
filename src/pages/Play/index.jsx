import { Link } from "react-router-dom";
import useSound from "use-sound";

import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import Button from "../../components/ui/Button";
import { FaUserGroup, FaUser } from "react-icons/fa6";
import nextStepSound from "../../utils/sounds/next.wav";
import stepNotAvailable from "../../utils/sounds/not_available.wav";

function Play() {
  const [playNextStep] = useSound(nextStepSound, {
    volume: 0.25,
  });
  const [playNotAvailable] = useSound(stepNotAvailable, {
    volume: 0.25,
  });

  return (
    <div className="w-full bg-gradient-to-r from-[#4A6DA7] to-[#a0b4d5]">
      <Nav />
      <div className="container mx-auto max-w-[768px] py-32">
        <h2 className="text-[#fff] text-5xl text-center py-8">Jouer</h2>
        <div className="flex justify-center py-2">
          <Link to="/solo">
            <Button
              variant="secondary"
              iconRight={<FaUser />}
              onClick={() => playNextStep()}
            >
              Solo
            </Button>
          </Link>
        </div>
        <div className="flex justify-center py-2">
          <Button
            variant="secondary"
            iconRight={<FaUserGroup />}
            className="opacity-50"
            onClick={() => playNotAvailable()}
          >
            Multijoueur
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Play;
