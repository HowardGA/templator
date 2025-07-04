import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import QuestionItem from "./QuestionItem";
import { useEffect, useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

const MAX_QUESTIONS = 16;

const QuestionMaker = ({ questions = [], onQuestionsChange }) => {
    const [items, setItems] = useState(questions || []);

    useEffect(() => {
        if (questions?.length && items.length === 0) {
            setItems(questions);
        }
    }, []);

    const handleRemove = (index) => {
        const updatedItems = items.filter((_, i) => i !== index);
        setItems(updatedItems);
        onQuestionsChange?.(updatedItems);
    };

    const handleAdd = () => {
        if (items.length >= MAX_QUESTIONS) return;
        const newItem = {
            key: `item-${Date.now()}`,
            title: "",
            description: "",
            questionType: "",
            required: false,
            options: [],
        };
        const updatedItems = [...items, newItem];
        setItems(updatedItems);
        onQuestionsChange?.(updatedItems);
    };

    const handleDragEnd = ({ active, over }) => {
        if (!over || active.id === over.id) return;
        const oldIndex = items.findIndex((item) => item?.key === active.id);
        const newIndex = items.findIndex((item) => item?.key === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
            const newItems = arrayMove(items, oldIndex, newIndex);
            setItems(newItems);
            onQuestionsChange?.(newItems);
        }
    };

    const questionCount = questions.length;

    return (
        <div style={{ width: '80%' }}>
            <DndContext
                collisionDetection={closestCenter}
                modifiers={[restrictToVerticalAxis]}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={items.map((item) => item.key)}
                    strategy={verticalListSortingStrategy}
                >
                    <div style={{ display: "flex", rowGap: 24, flexDirection: "column" }}>
                        {items.map((item, index) => (
                            <QuestionItem
                                id={item.key}
                                key={item.key}
                                item={item}
                                index={index}
                                remove={() => handleRemove(index)}
                                isRemovable={items.length > 1}
                                onChange={(updatedFields) => {
                                    const newItems = [...items];
                                    newItems[index] = { ...newItems[index], ...updatedFields };
                                    setItems(newItems);
                                    onQuestionsChange?.(newItems);
                                }}
                            />
                        ))}

                        <Button
                            type="primary"
                            onClick={handleAdd}
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
                </SortableContext>
            </DndContext>
        </div>
    );
};

export default QuestionMaker;
