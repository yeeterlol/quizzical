import React from "react"
import Quiz from "./components/Quiz"
import './index.css'

export default function App() {
    const [isQuiz, setIsQuiz] = React.useState(false);

    function pressButton() {
        setIsQuiz(prevState => !prevState)
    }
    return (
        <main>
        {   
            isQuiz 
            ?
            <div>
                <Quiz />
            </div>     
            :
            <div className="start">
              <h1 className="start-main karla">Quizzical</h1>
              <p className="start-main">Some description if needed</p>
              <button className="start-btn" onClick={pressButton}>Start quiz</button>
            </div>
        }
        </main>
    )
}