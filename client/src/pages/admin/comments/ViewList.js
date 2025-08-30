import { Link } from 'react-router-dom';

export const buildNestedComments = (commentList, parentId = "0") => {
    if (!commentList) return [];
    const nestedComments = commentList.filter(comment => String(comment.parent) === String(parentId));
    nestedComments.forEach(comment => {
        const replies = buildNestedComments(commentList, comment.id);
        if (replies.length > 0) {
            comment.children = replies;
        }
    });
    return nestedComments;
};

const Comment = ({ comment, level = 0, handleEditComment, handleDeleteComment, postMap }) => {
    const postTitle = postMap[comment.post_id];

    return (
        <div className={`my-3 ${level === 0 ? 'shadow px-3 py-1' : ''}`}>
            <div id={`comment-${level === 0 ? '' : 'reply-'}${comment.id}`} className={`comment ${level === 0 ? '' : 'comment-reply'}`}>
                {level === 0 && <h3 className="mb-3">{postTitle}</h3>}
                <div className="d-flex">
                    <div className="comment-img">
                        <img src={`/img/default-150x150.png`} alt="" />
                    </div>
                    <div>
                        <h5>
                            <Link to="#">{comment.name}</Link>
                            <button type="button" className="btn btn-link reply" onClick={() => handleEditComment(comment.post_id, comment.id)}><i className="bi bi-reply-fill"></i> Balas</button>
                            <button type="button" className="btn btn-link reply" onClick={() => handleDeleteComment(comment.id)}><i className="bi bi-trash"></i> Hapus</button>
                        </h5>
                        <time dateTime={comment.created_at}>{new Date(comment.created_at).toLocaleString()}</time>
                        <p>{comment.content}</p>
                        {
                            comment.children && comment.children.map(childComment => (
                                <Comment
                                    key={childComment.id}
                                    comment={childComment}
                                    level={level + 1}
                                    handleEditComment={handleEditComment}
                                    handleDeleteComment={handleDeleteComment}
                                    postMap={postMap}
                                />
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

const ViewList = ({ currentItems, totalCommentsCountForPagination, postMap, handleEditComment, handleDeleteComment }) => {

    return (
		<section id="blog-comments" className="blog-comments section">
	        <div className="container-fluid">
	            {
	                currentItems?.length > 0 ? (
	                    currentItems?.map((comment) => (
	                        <Comment
	                            key={comment.id}
	                            comment={comment}
	                            postMap={postMap}
	                            handleEditComment={handleEditComment}
	                            handleDeleteComment={handleDeleteComment}
	                        />
	                    ))
	                ) : (
	                    <p className="text-center">No data to show</p>
	                )
	            }
	        </div>
        </section>
    );
};

export default ViewList;
