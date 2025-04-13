"use client";
import { useFirestore } from "@/hooks/useFirestore";
import { Card, Table, Typography } from "antd";
import { Medal, Trophy, Users } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const { Title, Text } = Typography;


export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topicCount, setTopicCount] = useState(0);
  const userQuizDb = useFirestore("user_quiz");
  const topicsDb = useFirestore("topics");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizResults, topics] = await Promise.all([
          userQuizDb.getAll(),
          topicsDb.getAll()
        ]);
        
        setTopicCount(topics.length);
        
        const userStats = new Map();

        quizResults.forEach((result) => {
          const existing = userStats.get(result.user.id) || {
            user: result.user,
            scores: [],
            totalQuestions: [],
            totalTopic: []
          };

          existing.scores.push(result.score);
          existing.totalQuestions.push(result.total_questions);
          existing.totalTopic.push(result.topic_id);
          userStats.set(result.user.id, existing);
        });

        const leaderboard = Array.from(userStats.values()).map((stats) => {
          const totalScore = stats.scores.reduce((sum, score) => sum + score, 0);
          const totalTopic = new Set(stats.totalTopic).size;
          
          return {
            user: stats.user,
            averageScore: (totalScore / totalTopic),
            totalQuizzes: stats.scores.length,
          };
        });

        leaderboard.sort((a, b) => b.averageScore - a.averageScore);
        setLeaderboardData(leaderboard);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      title: "Rank",
      key: "rank",
      width: 80,
      render: (_, __, index) => {
        const medals = {
          0: <Medal className="h-6 w-6 text-yellow-400" />,
          1: <Medal className="h-6 w-6 text-gray-400" />,
          2: <Medal className="h-6 w-6 text-amber-700" />,
        };
        return (
          <div className="flex items-center justify-center">
            {medals[index] || index + 1}
          </div>
        );
      },
    },
    {
      title: "User",
      key: "user",
      render: (record) => (
        <div className="flex items-center space-x-3">
          <Image 
            className="rounded-full"
            width={40}
            height={40}
            src={record.user.photo} 
            alt={record.user.name}
          />
          <div>
            <Text strong>{record.user.name}</Text>
            <Text className="text-gray-500 text-sm block">{record.user.email}</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Average Score",
      key: "averageScore",
      render: (record) => (
        <Text strong>{record.averageScore.toFixed(1)}</Text>
      ),
    },
    {
      title: "Quizzes Taken",
      key: "totalQuizzes",
      render: (record) => record.totalQuizzes,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Trophy className="h-16 w-16 text-yellow-500" />
          </div>
          <Title level={1} className="mb-4">Leaderboard</Title>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-yellow-700 block">Top Score</Text>
                <Title level={3} className="!mb-0">
                  {leaderboardData[0]?.averageScore.toFixed(1) || 0}
                </Title>
              </div>
              <Trophy className="h-10 w-10 text-yellow-500" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-blue-700 block">Total Participants</Text>
                <Title level={3} className="!mb-0">
                  {leaderboardData.length}
                </Title>
              </div>
              <Users className="h-10 w-10 text-blue-500" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-green-700 block">Total no of Quizzes</Text>
                <Title level={3} className="!mb-0">
                  {topicCount}
                </Title>
              </div>
              <Medal className="h-10 w-10 text-green-500" />
            </div>
          </Card>
        </div>

        {/* Leaderboard Table */}
        <Card>
          <Table
            columns={columns}
            dataSource={leaderboardData}
            loading={loading}
            rowKey={(record) => record.user.id}
            pagination={{
              pageSize: 10,
              position: ["bottomCenter"],
              showSizeChanger: false,
            }}
            className="overflow-x-auto"
          />
        </Card>
      </div>
    </div>
  );
}