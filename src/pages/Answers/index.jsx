import { h, Component } from 'preact';
import axios from 'axios';
import QuestionDisplay from '../../components/QuestionDisplay';

export default class Answers extends Component {
  state = {
    formData: null,
    error: null,
    loading: false,
  };

  componentDidMount() {
    this.fetchFormData();
  }

  fetchFormData = async () => {
    this.setState({...this.state, loading: true});
    const { id } = this.props;
    try {
      const formResponse = await axios.get(`http://localhost:8080/questionnaire/${id}`).catch(() => ({
        data: {
          id,
          title: 'Mock Questionnaire',
          questions: [
            {
              questionId: '39e07d3b-4528-4621-92a1-302f9dc3c742',
              questionType: 'TEXT',
              questionText: 'Mock Text Question',
              options: [],
            },
            {
              questionId: 'd1b0d1da-8efb-41f6-9fc6-eb023b2ed443',
              questionType: 'MCQ',
              questionText: 'Mock MCQ Question',
              options: ['Option 1', 'Option 2'],
            },
          ],
          answers: [
            {
              questionId: '39e07d3b-4528-4621-92a1-302f9dc3c742',
              answerText: 'Java',
            },
            {
              questionId: 'd1b0d1da-8efb-41f6-9fc6-eb023b2ed443',
              answerText: 'React is easier to use than Angular.',
            },
          ],
        }, // Mock default form with answers
      })).finally(() => {
        this.setState({...this.state, loading: false});
      });
      this.setState({
        formData: formResponse.data,
        error: null,
      });
    } catch (err) {
      this.setState({ error: 'Failed to load form data.' });
    }
  };

    handleAnswerSubmit = async (newAnswers) => {    
    const { id } = this.props;
    const { formData } = this.state;

    console.log(formData.questions)

    const payload = {
        questionnaireId: id,
        answers: newAnswers,
    };

    try {
        await axios.post(`http://localhost:8080/questionnaire/${id}/answers`, payload);
        this.fetchFormData(); // Refresh data
    } catch (err) {
        this.setState({
        error: 'Failed to submit answers.',
        });
        // Optionally handle mock submission
        this.setState((prevState) => ({
        formData: {
            ...prevState.formData,
            answers: [...(prevState.formData.answers || []), ...payload.answers],
        },
        }));
    }
    };

  render() {
    const { formData, error } = this.state;
        if (this.state.loading) {
        return "Loading...";
    }
    if (!formData || !formData.questions) {
      return (
        <div class="space-y-6 p-6 bg-gray-50 rounded-xl shadow-md max-w-2xl mx-auto text-center">
          <h2 class="text-3xl font-bold text-red-500">Form not found</h2>
          {error && <p class="text-red-500">{error}</p>}
        </div>
      );
    }

    return (
      <div class="space-y-6 p-6 bg-gray-50 rounded-xl shadow-md max-w-2xl mx-auto">
        <h1 class="text-3xl font-bold text-indigo-700 text-center">
          {formData.title || 'Questionnaire'}
        </h1>
        <QuestionDisplay
          questions={formData.questions}
          answers={formData.answers || []}
          onSubmit={this.handleAnswerSubmit}
          loading={this.state.loading}
        />
        {error && <p class="text-red-500 text-center">{error}</p>}
      </div>
    );
  }
}