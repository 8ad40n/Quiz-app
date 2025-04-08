"use client";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, message, Select, Space, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useFirestore } from "../../../hooks/useFirestore";

const { Title } = Typography;

export default function AddQuiz() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const topicsDb = useFirestore("topics");
  const questionsDb = useFirestore("questions");
  const optionsDb = useFirestore("options");

  const handleSubmit = async (values) => {
    console.log(values)
    setLoading(true);
    try {
      // Add topic
      const topic = await topicsDb.add({
        name: values.topic.name,
        description: values.topic.description,
      });

      // Add questions and options
      for (const question of values.questions) {
        const questionDoc = await questionsDb.add({
          topic_id: topic.id,
          text: question.text,
        });

        // Add options for each question
        for (const option of question.options) {
          await optionsDb.add({
            question_id: questionDoc.id,
            text: option.text,
            is_correct: option.is_correct,
          });
        }
      }

      message.success("Quiz added successfully!");
      form.resetFields();
      toast.success("Quiz added successfully!");
      router.push("/quiz");
    } catch (error) {
      console.error("Error adding quiz:", error);
      message.error("Failed to add quiz");
      toast.error("Failed to add quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="mx-auto">
        <Title level={2} className="mb-8">
          Add New Quiz
        </Title>

        <Form
          form={form}
          
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            questions: [{ options: [{}] }],
          }}
        >
          {/* Topic Section */}
          <Title level={4}>Topic Details</Title>
          <Form.Item
            name={["topic", "name"]}
            label="Topic Name"
            rules={[{ required: true, message: "Please enter topic name" }]}
          >
            <Input placeholder="e.g., General Knowledge" />
          </Form.Item>

          <Form.Item
            name={["topic", "description"]}
            label="Topic Description"
            rules={[{ required: true, message: "Please enter topic description" }]}
          >
            <Input.TextArea placeholder="Brief description of the topic" />
          </Form.Item>

          {/* Questions Section */}
          <Title level={4} className="mt-8">
            Questions
          </Title>
          <Form.List name="questions">
            {(fields, { add, remove }) => (
              <Space direction="vertical" className="w-full">
                {fields.map((field, index) => (
                  <Card key={field.key} size="small" className="w-full">
                    <Space align="baseline" className="w-full">
                      <Form.Item
                        {...field}
                        label={`Question ${index + 1}`}
                        name={[field.name, "text"]}
                        rules={[{ required: true, message: "Please enter question text" }]}
                      >
                        <Input.TextArea placeholder="Enter question text"  />
                      </Form.Item>

                      {fields.length > 1 && (
                        <MinusCircleOutlined onClick={() => remove(field.name)} />
                      )}
                    </Space>

                    {/* Options */}
                    <Form.List name={[field.name, "options"]}>
                      {(optionFields, { add: addOption, remove: removeOption }) => (
                        <div className="flex flex-col">
                          {optionFields.map((optionField, optionIndex) => (
                            <Space key={optionField.key} align="baseline">
                              <Form.Item
                                {...optionField}
                                name={[optionField.name, "text"]}
                                rules={[{ required: true, message: "Please enter option text" }]}
                              >
                                <Input placeholder={`Enter option ${optionIndex + 1}`} />
                              </Form.Item>

                              <Form.Item
                                {...optionField}
                                name={[optionField.name, "is_correct"]}
                                valuePropName="checked"
                              >
                                <Select
                                  placeholder="Correct?"
                                  style={{ width: 100 }}
                                  options={[
                                    { label: "Correct", value: true },
                                    { label: "Incorrect", value: false },
                                  ]}
                                />
                              </Form.Item>

                              {optionFields.length > 1 && (
                                <MinusCircleOutlined onClick={() => removeOption(optionField.name)} />
                              )}
                            </Space>
                          ))}

                          <Button
                            type="dashed"
                            onClick={() => addOption()}
                            icon={<PlusOutlined />}
                            className="mt-2 max-w-40"
                          >
                            Add Option
                          </Button>
                        </div>
                      )}
                    </Form.List>
                  </Card>
                ))}

                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                  className="my-4"
                >
                  Add Question
                </Button>
              </Space>
            )}
          </Form.List>

          <Form.Item className="mt-8">
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              Create Quiz
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}