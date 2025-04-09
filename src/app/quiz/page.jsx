"use client";
import { useFirestore } from '@/hooks/useFirestore';
import { Button, Card, Divider, Progress, Radio, Space, Typography } from 'antd';
import { Brain, Loader, Timer, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';

const { Title, Text } = Typography;

const QUIZ_DURATION = 30; // Duration in seconds
const STORAGE_KEY = 'quiz_state';


function Quiz() {
  const [topics, setTopics] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [options, setOptions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION);
  const [timerActive, setTimerActive] = useState(false);

  const [selectedTopic, setSelectedTopic] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  const topicsDb = useFirestore("topics");
  const questionsDb = useFirestore("questions");
  const optionsDb = useFirestore("options");

  // Load saved state on initial mount
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      const state = JSON.parse(savedState);
      const elapsedTime = Math.floor((Date.now() - state.startTime) / 1000);
      const remainingTime = Math.max(0, state.timeLeft - elapsedTime);

      // Only restore if there's still time left
      if (remainingTime > 0) {
        setSelectedTopic(state.selectedTopic);
        setUserAnswers(state.userAnswers);
        setTimeLeft(remainingTime);
        setTimerActive(true);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Save state when it changes
  useEffect(() => {
    if (selectedTopic && !showResults) {
      const state = {
        selectedTopic,
        userAnswers,
        timeLeft,
        startTime: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [selectedTopic, userAnswers, timeLeft, showResults]);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const topicsData = await topicsDb.getAll();
        const questionsData = await questionsDb.getAll();
        const optionsData = await optionsDb.getAll();

        setTopics(topicsData);
        setQuestions(questionsData);
        setOptions(optionsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Timer effect
  useEffect(() => {
    let interval;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          const newTime = time - 1;
          if (newTime <= 0) {
            handleSubmit();
          }
          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const topicQuestions = questions.filter(q => q.topic_id === selectedTopic);

  const handleTopicSelect = (topicId) => {
    setSelectedTopic(topicId);
    setUserAnswers([]);
    setShowResults(false);
    setTimeLeft(QUIZ_DURATION);
    setTimerActive(true);
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
    setTimerActive(false);
    setShowResults(true);
    localStorage.removeItem(STORAGE_KEY);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!selectedTopic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Brain className="w-16 h-16 text-indigo-600" />
            </div>
            <Title level={1} className="mb-4">Welcome to the Quiz App</Title>
            <Text className="text-lg text-gray-600">Choose a topic to start your quiz journey!</Text>
          </div>
          {
            loading && (
              <div className="flex items-center justify-center mb-4">
                <Loader className="w-16 h-16 text-indigo-600 animate-spin" />
              </div>
            )
          }
          <div className="grid md:grid-cols-2 lg:grid-cols-3 justify-center items-center gap-6">
            {topics.map(topic => (
              <Card
                key={topic.id}
                hoverable
                onClick={() => handleTopicSelect(topic.id)}
                className="cursor-pointer md:h-60"
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
    const attemptedQuestions = userAnswers.length;
    const percentage = (score / totalQuestions) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="mx-auto">
          <div className="text-center mb-8">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <Title level={2}>Quiz Results</Title>
            <div className="flex flex-col items-center gap-4 mb-6">
              <Progress
                type="circle"
                percent={percentage}
                format={() => `${score}/${totalQuestions}`}
                className="mb-4"
              />
              <Text className="text-lg">
                Time Remaining: {formatTime(timeLeft)}
              </Text>
              <Text className="text-lg">
                Questions Attempted: {attemptedQuestions} out of {totalQuestions}
              </Text>
            </div>
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
                    {userSelectedOption ? (
                      <Text>
                        Your answer:{' '}
                        <Text type={userSelectedOption?.is_correct ? 'success' : 'danger'}>
                          {userSelectedOption?.text}
                        </Text>
                      </Text>
                    ) : (
                      <Text type="danger">Not attempted</Text>
                    )}
                    {(!userSelectedOption || !userSelectedOption?.is_correct) && (
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Title level={2} className="mb-0">
            {topics.find(t => t.id === selectedTopic)?.name}
          </Title>
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Timer className="w-6 h-6 text-indigo-600" />
            <span className={`${timeLeft <= 10 ? 'text-red-600' : 'text-gray-700'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

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
          className="mt-8"
        >
          Submit Quiz
        </Button>
      </Card>
    </div>
  );
}

export default Quiz;