// @ts-nocheck
import { h, Component } from 'preact';

export default class QuestionForm extends Component {
  state = {
    formTitle: '',
    questions: [{ questionType: 'TEXT', questionText: '', options: [] }], // Zero options initially
  };

  addQuestion = () => {
    this.setState({
      questions: [...this.state.questions, { questionType: 'TEXT', questionText: '', options: [] }],
    });
  };

  addOption = (qIndex) => {
    const questions = [...this.state.questions];
    questions[qIndex].options.push('');
    this.setState({ questions });
  };

  handleQuestionChange = (index, field, value) => {
    const questions = [...this.state.questions];
    questions[index][field] = value;
    this.setState({ questions });
  };

  handleOptionChange = (qIndex, oIndex, value) => {
    const questions = [...this.state.questions];
    questions[qIndex].options[oIndex] = value;
    this.setState({ questions });
  };

  handleTypeChange = (index, value) => {
    const questions = [...this.state.questions];
    questions[index].questionType = value;
    if (value === 'MCQ' && questions[index].options.length === 0) {
      questions[index].options = ['']; // Add one option when switching to MCQ
    }
    this.setState({ questions });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { formTitle, questions } = this.state;
    const validQuestions = questions.filter(
      (q) => q.questionText.trim() && (q.questionType === 'TEXT' || q.options.some((o) => o.trim()))
    );
    if (validQuestions.length && formTitle.trim()) {
      this.props.onSubmit({ title: formTitle, questions: validQuestions });
    }
  };

  render() {
    const { formTitle, questions } = this.state;

    return (
      <form onSubmit={this.handleSubmit} class="space-y-6 p-6 bg-gray-50 rounded-xl shadow-md max-w-2xl mx-auto">
        <h1 class="text-3xl font-bold text-indigo-700 text-center">Create Your Questionnaire</h1>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Form Title</label>
          <input
            type="text"
            value={formTitle}
            onInput={(e) => this.setState({ formTitle: e.target.value })}
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            placeholder="Enter form title"
            required
          />
        </div>

        {questions.map((q, i) => (
          <div key={i} class="border border-gray-200 p-4 rounded-lg bg-white shadow-sm">
            <label class="block text-sm font-semibold text-gray-700 mb-1">Question {i + 1}</label>
            <input
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              placeholder={`Enter question ${i + 1}`}
              value={q.questionText}
              onInput={(e) => this.handleQuestionChange(i, 'questionText', e.target.value)}
              required
            />
            <select
              class="mt-3 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              value={q.questionType}
              onChange={(e) => this.handleTypeChange(i, e.target.value)}
            >
              <option value="TEXT">Text</option>
              <option value="MCQ">Multiple Choice</option>
            </select>
            {q.questionType === 'MCQ' && (
              <div class="mt-4 space-y-2">
                {q.options.map((opt, oi) => (
                  <input
                    key={oi}
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:outline-none"
                    placeholder={`Option ${oi + 1}`}
                    value={opt}
                    onInput={(e) => this.handleOptionChange(i, oi, e.target.value)}
                    required
                  />
                ))}
                <button
                  type="button"
                  onClick={() => this.addOption(i)}
                  class="text-sm text-indigo-600 hover:text-indigo-800 transition"
                >
                  + Add Option
                </button>
              </div>
            )}
          </div>
        ))}

        <div class="flex justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={this.addQuestion}
            class="w-full py-3 px-4 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg shadow-sm transition"
          >
            + Add Question
          </button>
          <button
            type="submit"
            class="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm transition"
          >
            Submit Questions
          </button>
        </div>
      </form>
    );
  }
}