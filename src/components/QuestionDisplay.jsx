// @ts-nocheck
import { h, Component } from 'preact';

export default class QuestionDisplay extends Component {
  state = {
    step: 0,
    answers: Array(this.props.questions.length).fill(''),
    submitLoading: false,
  };

  componentDidMount() {
    // Prefill answers if they exist
    const { questions, answers } = this.props;
    const prefilledAnswers = questions.map((q) => {
      const answer = answers.find((a) => a.questionId === q.questionId);
      return answer ? answer.answerText : '';
    });
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ answers: prefilledAnswers });
  }

  handleAnswerChange = (value) => {
    const { step, answers } = this.state;
    const newAnswers = [...answers];
    newAnswers[step] = value;
    this.setState({ answers: newAnswers });
  };

    handleNext = () => {
    const { step, answers } = this.state;
    const { questions } = this.props;

    if (step + 1 === questions.length) {
        console.log(questions);
        this.setState({ submitLoading: true });
        setTimeout(() => {
        const answerObjects = answers.map((answerText, index) => ({
            questionId: questions[index].id,
            answerText,
        }));
        this.props.onSubmit(answerObjects);
        this.setState({
            step: 0,
            submitLoading: false,
        });
        }, 1000); // Simulate async submission
    } else {
        this.setState({ step: step + 1 });
    }
    };

  render() {
    const { questions, answers: existingAnswers } = this.props;
    console.log(existingAnswers);

    const { step, answers, submitLoading } = this.state;
    const q = questions[step];
    const hasAnswers = existingAnswers.length > 0;

    return (
      <div class="space-y-6 p-6 bg-gray-50 rounded-xl shadow-md max-w-2xl mx-auto">
        <h2 class="text-3xl font-bold text-indigo-700 text-center">{q.questionText}</h2>
        {q.questionType === 'MCQ' ? (
          <div class="space-y-3">
            {q.options
              .filter((opt) => opt.trim())
              .map((opt, i) => {
                console.log(opt, existingAnswers[step])
                console.log(existingAnswers, 'anse')
                return <label
                  key={i}
                  class="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition"
                >
                  <input
                    type="radio"
                    name={`question-${step}`}
                    value={opt}
                    checked={hasAnswers ? existingAnswers[step].answerText === opt : answers[step] === opt}
                    onChange={(e) => this.handleAnswerChange(e.target.value)}
                    disabled={hasAnswers || submitLoading}
                    class="mr-3 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span class="text-gray-800">{opt}</span>
                </label>
  })}
          </div>
        ) : (
          <textarea
            class="w-full p-3 border border-gray-700 bg-gray-100 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition resize-none"
            placeholder="Your answer..."
            disabled={hasAnswers || submitLoading}
            value={hasAnswers ? existingAnswers[step].answerText : answers[step]}
            onInput={(e) => this.handleAnswerChange(e.target.value)}
          />
        )}
       {(!hasAnswers || step < questions.length - 1) && (
  <button
    onClick={this.handleNext}
    disabled={(!answers[step] && !hasAnswers) || submitLoading}
    class="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition"
  >
    {step + 1 === questions.length ? (submitLoading ? 'Submitting...' : 'Submit') : 'Next'}
  </button>
)}
      </div>
    );
  }
}