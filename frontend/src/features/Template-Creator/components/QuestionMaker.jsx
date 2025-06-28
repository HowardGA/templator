import { Form, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import QuestionItem from "./QuestionItem";
import { debounce } from "lodash";
import { useEffect, useMemo } from "react";

const MAX_QUESTIONS = 16;

const QuestionMaker = ({ onQuestionsChange }) => {
    const [form] = Form.useForm();
    const questions = Form.useWatch("items", form);
    const questionCount = questions ? questions.length : 0;

    const debouncedChangeHandler = useMemo(
        () =>
            debounce((items) => {
                if (!items) return;
                const validItems = items.filter(item => item !== null && item !== undefined);

                const formattedQuestions = validItems.map((item, index) => ({
                    questionIndex: index + 1,
                    questionType: item.questionType,
                    title: item.title,
                    description: item.description,
                    isRequired: item.isRequired || false,
                    options: item.options || []
                }));

                onQuestionsChange?.(formattedQuestions);
            }, 500),
        [onQuestionsChange]
    );

    useEffect(() => {
        debouncedChangeHandler(questions);
        return () => debouncedChangeHandler.cancel();
    }, [questions, debouncedChangeHandler]);

    return (
        <Form
            form={form}
            name="questions_form_builder"
            layout="vertical"
            style={{ width: "80%", margin: "0 auto" }}
            initialValues={{ items: [{}] }}
        >
            <Form.List name="items">
                {(fields, { add, remove }) => (
                    <div style={{ display: "flex", rowGap: 24, flexDirection: "column" }}>
                        {fields.map((field, index) => (
                            <QuestionItem
                                key={field.key}
                                field={field}
                                remove={remove}
                                formInstance={form}
                                questionIndex={index}
                                isRemovable={questionCount > 1}
                            />
                        ))}

                        <Button
                            type="primary"
                            onClick={() => add()}
                            block
                            disabled={questionCount >= MAX_QUESTIONS}
                            icon={<PlusOutlined />}
                            style={{ marginTop: 16 }}
                        >
                            {questionCount >= MAX_QUESTIONS
                                ? `Maximum ${MAX_QUESTIONS} Questions Reached`
                                : "Add Question"}
                        </Button>
                    </div>
                )}
            </Form.List>
        </Form>
    );
};

export default QuestionMaker;
