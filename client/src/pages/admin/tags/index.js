import axios from 'axios';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Select from 'react-select';
import Breadcrumb from './../../../components/dashboard/Breadcrumb';
import Pagination from './../../../components/dashboard/Pagination';
import Spinner from './../../../components/dashboard/Spinner';
import { useAuth } from './../../../contexts/AuthContext';
import TagModal from './TagModal';
import TagDetailModal from './TagDetailModal';

const CollapsibleRow = ({ data, currentPage, itemsPerPage, index, handleViewDetailTag, handleEditTag, handleDeleteTag }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };
	const { hasPermission } = useAuth();
	const detailRows = [
        <tr key="createdAt">
            <th>Created At</th>
            <td colSpan="3">
                <div>
                    {new Date(data.created_at).toLocaleDateString()}
                </div>
            </td>
        </tr>,
        <tr key="actions">
            <th>Actions</th>
            <td colSpan="3">
                <div className="btn-group" role="group">
					{ hasPermission('read-tags') && (
						<button type="button" onClick={() => handleViewDetailTag(data)} className="text-white btn btn-sm btn-success"><i className="bi bi-eye"></i></button>) }
					{ hasPermission('update-tags') && (
						<button type="button" onClick={() => handleEditTag(data)} className="text-white btn btn-sm btn-warning"><i className="bi bi-pencil"></i></button>) }
					{ hasPermission('delete-tags') && (
						<button type="button" onClick={() => handleDeleteTag(data.seotitle)} className="text-white btn btn-sm btn-danger"><i className="bi bi-trash"></i></button>) }
                </div>
            </td>
        </tr>
	];
	const expandedRowCount = detailRows.length + 1;
    return (
        <React.Fragment>
            <tr>
                <td rowSpan={isExpanded ? expandedRowCount : null}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{data.title}</td>
                <td>{data.seotitle}</td>
                <td>{data.count}</td>
                <td>{data.username}</td>
                <td rowSpan={isExpanded ? expandedRowCount : null}>
                    <i className={`bi ${isExpanded ? 'bi-chevron-left' : 'bi-chevron-down'}`} onClick={toggleExpand}></i>
                </td>
            </tr>
			{ isExpanded && detailRows }
        </React.Fragment>
    );
};

const CollapsibleTable = ({ data, currentPage, itemsPerPage, sortConfig, onSort, allTags, handleViewDetailTag, handleEditTag, handleDeleteTag }) => {
	const getSortIcon = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'asc' ? 'bi-chevron-up' : 'bi-chevron-down';
        }
        return 'bi-chevron-down';
    };

    return (
        <table className="table table-striped table-bordered">
        	{
        		data.length > 0 ? (
		            <thead>
		                <tr>
		                    <th>#</th>
		                    <th onClick={() => onSort('title')}>Title
								<i className={`float-end bi ${getSortIcon('title')}`}></i>
		                    </th>
		                    <th onClick={() => onSort('seotitle')}>SEO Title
								<i className={`float-end bi ${getSortIcon('seotitle')}`}></i>
		                    </th>
		                    <th onClick={() => onSort('count')}>Count
								<i className={`float-end bi ${getSortIcon('count')}`}></i>
		                    </th>
		                    <th onClick={() => onSort('createdBy')}>Created By
								<i className={`float-end bi ${getSortIcon('createdBy')}`}></i>
		                    </th>
		                    <th>...</th>
		                </tr>
		            </thead>
            	) : (
            		null
            	)
            }
            <tbody>
                {
                    data.length > 0 ? (
	                    data.map((item, idx) => (
	                        <CollapsibleRow
	                        	key={idx}
	                        	data={item}
				                currentPage={currentPage}
				                itemsPerPage={itemsPerPage}
	                        	index={idx}
	                        	allTags={allTags}
	                        	handleViewDetailTag={handleViewDetailTag}
	                        	handleEditTag={handleEditTag}
	                        	handleDeleteTag={handleDeleteTag}
	                        />
	                    ))
                    ) : (
	                    <tr>
	                    	<td colSpan="5" className="text-center">No data to show</td>
	                	</tr>
                    )
                }
            </tbody>
        </table>
    );
}

