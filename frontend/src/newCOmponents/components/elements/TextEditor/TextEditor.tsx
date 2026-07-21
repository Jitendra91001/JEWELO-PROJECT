import React, { useState } from "react";
import RichTextEditor from "react-rte";
import "./textEditor.css";

interface Props {
  onChange : any;
  value : any ;
}

const TextEditor = React.memo(({ onChange, value } : Props) => {
  const previousValue = RichTextEditor.createValueFromString(
    value ? value : "",
    "html"
  );
  const [inputValue, setInputValue] = useState(previousValue);

  const handleOnChange = (newValue) => {
    setInputValue(newValue);
    if (onChange) {
      onChange(newValue.toString("html"));
    }
  };

  return (
    <div className="customTextEditor w-full">
      <RichTextEditor
        value={previousValue}
        onChange={handleOnChange}
        toolbarConfig={{}}
        className="w-full rounded-lg"
        style={{ width: "100%" }}
      />
    </div>
  );
});

export default TextEditor;
