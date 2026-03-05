import { useNavigate } from "react-router-dom";
import "./homepage.css";


function Homepage() {
const navigate = useNavigate();
function join(){
    navigate("/main")
}

  return (
    <div className="homepage">
      <button onClick={join} className="pixel-btn"> Join to learn </button>
    </div>
  );
}

export default Homepage;