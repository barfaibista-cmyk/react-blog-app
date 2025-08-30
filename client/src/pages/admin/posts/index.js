import axios from 'axios';
import React, { useState, useEffect, useMemo } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Select from 'react-select';
import Breadcrumb from './../../../components/dashboard/Breadcrumb';
import Pagination from './../../../components/dashboard/Pagination';
import Spinner from './../../../components/dashboard/Spinner';
import { useAuth } from './../../../contexts/AuthContext';

const CollapsibleRow = ({ data, currentPage, itemsPerPage, index }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };
	const { hasPermission } = useAuth();
	const detailRows = [
        <tr key="active">
            <th>Active</th>
            <td colSpan="3">
                <div>
                    {data.active === '1' ? 'Yes' : 'No'}
                </div>
            </td>
        </tr>,
        <tr key="createdBy">
            <th>Created By</th>
            <td colSpan="3">
                <div>
                    {data.username}
                </div>
            </td>
        </tr>,
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
                    { hasPermission('read-posts') && (<Link to={`/dashboard/posts/${data.seotitle}`} className="text-white btn btn-sm btn-success"><i className="bi bi-eye"></i></Link>) }
                    { hasPermission('update-posts') && (<Link to={`/dashboard/posts/write?edit=${data?.seotitle}`} state={data} className="text-white btn btn-sm btn-warning"><i className="bi bi-pencil"></i></Link>) }
                    { hasPermission('delete-posts') && (<Link to="" className="text-white btn btn-sm btn-danger"><i className="bi bi-trash"></i></Link>) }
                </div>
            </td>
        </tr>
	];
	const expandedRowCount = detailRows.length + 1;
    return (
        <React.Fragment>
            <tr>
                <td rowSpan={isExpanded ? expandedRowCount : null}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{data.ctitle}</td>
                <td>{data.title}</td>
                <td>{data.headline === 'Y' ? 'Yes' : 'No' }</td>
                <td rowSpan={isExpanded ? expandedRowCount : null}>
                    <i className={`bi ${isExpanded ? 'bi-chevron-left' : 'bi-chevron-down'}`} onClick={toggleExpand}></i>
                </td>
            </tr>
			{ isExpanded && detailRows }
        </React.Fragment>
    );
};

const CollapsibleTable = ({ data, currentPage, itemsPerPage, sortConfig, onSort }) => {
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
		                    <th onClick={() => onSort('category')}>Category
								<i className={`float-end bi ${getSortIcon('category')}`}></i>
		                    </th>
		                    <th onClick={() => onSort('title')}>Title
								<i className={`float-end bi ${getSortIcon('title')}`}></i>
		                    </th>
		                    <th onClick={() => onSort('headline')}>Headline
								<i className={`float-end bi ${getSortIcon('headline')}`}></i>
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

const Posts = () => {
	const { hasPermission } = useAuth();
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const [posts, setPosts] = useState([]);
	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const resp = await axios.get('/api/posts');
				setPosts(resp.data);
			} catch(err) {
				console.log(err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		}
		fetchPosts();
	},[posts]);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const indexOfLastItem = parseInt(currentPage) * parseInt(itemsPerPage);
    const indexOfFirstItem = parseInt(indexOfLastItem) - parseInt(itemsPerPage);

	const [query, setQuery] = useState('');
	const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

	const sortedAndFilteredItems = useMemo(() => {
        let sortableItems = [...posts];
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
    }, [posts, query, sortConfig]);

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

	if(loading) return <Spinner />
	if(error) return (
		<div className="container p-5 text-center">
			<div className="alert alert-danger" role="alert">{error}</div>
		</div>
	)

	if(hasPermission('read-posts')) {
	    return (
	   		<main className="main">
		  		<Breadcrumb />
				<section id="starter-section" className="starter-section section">
					<div className="container-fluid">

						<article className="article">
							{ hasPermission('create-posts') && (<Link to="/dashboard/posts/write" className={`text-white btn btn-primary ${ posts.length > 0 ? '' : 'mb-3'}`}><i className="bi bi-plus"></i> Add Post</Link>) }
							{
								posts.length > 0 ? (
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

				            <CollapsibleTable
				            	data={currentItems}
				                currentPage={currentPage}
				                itemsPerPage={itemsPerPage}
		    					sortConfig={sortConfig}
		                        onSort={handleSort}
				            />

				            {
				            	posts.length > 0 ? (
						            <div className="d-flex justify-content-between">
										<div>
											{ posts && sortedAndFilteredItems.length > 0 &&  (<p>Showing <strong>{indexOfFirstItem+1}</strong> to <strong>{Math.min(indexOfLastItem, sortedAndFilteredItems.length)}</strong> of <strong>{sortedAndFilteredItems.length}</strong> entries</p>) }
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
					            ) : (
					            	null
					            )
				            }
			            </article>

		            </div>
	            </section>
	        </main>
	    )
    } else {
    	return <Navigate to="/unauthorized" replace={true} />
    }
};

export default Posts;
