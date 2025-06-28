import { useState, useEffect, useMemo } from 'react';
import SimpleMdeReact from 'react-simplemde-editor'; 
import 'easymde/dist/easymde.min.css'; 

const MDE = ({ initialContent = '', onContentChange }) => {
    const [value, setValue] = useState(initialContent);

    useEffect(() => {
        setValue(initialContent);
    }, [initialContent]);

    const handleChange = (newValue) => {
        setValue(newValue);
        if (onContentChange) {
            onContentChange(newValue);
        }
    };

    const options = useMemo(() => ({
        autofocus: true,
        spellChecker: false,
        toolbar: [
            "bold", "italic", "heading", "|",
            "quote", "unordered-list", "ordered-list", "|",
            "link", "image", "table", "|",
            "preview", "guide"
        ],
    }), []);

    return (
        <div className="container">
            <SimpleMdeReact
                value={value}
                onChange={handleChange}
                options={options}
            />
        </div>
    );
};

export default MDE;