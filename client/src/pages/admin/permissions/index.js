import axios from 'axios';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Breadcrumb from './../../../components/dashboard/Breadcrumb';
import Pagination from './../../../components/dashboard/Pagination';
import Spinner from './../../../components/dashboard/Spinner';
import Select from 'react-select';
import PermissionModal from './PermissionModal';
import PermissionDetailModal from './PermissionDetailModal';
import { useAuth } from './../../../contexts/AuthContext';

const CollapsibleRow = ({ data, currentPage, itemsPerPage, index, handleViewDetailPermission, handleEditPermission, handleDeletePermission }) => {
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
                	{
                		hasPermission('read-permissions') && (
                    		<button type="button" state={data} className="text-white btn btn-sm btn-success" onClick={() => handleViewDetailPermission(data)}><i className="bi bi-eye"></i></button>
                    	)
                    }
                	{
                		hasPermission('update-permissions') && (
                    		<button type="button" state={data} className="text-white btn btn-sm btn-warning" onClick={() => handleEditPermission(data)}><i className="bi bi-pencil"></i></button>
                    	)
                    }
                    {
                		hasPermission('delete-permissions') && (
                    		<button type="button" className="text-white btn btn-sm btn-danger" onClick={() => handleDeletePermission(data.id)}><i className="bi bi-trash"></i></button>
						)
                    }
                </div>
            </td>
        </tr>
	];
	const expandedRowCount = detailRows.length + 1;
    return (
        <React.Fragment>
            <tr>
                <td rowSpan={isExpanded ? expandedRowCount : null}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{data.name}</td>
                <td>{data.description}</td>
                <td rowSpan={isExpanded ? expandedRowCount : null}>
                    <i className={`bi ${isExpanded ? 'bi-chevron-left' : 'bi-chevron-down'}`} onClick={toggleExpand}></i>
                </td>
            </tr>
			{ isExpanded && detailRows }
        </React.Fragment>
    );
};

const CollapsibleTable = ({ data, currentPage, itemsPerPage, sortConfig, onSort, handleViewDetailPermission, handleEditPermission, handleDeletePermission }) => {
	const getSortIcon = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'asc' ? 'bi-chevron-up' : 'bi-chevron-down';
        }
        return 'bi-chevron-down';
    };

    return (
        <table className="table table-striped table-bordered">
            <thead>
                <tr>
                    <th>#</th>
                    <th onClick={() => onSort('name')}>Name
						<i className={`float-end bi ${getSortIcon('name')}`}></i>
                    </th>
                    <th onClick={() => onSort('description')}>Description
						<i className={`float-end bi ${getSortIcon('description')}`}></i>
                    </th>
                    <th>...</th>
                </tr>
            </thead>
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
	                        	handleViewDetailPermission={handleViewDetailPermission}
	                        	handleEditPermission={handleEditPermission}
	                        	handleDeletePermission={handleDeletePermission}
	                        />
                    	))
                    ) : (
                    	<tr>
                    		<td colSpan="4" className="text-center">No data to show</td>
                    	</tr>
                    )
                }
            </tbody>
        </table>
    );
}

const Permissions = () => {
	const { hasPermission } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const indexOfLastItem = parseInt(currentPage) * parseInt(itemsPerPage);
    const indexOfFirstItem = parseInt(indexOfLastItem) - parseInt(itemsPerPage);
	const [query, setQuery] = useState('');
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

	const [permissions, setPermissions] = useState([]);
	useEffect(() => {
		const fetchPermissions = async () => {
			try {
				const resp = await axios.get('/api/permissions');
				setPermissions(resp.data);
			} catch(err) {
				console.log(err);
				setError(err.message);
			} finally {
				setIsLoading(false);
			}
		}
		fetchPermissions();
	},[permissions]);

	const sortedAndFilteredItems = useMemo(() => {
        let sortableItems = [...permissions];
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
    }, [permissions, query, sortConfig]);

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

    const [showModal, setShowModal] = useState(false);
    const [currentPermission, setCurrentPermission] = useState(null);
    const [message, setMessage] = useState('');

	const [permissionDetail, setPermissionDetail] = useState({});
	const [showPermissionDetailModal, setShowPermissionDetailModal] = useState(false);

    const handleViewDetailPermission = (permission) => {
        setPermissionDetail(permission);
        setShowPermissionDetailModal(true);
        setMessage('');
        setError('');
    };

    const handleAddPermission = () => {
        setCurrentPermission(null);
        setShowModal(true);
        setMessage('');
        setError('');
    };

    const handleEditPermission = (permission) => {
        setCurrentPermission(permission);
        setShowModal(true);
        setMessage('');
        setError('');
    };

    const handleDeletePermission = (id) => {
        if (window.confirm('Are you sure want to delete this permission?')) {
            setIsLoading(true);
            setMessage('');
            setError('');
            setTimeout(() => {
                setPermissions(permissions.filter(permission => permission.id !== id));
                setMessage('Permission has been deleted successfully!');
                setIsLoading(false);
            }, 300);
        }
    };

    const handleSubmitPermission = (permissionData) => {
        setIsLoading(true);
        setMessage('');
        setError('');

        setTimeout(() => {
            if (permissionData.id) {
                setPermissions(permissions.map(permission =>
                    permission.id === permissionData.id ? permissionData : permission
                ));
                setMessage('Permission has been uodated succesafully!');
            } else {
                const newId = (permissions.length > 0 ? Math.max(...permissions.map(a => parseInt(a.id))) + 1 : 1).toString();
                setPermissions([...permissions, { ...permissionData, id: newId }]);
                setMessage('Permission has been created successfully!');
            }
            setShowModal(false);
            setIsLoading(false);
        }, 500);
    };

    const handleCloseModal = useCallback(() => {
        setShowModal(false);
        setCurrentPermission(null);
        setError('');
    }, []);

	const handleClosePermissionDetailModal = useCallback(() => {
        setShowPermissionDetailModal(false);
        setPermissionDetail(null);
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

	if(hasPermission('read-permissions')) {
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
						{
							hasPermission('create-permissions') && (
				    			<button type="button" className="text-white btn btn-primary" onClick={handleAddPermission}><i className="bi bi-plus"></i> Add Permission</button>
			    			)
		    			}

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

				            <CollapsibleTable
				            	data={currentItems}
				                currentPage={currentPage}
				                itemsPerPage={itemsPerPage}
		    					sortConfig={sortConfig}
		                        onSort={handleSort}
		                        handleViewDetailPermission={handleViewDetailPermission}
		                        handleEditPermission={handleEditPermission}
		                        handleDeletePermission={handleDeletePermission}
				            />

				            <div className="d-flex justify-content-between">
								<div>
									{ permissions && sortedAndFilteredItems.length > 0 &&  (<p>Showing <strong>{indexOfFirstItem+1}</strong> to <strong>{Math.min(indexOfLastItem, sortedAndFilteredItems.length)}</strong> of <strong>{sortedAndFilteredItems.length}</strong> entries</p>) }
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

				            <PermissionModal
				                show={showModal}
				                onClose={handleCloseModal}
				                onSubmit={handleSubmitPermission}
				                permissionData={currentPermission}
				            />

				            <PermissionDetailModal
				                show={showPermissionDetailModal}
				                onClose={handleClosePermissionDetailModal}
				                permissionData={permissionDetail}
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

export default Permissions;