const Tags = () => {
	const { hasPermission } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const indexOfLastItem = parseInt(currentPage) * parseInt(itemsPerPage);
    const indexOfFirstItem = parseInt(indexOfLastItem) - parseInt(itemsPerPage);
	const [query, setQuery] = useState('');
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

	const [tags, setTags] = useState([]);
	useEffect(() => {
		const fetchTags = async () => {
			try {
				const resp = await axios.get('/api/tags');
				setTags(resp.data);
			} catch(err) {
				console.log(err);
				setError(err.message);
			} finally {
				setIsLoading(false);
			}
		}
		fetchTags();
	},[tags]);

	const sortedAndFilteredItems = useMemo(() => {
        let sortableItems = [...tags];

        if (query) {
            sortableItems = sortableItems.filter((item) =>
                Object.values(item).some((value) =>
                    String(value).toLowerCase().includes(query.toLowerCase())
                )
            );
        }

        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [tags, query, sortConfig]);

	const currentItems = sortedAndFilteredItems.slice(indexOfFirstItem, indexOfLastItem);
    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
	const handleSearch = (evt) => {
		setQuery(evt.target.value);
		setCurrentPage(1);
	}

	const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const arrOptions = Array.from({ length: 5 }, (_, i) => (i + 1) * 5);
	const valueOptions = arrOptions.reduce((acc, elm) => {
	    acc.push({
	        value: elm,
	        label: elm
	    });
	    return acc;
	}, []);

    const [showModal, setShowModal] = useState(false);
    const [currentTag, setCurrentTag] = useState(null);
    const [message, setMessage] = useState('');
	const [tagDetail, setTagDetail] = useState({});
	const [showTagDetailModal, setShowTagDetailModal] = useState(false);
    const handleViewDetailTag = (tag) => {
        setTagDetail(tag);
        setShowTagDetailModal(true);
        setMessage('');
        setError('');
    };
	const handleCloseTagDetailModal = useCallback(() => {
        setShowTagDetailModal(false);
        setTagDetail(null);
        setError('');
    }, []);
    const handleAddTag = () => {
        setCurrentTag(null);
        setShowModal(true);
        setMessage('');
        setError('');
    };
    const handleEditTag = (tag) => {
        setCurrentTag(tag);
        setShowModal(true);
        setMessage('');
        setError('');
    };
    const handleDeleteTag = (id) => {
        if (window.confirm('Are you sure want to delete this tag?')) {
            setIsLoading(true);
            setMessage('');
            setError('');
            setTimeout(() => {
                setTags(tags.filter(tag => tag.id !== id));
                setMessage('Tag has been deleted successfully!');
                setIsLoading(false);
            }, 300);
        }
    };
    const handleSubmitTag = (tagData) => {
        setIsLoading(true);
        setMessage('');
        setError('');

        setTimeout(() => {
            if (tagData.id) {
                setTags(tags.map(tag =>
                    tag.id === tagData.id ? tagData : tag
                ));
                setMessage('Tag has been updated succesafully!');
            } else {
                const newId = (tags.length > 0 ? Math.max(...tags.map(a => parseInt(a.id))) + 1 : 1).toString();
                setTags([...tags, { ...tagData, id: newId }]);
                setMessage('Tag has been created successfully!');
            }
            setShowModal(false);
            setIsLoading(false);
        }, 500);
    };
    const handleCloseModal = useCallback(() => {
        setShowModal(false);
        setCurrentTag(null);
        setError('');
    }, []);

	if(isLoading) return <Spinner />
	if(error) return (
		<div className="container p-5 text-center">
			<div className="alert alert-danger" role="alert">{error}</div>
		</div>
	)

	if(hasPermission('read-tags')) {
	    return (
	   		<main className="main">
		  		<Breadcrumb />
				<section id="starter-section" className="starter-section section">
					<div className="container-fluid">
						<article className="article">
							{ hasPermission('create-tags') && (<button type="button" onClick={handleAddTag} className="text-white btn btn-sm btn-primary"><i className="bi bi-plus"></i> Add New Tag</button>) }
							{error && (<div className="alert alert-danger" role="alert">{error}</div>)}
							{message && (<div className="alert alert-danger" role="alert">{message}</div>)}
							{
								tags.length > 0 && (
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
					    		)
				    		}

				            <CollapsibleTable
				            	data={currentItems}
				                currentPage={currentPage}
				                itemsPerPage={itemsPerPage}
		    					sortConfig={sortConfig}
		                        onSort={handleSort}
		                        allTags={tags}
	                        	handleViewDetailTag={handleViewDetailTag}
				                handleEditTag={handleEditTag}
				                handleDeleteTag={handleDeleteTag}
				            />
							{
								tags.length > 0 && (
					            <div className="d-flex justify-content-between">
									<div>
										{ tags.length > 0 && sortedAndFilteredItems.length > 0 &&  (<p>Showing <strong>{indexOfFirstItem+1}</strong> to <strong>{Math.min(indexOfLastItem, sortedAndFilteredItems.length)}</strong> of <strong>{sortedAndFilteredItems.length}</strong> entries</p>) }
									</div>
									<div>
							            <Pagination
							                totalItems={sortedAndFilteredItems.length}
							                currentPage={currentPage}
							                itemsPerPage={itemsPerPage}
							                onPageChange={handlePageChange}
							            />
						            </div>
					            </div>
					            )
				            }
			            </article>
		            </div>
	            </section>

    			<TagModal
	                show={showModal}
	                onClose={handleCloseModal}
	                onSubmit={handleSubmitTag}
	                tagData={currentTag}
	            />

    			<TagDetailModal
	                show={showTagDetailModal}
	                onClose={handleCloseTagDetailModal}
	                tagData={tagDetail}
	            />
	        </main>
	    )
    } else {
    	return <Navigate to="/unauthorized" replace={true} />
    }
};

export default Tags;
