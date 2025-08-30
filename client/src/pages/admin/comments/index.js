import axios from 'axios';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import Select from 'react-select';
import Breadcrumb from './../../../components/dashboard/Breadcrumb';
import Pagination from './../../../components/dashboard/Pagination';
import Spinner from './../../../components/dashboard/Spinner';
import CommentModal from './CommentModal';
import CommentDetailModal from './CommentDetailModal';
import ViewList, { buildNestedComments } from './ViewList';
import ViewTable from './ViewTable';
import { useAuth } from './../../../contexts/AuthContext';

const Comments = () => {
	const { hasPermission } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const indexOfLastItem = parseInt(currentPage) * parseInt(itemsPerPage);
    const indexOfFirstItem = parseInt(indexOfLastItem) - parseInt(itemsPerPage);
	const [query, setQuery] = useState('');
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [view, setView] = useState('table');
	const [posts, setPosts] = useState([]);
	const [comments, setComments] = useState([]);

    const fetchAllData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [commentsResp, postsResp] = await Promise.all([
                axios.get('/api/comments'),
                axios.get('/api/posts')
            ]);
            setComments(commentsResp.data || []);
            setPosts(postsResp.data || []);
        } catch (err) {
            console.error("Failed to fetch data:", err);
            setError("Failed to fetch comments and posts.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

	const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
	const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const filteredAndSortedComments = useMemo(() => {
        let items = [...comments];
        if (query) {
            items = items.filter((item) =>
                Object.values(item).some((value) =>
                    String(value).toLowerCase().includes(query.toLowerCase())
                )
            );
        }
        if (sortConfig.key !== null) {
            items.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return items;
    }, [comments, query, sortConfig]);

    const nestedCommentsForListView = useMemo(() => {
        return buildNestedComments(filteredAndSortedComments);
    }, [filteredAndSortedComments]);

	const totalCommentsCountForPagination = filteredAndSortedComments.length;

    const postMap = useMemo(() => {
        return posts.reduce((map, post) => {
            map[post.id] = post.ptitle;
            return map;
        }, {});
    }, [posts]);

    const currentItemsToRender = useMemo(() => {
        if (view === 'list') {
            return nestedCommentsForListView.slice(indexOfFirstItem, indexOfLastItem);
        } else {
            return filteredAndSortedComments.slice(indexOfFirstItem, indexOfLastItem);
        }
    }, [view, nestedCommentsForListView, filteredAndSortedComments, indexOfFirstItem, indexOfLastItem]);

	const currentItems = filteredAndSortedComments.slice(indexOfFirstItem, indexOfLastItem);
    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
	const handleSearch = (evt) => {
		setQuery(evt.target.value);
		setCurrentPage(1);
	}

    const [showModal, setShowModal] = useState(false);
    const [currentComment, setCurrentComment] = useState(null);
    const [message, setMessage] = useState('');

	const [commentDetail, setCommentDetail] = useState({});
	const [showCommentDetailModal, setShowCommentDetailModal] = useState(false);

    const handleViewDetailComment = (comment) => {
        setCommentDetail(comment);
        setShowCommentDetailModal(true);
        setMessage('');
        setError('');
    };

    const handleEditComment = (comment) => {
        setCurrentComment(comment);
        setShowModal(true);
        setMessage('');
        setError('');
    };

    const handleDeleteComment = (id) => {
        if (window.confirm('Are you sure want to delete this comment?')) {
            setIsLoading(true);
            setMessage('');
            setError('');
            setTimeout(() => {
                setComments(comments.filter(comment => comment.id !== id));
                setMessage('Comment has been deleted successfully!');
                setIsLoading(false);
            }, 300);
        }
    };

    const handleSubmitComment = (commentData) => {
        setIsLoading(true);
        setMessage('');
        setError('');

        setTimeout(() => {
            if (commentData.id) {
                setComments(comments.map(comment =>
                    comment.id === commentData.id ? commentData : comment
                ));
                setMessage('Comment has been updated succesafully!');
            } else {
                const newId = (comments.length > 0 ? Math.max(...comments.map(a => parseInt(a.id))) + 1 : 1).toString();
                setComments([...comments, { ...commentData, id: newId }]);
                setMessage('Comment has been created successfully!');
            }
            setShowModal(false);
            setIsLoading(false);
        }, 500);
    };

    const handleCloseModal = useCallback(() => {
        setShowModal(false);
        setCurrentComment(null);
        setError('');
    }, []);

	const handleCloseCommentDetailModal = useCallback(() => {
        setShowCommentDetailModal(false);
        setCommentDetail(null);
        setError('');
    }, []);

    const arrOptions = Array.from({ length: 5 }, (_, i) => (i + 1) * 5);
	const valueOptions = arrOptions.reduce((acc, elm) => {
	    acc.push({
	        value: elm,
	        label: elm
	    });
	    return acc;
	}, []);

	if(isLoading) return <Spinner />
	if(error) return (
		<div className="container p-5 text-center">
			<div className="alert alert-danger" role="alert">{error}</div>
		</div>
	)

	if(hasPermission('read-comments')) {
	    return (
	   		<main className="main">
		  		<Breadcrumb />
				<section id="starter-section" className="starter-section section">

					<div className="container-fluid">
			            {error && (
			                <div className="alert alert-danger alert-dismissible fade show" role="alert">
			                    {error}
			                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
			                </div>
			            )}
			            {message && (
			                <div className="alert alert-success alert-dismissible fade show" role="alert">
			                    {message}
			                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
			                </div>
			            )}
						<article className="article">

	                       <div className={`btn-group ${comments.length > 0 ? '' : 'mb-3'}`} role="group">
	                            <button type="button" onClick={() => setView('list')} className={`${view === 'list' ? 'active' : ''} btn btn-outline-primary`}><i className="bi bi-list"></i> List</button>
	                            <button type="button" onClick={() => setView('table')} className={`${view === 'table' ? 'active' : ''} btn btn-outline-primary`}><i className="bi bi-table"></i> Table</button>
	                        </div>
					    	{
				    			comments.length > 0 ? (
							    	<div className="d-flex justify-content-between my-3">
							    		<div>
				                            <Select
				                            	defaultValue={{ value: itemsPerPage, label: itemsPerPage }}
				                            	onChange={(selectedOptions) => {
				                            		setItemsPerPage(selectedOptions ? selectedOptions.value : null);
				                            		setCurrentPage(1);
			                            		}}
				                            	options={valueOptions}
				                                placeholder="Select per page"
				                            />
										</div>
							    		<div>
											<div className="input-group mb-3">
											    <input type="text" value={query} onChange={handleSearch} className="form-control" placeholder="Type something here" />
											    <button type="button" className="btn btn-primary" onClick={handleSearch}><i className="bi bi-search"></i></button>
											</div>
										</div>
							    	</div>
						    	) : (
						    		null
						    	)
					    	}
					    	{
			    				view === 'table' ? (
						            <ViewTable
						            	data={currentItems}
						                currentPage={currentPage}
						                itemsPerPage={itemsPerPage}
				    					sortConfig={sortConfig}
				                        onSort={handleSort}
			                        	handleViewDetailComment={handleViewDetailComment}
			                        	handleEditComment={handleEditComment}
			                        	handleDeleteComment={handleDeleteComment}
						            />
					    		) : (
		                                <ViewList
		                                    currentItems={currentItemsToRender}
		                                    totalCommentsCountForPagination={totalCommentsCountForPagination}
		                                    postMap={postMap}
		                                    handleEditComment={handleEditComment}
		                                    handleDeleteComment={handleDeleteComment}
		                                    currentPage={currentPage}
		                                    itemsPerPage={itemsPerPage}
		                                    handlePageChange={handlePageChange}
		                                    query={query}
		                                    handleSearch={handleSearch}
		                                />
					    		)
				    		}
				    		{
				    			comments.length > 0 ? (
						            <div className="d-flex justify-content-between">
										<div>
											{ comments && filteredAndSortedComments.length > 0 &&  (<p>Showing <strong>{indexOfFirstItem+1}</strong> to <strong>{Math.min(indexOfLastItem, filteredAndSortedComments.length)}</strong> of <strong>{filteredAndSortedComments.length}</strong> entries</p>) }
										</div>
										<div>
								            <Pagination
								                totalItems={filteredAndSortedComments.length}
								                currentPage={currentPage}
								                itemsPerPage={itemsPerPage}
								                onPageChange={handlePageChange}
								            />
							            </div>
						            </div>
				    			) : (
				    				null
				    			)
			    			}

				            <CommentModal
				                show={showModal}
				                onClose={handleCloseModal}
				                onSubmit={handleSubmitComment}
				                commentData={currentComment}
				            />

				            <CommentDetailModal
				                show={showCommentDetailModal}
				                onClose={handleCloseCommentDetailModal}
				                commentData={commentDetail}
				            />
			            </article>

		            </div>
	            </section>
	        </main>
	    )
    } else {
    	return <Navigate to="/unauthorized" replace={true} />
    }
};

export default Comments;
