import { h } from 'preact';

export default function AnswerList({ answers, questions }) {
    console.log(questions);
  if (!answers.length) {
    return (
      <div class="space-y-6 p-6 bg-gray-50 rounded-xl shadow-md max-w-2xl mx-auto text-center">
        <p class="text-gray-500 font-medium">No answers submitted yet.</p>
      </div>
    );
  }

  const questionMap = questions.reduce((map, q) => {
    map[q.questionId] = q.questionText;
    return map;
  }, {});

  console.log(questionMap);

  return (
    <div class="space-y-6 p-6 bg-gray-50 rounded-xl shadow-md max-w-2xl mx-auto">
      <h2 class="text-3xl font-bold text-indigo-700 text-center">Submitted Answers</h2>
      <ul class="space-y-4">
        {answers.map((answer, index) => (
          <li key={index} class="p-4 border border-gray-200 bg-white rounded-md shadow-sm">
            <p class="text-gray-700">
              <strong>{questionMap[answer.questionId] || 'Unknown Question'}:</strong> {answer.answerText || 'Not answered'}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}