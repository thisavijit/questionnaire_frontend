import { h, Component } from 'preact';
import axios from 'axios';
import QuestionForm from '../../components/QuestionForm';

export default class Home extends Component {
  state = {
    uniqueUrl: null,
    error: null,
  };

  handleSubmit = async (formData) => {
    try {
      const API_BASE = import.meta.env.VITE_MICRONAUT_BACKEND_URL;
      const response = await axios.post(`${API_BASE}/questionnaire`, formData);
      const { questionnaireId } = response.data;
      const currentUrl = window.location.origin;
      this.setState({ 
        uniqueUrl: `${currentUrl}/response/${questionnaireId}`, 
        questionnaireId,
        error: null 
      });
    } catch (err) {
      this.setState({ error: 'Failed to create form. Using mock ID.' });
      const id = 'mock-id-123';
      const currentUrl = window.location.origin;
      this.setState({ 
        uniqueUrl: `${currentUrl}/response/${id}`,
        questionnaireId: id,
      });
    }
  };

  handleShare = async () => {
    const { uniqueUrl } = this.state;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Questionnaire Link',
          text: 'Please respond to my questionnaire',
          url: uniqueUrl,
        });
      } catch (err) {
        console.error('Sharing failed', err);
      }
    } else {
      alert('Sharing is not supported in this browser. Please copy the link manually.');
    }
  };

  render() {
    const { uniqueUrl, questionnaireId, error } = this.state;

    return (
      <div>
        {uniqueUrl ? (
          <div class="space-y-6 p-6 bg-gray-50 rounded-xl shadow-md max-w-2xl mx-auto text-center">
            <h1 class="text-3xl font-bold text-indigo-700">Questionnaire Created</h1>
            <p class="text-gray-600">Share this link to answer the questions:</p>

            <div class="p-3 bg-indigo-100 text-indigo-700 rounded-lg break-all select-all">
              {uniqueUrl}
            </div>

            <button
              onClick={this.handleShare}
              class="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-sm transition"
            >
              Share This Link
            </button>

            <p class="text-gray-500 mt-4">
              <strong>See results:</strong>{' '}
              <a
                href={`/response/${questionnaireId}`}
                class="text-indigo-600 hover:underline"
              >
                View Submitted Answers
              </a>
            </p>

            {error && <p class="text-red-500">{error}</p>}
          </div>
        ) : (
          <QuestionForm onSubmit={this.handleSubmit} />
        )}
      </div>
    );
  }
}