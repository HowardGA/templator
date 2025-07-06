import { Button, Space, Avatar, Typography, Input, Spin, Divider} from "antd";
import { useTemplateComments, useAddComment } from "../hooks/mainPageHooks";
import { useState } from "react";

const {Text} = Typography;

const CommentsSection = ({ templateId, user }) => {
  const [newComment, setNewComment] = useState('');
  const {data: comments, isLoading} = useTemplateComments(templateId);
  const {mutate: addComment, isPending: submittingComment} = useAddComment();

  if (isLoading || submittingComment){
    return (
        <Spin/>
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    addComment({templateId, content: newComment, currentUserId: user.id  });
    setNewComment('');
  };

  return (
    <div>
      <h3>Comments ({comments.data.data.length || 0})</h3>
      {user && (
        <form onSubmit={handleSubmit}>
          <Input.TextArea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
          />
          <Button type="primary" htmlType="submit" style={{ marginTop: 8 }}>
            Post Comment
          </Button>
        </form>
      )}
      <div style={{ marginTop: 16 }}>
        {comments.data.data.map(comment => (
          <div key={comment.id} style={{ marginBottom: 16, paddingBottom: 16 }}>
            <Space align="start">
              <Avatar>{comment.author.firstName.charAt(0)}</Avatar>
              <div>
                <strong>{comment.author.firstName} {comment.author.lastName}</strong>
                <div style={{ margin: '4px 0' }}>{comment.content}</div>
                <Text type="secondary">
                  {new Date(comment.createdAt).toLocaleString()}
                  {comment.createdAt !== comment.updatedAt && ' (edited)'}
                </Text>
              </div>
            </Space>
            <Divider style={{marginBottom:'-1rem'}}/>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;