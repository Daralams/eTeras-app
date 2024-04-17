import React, { useState } from 'react';

function CommentForm() {
  const [isReplying, setIsReplying] = useState(false);
  const [comment, setComment] = useState('');

  const handleChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Kirim komentar atau balasan komentar ke server
    console.log(comment);
    // Reset input setelah mengirim
    setComment('');
  };

  const handleReplyClick = () => {
    setIsReplying(true);
  };
  
  
  const postReplyComment = async(url, body) => {
    preventDefault()
    try {
      const response = await axios.post(url, body)
      setMessage("")
    }catch (error) {
      if(error.response) console.error(error.message)
    }
  }
  
  postReplyComment(`http://localhost:3000/posts/reply-comment/${commentId}`, {
        commentId,
        userId,
        message
      })
  postReplyComment(`http://localhost:3000/posts/reply-comment/${parentReplyId}/${commentId}`, {
        commentId,
        userId,
        parentReplyId,
        message
      })

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {isReplying ? (
          <div>
            <textarea
              value={comment}
              onChange={handleChange}
              placeholder="Balas komentar..."
            />
          </div>
        ) : (
          <div>
            <textarea
              value={comment}
              onChange={handleChange}
              placeholder="Ketikkan komentar..."
            />
          </div>
        )}
        <button type="submit">Kirim</button>
      </form>
      {!isReplying && (
        <button onClick={handleReplyClick}>Balas</button>
      )}
    </div>
  );
}

export default CommentForm;


function MyComponent() {
  return (
    <div>
      {data.map((item) => (
        <div key={item.id}>
          <h2>{item.name}</h2>
          <ul>
            {item.children && item.children.map((child) => (
              <li key={child.id}>{child.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}


   {/* {likes && likes.map((like) => (
        <div key={like.id} className="absolute text-center bottom-1 right-2">
          <button className="text-xl">
            <SlHeart />
          </button>
          <small className="text-center text-[10px]">{like.status}</small>
        </div>
      ))} */}
   {/*{likes.length > 0 && likes.map((like) => ( // Check if likes array has elements before mapping
        <div key={like.id} className="absolute text-center bottom-1 right-2">
          <button className="text-xl">
            <SlHeart />
          </button>
          <small className="text-center text-[10px]">{like.id}</small>
        </div>
      ))} */}

