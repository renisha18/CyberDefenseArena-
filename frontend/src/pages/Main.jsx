import "./homepage.css"
import { useNavigate } from "react-router-dom";


function Main(){
    const navigate = useNavigate();
function challengePage(){
    navigate("/challenge")
}
    return(
<div>
  <div className="button-container">
    <button className="pixel-btn" onClick={challengePage}>Daily Challenge</button>
    <button className="pixel-btn">Training</button>
    <button className="pixel-btn">Check Leaderboard</button>
  </div>
</div>
    )
}

export default Main;