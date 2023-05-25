import React from "react";
import { nanoid } from "nanoid";
import he from "he";

function Quiz(props) {
  const [questions, setQuestions] = React.useState([]);
  const [isFinished, setIsFinished] = React.useState(false);
  const [questionsData, setQuestionsData] = React.useState({
    0: "",
    1: "",
    2: "",
    3: "",
    4: "",
  });
  const [numberOfProblems, setNumberOfProblems] = React.useState(0);

  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }


  function resetGame() {
    setQuestions([]);
    setNumberOfProblems(0);
    setQuestionsData({
      0: "",
      1: "",
      2: "",
      3: "",
      4: "",
    });
    setIsFinished(false);

    const fetchQuiz = async () => {
      const data = await fetch(
        "https://opentdb.com/api.php?amount=5&type=multiple"
      );
      const json = await data.json();
      const results = json.results;
      results.forEach((result) => {
        result.shuffled_answers = shuffle(
          result.incorrect_answers.concat(result.correct_answer)
        );
      });
      setQuestions(results);
    };
    fetchQuiz().catch(console.error);
  }
  function submit() {

    const completeTest = Object.values(questionsData).every((ele) => ele != "");
    if (completeTest) {
      let answers = 0;
      let index = 0;

      for (var key in questionsData) {
        if (questionsData[key] === questions[index].correct_answer) {
          answers++;
          index++;
        } else {
          index++;
        }
      }

      setIsFinished(prevState => !prevState);
      setNumberOfProblems(answers);
    } else {
      alert("You need to select 5 options!");
    }
  }

  function selectItem(questionNumber, answer) {
    setQuestionsData((prevData) => ({
      ...prevData,
      [questionNumber]: answer,
    }));
  }

  React.useEffect(() => {
    const fetchQuiz = async () => {
      const data = await fetch(
        "https://opentdb.com/api.php?amount=5&type=multiple"
      );
      const json = await data.json();
      const results = json.results;
      // Shuffle the answers here and store them in a new property
      results.forEach((result) => {
        result.shuffled_answers = shuffle(
          result.incorrect_answers.concat(result.correct_answer)
        );
      });
      setQuestions(results);
    };
    fetchQuiz().catch(console.error);
  }, []);

  
  // shit load of pasted gpt code since it was hella late and i was going insane
  const buttons = questions.map((ele, index) => {
    const options = ele.shuffled_answers.map((element, int) => {
      const userAnswer = questionsData[index];
      const isCorrect = userAnswer === ele.correct_answer;
      const isAnswer = element === ele.correct_answer;
      const className = userAnswer
        ? isCorrect
          ? isAnswer
            ? "quiz-button correct"
            : "quiz-button"
          : isAnswer
          ? "quiz-button correct"
          : "quiz-button incorrect"
        : "quiz-button";
      return (
        <button
          className={isFinished ? className : "quiz-button"}
          onClick={() => selectItem(index, he.decode(element))}
          key={nanoid()}
        >
          {he.decode(element)}
        </button>
      );
    });
    return (
      <div key={nanoid()}>
        <h1 className="quiz-question">{he.decode(ele.question)}</h1>
        <div className="form-control">{options}</div>
        <hr />
      </div>
    );
  });

  return (
    <div>
      {questions.length > 0 ? (
        <div>
          {buttons}
          {isFinished && <h1>You finished {numberOfProblems}/5</h1>}
          <button onClick={isFinished ? resetGame : submit} className="btn-submit">
            {isFinished ? "Play again" : "Check answers"}
          </button>
        </div>
      ) : (
        "Loading"
      )}
    </div>
  );
}

export default Quiz;
