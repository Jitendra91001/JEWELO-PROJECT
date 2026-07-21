import React from 'react';
import { Avatar, Input } from 'antd';

const { TextArea } = Input;

interface CommentTextAreaProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  avatarSrc?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}

const CommentInput: React.FC<CommentTextAreaProps> = ({
  value,
  onChange,
  placeholder = "Add Comment...",
  avatarSrc = "https://i.pravatar.cc/32",
  disabled = false,
  autoFocus = false,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '3px',
        border: '1px solid #d9d9d9',
        borderRadius: '8px',
        padding: '2px 5px',
        backgroundColor: disabled ? '#f5f5f5' : '#fff',
        width: '100%',
      }}
    >
    {avatarSrc &&  <Avatar size={32} src={avatarSrc} />}
      <TextArea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoSize={{ minRows: 1, maxRows: 3 }}
        bordered={false}
        style={{
          resize: 'none',
          paddingTop: 6,
          width: '100%',
          backgroundColor: 'transparent',
        }}
        disabled={disabled}
        autoFocus={autoFocus}
      />
    </div>
  );
};

export default CommentInput;
