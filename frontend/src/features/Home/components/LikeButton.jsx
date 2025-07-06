import { Button, Spin } from "antd";
import { HeartFilled } from '@ant-design/icons';
import { useAddLike, useRemoveLike } from "../hooks/mainPageHooks";
import { useState } from "react";
import { useAntdApi } from "../../../contexts/MessageContext";

const LikeButton = ({ template, userId }) => {
  const [isLiked, setIsLiked] = useState(template.likes.length > 0);
  const [likeCount, setLikeCount] = useState(template._count?.likes || 0);
  const { mutate: addLike, isPending: givingLike } = useAddLike();
  const { mutate: removeLike, isPending: removingLike } = useRemoveLike();
  const { message: messageApi } = useAntdApi();

  if (givingLike || removingLike) {
    return (
      <Spin />
    )
  }

  const handleLike = async () => {
    try {
      if (!userId) {
        messageApi.warning('Please login to like templates');
        return;
      }
      if (isLiked) {
        removeLike({templateId:template.id, userId});
        setLikeCount(prev => prev - 1);
      } else {
        addLike({templateId:template.id, userId});
        setLikeCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  return (
    <Button
      icon={<HeartFilled style={{ color: isLiked ? '#ff4d4f' : undefined }} />}
      onClick={handleLike}
    >
      {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
    </Button>
  );
};

export default LikeButton;