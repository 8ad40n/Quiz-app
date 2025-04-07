"use client";
import { Button, Card, Divider, Progress, Radio, Space, Typography } from 'antd';
import { Brain, Trophy } from 'lucide-react';
import { useState } from 'react';
import { options, questions, topics } from '../data/quiz-data';

const { Title, Text } = Typography;


function App() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const topicQuestions = questions.filter(q => q.topic_id === selectedTopic);

  const handleTopicSelect = (topicId) => {
    setSelectedTopic(topicId);
    setUserAnswers([]);
    setShowResults(false);
  };

  const handleAnswerSelect = (questionId, optionId) => {
    const existingAnswerIndex = userAnswers.findIndex(a => a.questionId === questionId);
    
    if (existingAnswerIndex !== -1) {
      const newAnswers = [...userAnswers];
      newAnswers[existingAnswerIndex] = { questionId, selectedOptionId: optionId };
      setUserAnswers(newAnswers);
    } else {
      setUserAnswers([...userAnswers, { questionId, selectedOptionId: optionId }]);
    }
  };

  const calculateScore = () => {
    let score = 0;
    userAnswers.forEach(answer => {
      const correctOption = options.find(
        opt => opt.question_id === answer.questionId && opt.is_correct
      );
      if (correctOption && correctOption.id === answer.selectedOptionId) {
        score++;
      }
    });
    return score;
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  if (!selectedTopic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Brain className="w-16 h-16 text-indigo-600" />
            </div>
            <Title level={1} className="mb-4">Welcome to the Quiz App</Title>
            <Text className="text-lg text-gray-600">Choose a topic to start your quiz journey!</Text>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map(topic => (
              <Card
                key={topic.id}
                hoverable
                onClick={() => handleTopicSelect(topic.id)}
                className="cursor-pointer"
              >
                <Title level={4}>{topic.name}</Title>
                <Text type="secondary">{topic.description}</Text>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const totalQuestions = topicQuestions.length;
    const percentage = (score / totalQuestions) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <Card className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <Title level={2}>Quiz Results</Title>
            <Progress
              type="circle"
              percent={percentage}
              format={() => `${score}/${totalQuestions}`}
              className="mb-4"
            />
          </div>

          <Divider />

          <Space direction="vertical" className="w-full">
            {topicQuestions.map((question, index) => {
              const userAnswer = userAnswers.find(a => a.questionId === question.id);
              const correctOption = options.find(opt => opt.question_id === question.id && opt.is_correct);
              const userSelectedOption = options.find(opt => opt.id === userAnswer?.selectedOptionId);

              return (
                <Card key={question.id} size="small" className="w-full">
                  <Title level={5}>
                    {index + 1}. {question.text}
                  </Title>
                  <Space direction="vertical">
                    <Text>
                      Your answer:{' '}
                      <Text type={userSelectedOption?.is_correct ? 'success' : 'danger'}>
                        {userSelectedOption?.text}
                      </Text>
                    </Text>
                    {!userSelectedOption?.is_correct && (
                      <Text>
                        Correct answer:{' '}
                        <Text type="success">{correctOption?.text}</Text>
                      </Text>
                    )}
                  </Space>
                </Card>
              );
            })}
          </Space>

          <Button
            type="primary"
            block
            size="large"
            onClick={() => setSelectedTopic(null)}
            className="mt-8"
          >
            Try Another Topic
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <Card className="max-w-3xl mx-auto">
        <Title level={2} className="mb-8">
          {topics.find(t => t.id === selectedTopic)?.name}
        </Title>

        <Space direction="vertical" className="w-full" size="large">
          {topicQuestions.map((question, index) => {
            const questionOptions = options.filter(option => option.question_id === question.id);
            const userAnswer = userAnswers.find(a => a.questionId === question.id);

            return (
              <Card key={question.id} size="small" className="w-full">
                <Title level={4} className="mb-4">
                  {index + 1}. {question.text}
                </Title>
                <Radio.Group
                  onChange={(e) => handleAnswerSelect(question.id, e.target.value)}
                  value={userAnswer?.selectedOptionId}
                  className="w-full"
                >
                  <Space direction="vertical" className="w-full">
                    {questionOptions.map(option => (
                      <Radio key={option.id} value={option.id} className="w-full">
                        {option.text}
                      </Radio>
                    ))}
                  </Space>
                </Radio.Group>
              </Card>
            );
          })}
        </Space>

        <Button
          type="primary"
          size="large"
          block
          onClick={handleSubmit}
          disabled={userAnswers.length !== topicQuestions.length}
          className="mt-8"
        >
          Submit Quiz
        </Button>
      </Card>
    </div>
  );
}

export default App;