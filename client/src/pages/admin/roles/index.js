import axios from 'axios';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import Breadcrumb from './../../../components/dashboard/Breadcrumb';
import Pagination from './../../../components/dashboard/Pagination';
import Spinner from './../../../components/dashboard/Spinner';
import Select from 'react-select';
import RoleModal from './RoleModal';
import RoleDetailModal from './RoleDetailModal';
import { useAuth } from './../../../contexts/AuthContext';

const CollapsibleRow = ({ data, currentPage, itemsPerPage, index, handleViewDetailRole, handleEditRole, handleDeleteRole }) => {
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
					{ hasPermission('read-roles') && (
						<button type="button" onClick={() => handleViewDetailRole(data)} className="text-white btn btn-sm btn-success"><i className="bi bi-eye"></i></button>) }
					{ hasPermission('update-roles') && (
	        		<button type="button" onClick={() => handleEditRole(data)} className="text-white btn btn-sm btn-warning"><i className="bi bi-pencil"></i></button>) }
					{ hasPermission('delete-roles') && (
	                	<button type="button" onClick={() => handleDeleteRole(data.id)} className="text-white btn btn-sm btn-danger"><i className="bi bi-trash"></i></button>) }
                	</div>
            </td>
        </tr>
	];
	const expandedRowCount = detailRows.length + 1;
    return (
        <React.Fragment>
            <tr>
                <td rowSpan={isExpanded ? expandedRowCount : null}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{`${data.name[0].toUpperCase()+data.name.slice(1)}`}</td>
                <td>{data.description}</td>
                <td rowSpan={isExpanded ? expandedRowCount : null}>
                    <i className={`bi ${isExpanded ? 'bi-chevron-left' : 'bi-chevron-down'}`} onClick={toggleExpand}></i>
                </td>
            </tr>
			{ isExpanded && detailRows }
        </React.Fragment>
    );
};

const CollapsibleTable = ({ data, currentPage, itemsPerPage, sortConfig, onSort, handleViewDetailRole, handleEditRole, handleDeleteRole }) => {
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
		                    <th onClick={() => onSort('rolename')}>Role/Group
								<i className={`float-end bi ${getSortIcon('rolename')}`}></i>
		                    </th>
		                    <th onClick={() => onSort('description')}>Description
								<i className={`float-end bi ${getSortIcon('description')}`}></i>
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
	                        	handleViewDetailRole={handleViewDetailRole}
	                        	handleEditRole={handleEditRole}
	                        	handleDeleteRole={handleDeleteRole}
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

const Roles = () => {
	const { hasPermission } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const indexOfLastItem = parseInt(currentPage) * parseInt(itemsPerPage);
    const indexOfFirstItem = parseInt(indexOfLastItem) - parseInt(itemsPerPage);
	const [query, setQuery] = useState('');
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	const [roles, setRoles] = useState([]);
	useEffect(() => {
		const fetchRoles = async () => {
			try {
				const resp = await axios.get('/api/roles');
				setRoles(resp.data);
			} catch(err) {
				console.log(err);
				setError(err.message);
			} finally {
				setIsLoading(false);
			}
		}
		fetchRoles();
	},[roles]);

	const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
	const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

	const sortedAndFilteredItems = useMemo(() => {
        let sortableItems = [...roles];
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
    }, [roles, query, sortConfig]);

	const currentItems = sortedAndFilteredItems.slice(indexOfFirstItem, indexOfLastItem);
    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
	const handleSearch = (evt) => {
		setQuery(evt.target.value);
		setCurrentPage(1);
	}

    const [showModal, setShowModal] = useState(false);
    const [currentRole, setCurrentRole] = useState(null);
    const [message, setMessage] = useState('');

	const [roleDetail, setRoleDetail] = useState({});
	const [showRoleDetailModal, setShowRoleDetailModal] = useState(false);

    const handleViewDetailRole = (role) => {
        setRoleDetail(role);
        setShowRoleDetailModal(true);
        setMessage('');
        setError('');
    };

    const handleAddRole = () => {
        setCurrentRole(null);
        setShowModal(true);
        setMessage('');
        setError('');
    };

    const handleEditRole = (role) => {
        setCurrentRole(role);
        setShowModal(true);
        setMessage('');
        setError('');
    };

    const handleDeleteRole = (id) => {
        if (window.confirm('Are you sure want to delete this role?')) {
            setIsLoading(true);
            setMessage('');
            setError('');
            setTimeout(() => {
                setRoles(roles.filter(role => role.id !== id));
                setMessage('Role has been deleted successfully!');
                setIsLoading(false);
            }, 300);
        }
    };

    const handleSubmitRole = (roleData) => {
        setIsLoading(true);
        setMessage('');
        setError('');

        setTimeout(() => {
            if (roleData.id) {
                setRoles(roles.map(role =>
                    role.id === roleData.id ? roleData : role
                ));
                setMessage('Role has been updated succesafully!');
            } else {
                const newId = (roles.length > 0 ? Math.max(...roles.map(a => parseInt(a.id))) + 1 : 1).toString();
                setRoles([...roles, { ...roleData, id: newId }]);
                setMessage('Role has been created successfully!');
            }
            setShowModal(false);
            setIsLoading(false);
        }, 500);
    };

    const handleCloseModal = useCallback(() => {
        setShowModal(false);
        setCurrentRole(null);
        setError('');
    }, []);

	const handleCloseRoleDetailModal = useCallback(() => {
        setShowRoleDetailModal(false);
        setRoleDetail(null);
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

	if(hasPermission('read-roles')) {
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
							{ hasPermission('create-roles') && (
				    			<button type="button" onClick={handleAddRole} className={`text-white btn btn-primary ${roles.length > 0 ? '' : 'mb-3'}`}><i className="bi bi-plus"></i> Add Role</button>) }
				            {
	                    		roles.length > 0 ? (
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
	                        	handleViewDetailRole={handleViewDetailRole}
	                        	handleEditRole={handleEditRole}
	                        	handleDeleteRole={handleDeleteRole}
				            />

				            {
	                    		roles.length > 0 ? (
						            <div className="d-flex justify-content-between">
										<div>
											{ roles && sortedAndFilteredItems.length > 0 &&  (<p>Showing <strong>{indexOfFirstItem+1}</strong> to <strong>{Math.min(indexOfLastItem, sortedAndFilteredItems.length)}</strong> of <strong>{sortedAndFilteredItems.length}</strong> entries</p>) }
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

				            <RoleModal
				                show={showModal}
				                onClose={handleCloseModal}
				                onSubmit={handleSubmitRole}
				                roleData={currentRole}
				            />

				            <RoleDetailModal
				                show={showRoleDetailModal}
				                onClose={handleCloseRoleDetailModal}
				                roleData={roleDetail}
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

export default Roles;
