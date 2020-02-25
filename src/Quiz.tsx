import React from 'react';
import './Quiz.css';

const apiURL = "http://localhost:3001/";
const questionsPerGame = 3;

type QuizQuestion = {
  name: string;
  question: string;
  answers: Array<string>;
};

type QuizProps = {};
type QuizState = {
  isLoaded: boolean;
  title: string;
  questions: QuizQuestion[];
  selected: Array<number>;
  guesses: Array<string>;
  current: number;
  score: number;
};

class Quiz extends React.Component<QuizProps, QuizState> {
  constructor(props: QuizProps) {
    super(props);

    this.state = {
      isLoaded: false,
      title: '',
      questions: [],
      selected: [],
      guesses: [],
      current: -1,
      score: -1,
    };

    this.fetchQuestions();
  }

  fetchQuestions() {
    fetch(apiURL + 'questions')
      .then((resp) => resp.text())
      .then((respText) => this.parseQuiz(respText))
      .catch(this.handleError);
  }

  fetchScore() {
    fetch(apiURL + 'score?' + this.state.guesses.join('&'))
      .then((resp) => resp.text())
      .then((score) => {
        this.setState({
          score: parseInt(score, 10)
        });
      });
  }

  handleError(error: Error) {
    console.error(error);
  }

  parseQuiz(respText: String) {
    this.setState({
      isLoaded: true
    });

    const rows = respText.split('\n');
    const questions: Array<QuizQuestion> = [];

    rows.forEach((row, i) => {
      if (row === '') return;

      const [keys, value] = row.split('=');
      if (keys === 'root.Quiz.Cat') {
        this.setState({
          title: value
        });
      } else {
        const [, , name, label] = keys.split('.');

        let index = questions.findIndex((q) => q.name === name);
        if (index === -1) {
          index = questions.push({
            name: name,
            question: '',
            answers: []
          }) - 1;
        }

        switch (label) {
          case 'Question':
            questions[index].question = value.trim();
            break;

          case 'Answer':
            questions[index].answers.push(value);
            break;

          case 'Incorrects':
            questions[index].answers.push(...value.split(','));
            break;
        }
      }
    });

    questions.forEach((question)=> {
      // let's not make it that easy :)
      question.answers.sort(() => Math.random() - 0.5);
      // remove duplicate answers
      question.answers = question.answers.filter((answer, index, self) => self.indexOf(answer) === index);
    });

    this.setState({
      questions,
      selected: this.getRandomNumbers(questions.length, questionsPerGame)
    });
  }

  getRandomNumbers(range: number, length: number) {
    return new Array(range)
      .fill(undefined)
      .map((a, i) => a = i)
      .sort(() => Math.random() - 0.5)
      .slice(0, length);
  }

  handleGuess(guess: string, n: number) {
    const guesses = this.state.guesses.concat([`Quiz.Q${n + 1}.Guess=${guess}`]);
    this.setState({
      guesses,
      current: this.state.current + 1
    });
  }

  reset() {
    this.setState({
      current: 0,
      score: -1,
      guesses: [],
      selected: this.getRandomNumbers(this.state.questions.length, questionsPerGame)
    });
  }

  renderStart() {
    return (
      <button onClick={() => { this.setState({ current: 0 }) }}>Play</button>
    );
  }

  renderAnswer(str: string, i: number, n: number) {
    return (
      <button key={i} onClick={() => this.handleGuess(str, n)}>{str}</button>
    )
  }

  renderQuestion(current: number) {
    const questionNumber = this.state.selected[current];
    const currentQuestion = this.state.questions[questionNumber];
    return (
      <div className='question'>
        <h6>Question {current + 1}</h6>
        <h4>{currentQuestion.question}</h4>
        <div className='buttons'>
          {currentQuestion.answers.map((answer, index) => this.renderAnswer(answer, index, questionNumber))}
        </div>
      </div>
    )
  }

  renderResults() {
    if (this.state.score === -1) {
      this.fetchScore();
    }
    return (
      <>
        <div className='score'>Score: {this.state.score} out of {questionsPerGame}</div>
        <button onClick={() => this.reset()}>Play again</button>
      </>
    )
  }

  renderContainer() {
    return (
      <fieldset>
        <legend>
          <small>Category: </small>
          {this.state.title}
        </legend>
        {this.state.current === -1 && this.renderStart()}
        {this.state.current > -1 && this.state.current < questionsPerGame && this.renderQuestion(this.state.current)}
        {this.state.current === questionsPerGame && this.renderResults()}
      </fieldset>
    );
  }

  renderLoader() {
    return (
      <div>Loading</div>
    );
  }

  render() {
    return (
      this.state.isLoaded
        ? this.renderContainer()
        : this.renderLoader()
    );
  }
}

export default Quiz;
