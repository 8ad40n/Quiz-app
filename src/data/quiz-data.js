// Topics Collection
export const topics = [
  {
    id: "topic001",
    name: "General Knowledge",
    description: "Test your general knowledge with these questions.",
  },
  {
    id: "topic002",
    name: "Technology",
    description: "Questions about technology and innovations.",
  },
  {
    id: "topic003",
    name: "Sports",
    description: "Questions about various sports and athletes.",
  },
];

// Questions Collection
export const questions = [
  {
    id: "q001",
    topic_id: "topic001",
    text: "What is the capital of France?",
  },
  {
    id: "q002",
    topic_id: "topic001",
    text: "Which planet is known as the Blue Planet?",
  },
  {
    id: "q003",
    topic_id: "topic002",
    text: "Who is known as the father of computers?",
  },
  {
    id: "q004",
    topic_id: "topic002",
    text: "What does HTTP stand for?",
  },
  {
    id: "q005",
    topic_id: "topic003",
    text: "How many players are there in a soccer team?",
  },
  {
    id: "q006",
    topic_id: "topic003",
    text: "Which country has won the most FIFA World Cups?",
  },
];

// Option Collection
export const options = [
  {
    id: "a001",
    question_id: "q001",
    text: "Paris",
    is_correct: true,
  },
  {
    id: "a002",
    question_id: "q001",
    text: "London",
    is_correct: false,
  },
  {
    id: "a003",
    question_id: "q001",
    text: "Berlin",
    is_correct: false,
  },
  {
    id: "a004",
    question_id: "q002",
    text: "Earth",
    is_correct: true,
  },
  {
    id: "a005",
    question_id: "q002",
    text: "Mars",
    is_correct: false,
  },
  {
    id: "a006",
    question_id: "q002",
    text: "Venus",
    is_correct: false,
  },
  {
    id: "a007",
    question_id: "q003",
    text: "Charles Babbage",
    is_correct: true,
  },
  {
    id: "a008",
    question_id: "q003",
    text: "Alan Turing",
    is_correct: false,
  },
  {
    id: "a009",
    question_id: "q003",
    text: "Bill Gates",
    is_correct: false,
  },
  {
    id: "a010",
    question_id: "q004",
    text: "HyperText Transfer Protocol",
    is_correct: true,
  },
  {
    id: "a011",
    question_id: "q004",
    text: "HyperText Transmission Protocol",
    is_correct: false,
  },
  {
    id: "a012",
    question_id: "q004",
    text: "HyperText Transfer Program",
    is_correct: false,
  },
  {
    id: "a013",
    question_id: "q005",
    text: "11",
    is_correct: true,
  },
  {
    id: "a014",
    question_id: "q005",
    text: "10",
    is_correct: false,
  },
  {
    id: "a015",
    question_id: "q005",
    text: "12",
    is_correct: false,
  },
  {
    id: "a016",
    question_id: "q006",
    text: "Brazil",
    is_correct: true,
  },
  {
    id: "a017",
    question_id: "q006",
    text: "Germany",
    is_correct: false,
  },
  {
    id: "a018",
    question_id: "q006",
    text: "Italy",
    is_correct: false,
  },
];