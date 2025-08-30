import axios from 'axios';
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
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
        <tr key="createdAt">
            <th>Created At</th>
            <td colSpan="2">
                <div>
                    {new Date(data.created_at).toLocaleDateString()}
                </div>
            </td>
        </tr>,
        <tr key="actions">
            <th>Actions</th>
            <td colSpan="2">
            	<div className="btn-group" role="group">
	            	{ hasPermission('read-users') && (
	        			<Link to={`/dashboard/users/${data.id}`} state={data} className="text-white btn btn-sm btn-success"><i className="bi bi-eye"></i></Link>
	        		) }
	            	{ hasPermission('update-users') && (
	       				<Link to={`/dashboard/users/write?edit=${data.id}`} state={data} className="text-white btn btn-sm btn-warning"><i className="bi bi-pencil"></i></Link>) }
	            	{ hasPermission('update-roles') && (
	                	<Link to={`/dashboard/roles/write?edit=${data.id}`}  state={data} className="text-white btn btn-sm btn-primary"><i className="bi bi-lock-fill"></i></Link>) }
	            	{ hasPermission('delete-users') && (
            				<Link to="" className="text-white btn btn-sm btn-danger"><i className="bi bi-trash"></i></Link>) }
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
                <td>{data.username}</td>
                <td>{data.email}</td>
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
            <thead>
                <tr>
                    <th>#</th>
                    <th onClick={() => onSort('name')}>Name
						<i className={`float-end bi ${getSortIcon('name')}`}></i>
                    </th>
                    <th onClick={() => onSort('username')}>Username
						<i className={`float-end bi ${getSortIcon('username')}`}></i>
                    </th>
                    <th onClick={() => onSort('email')}>Email
						<i className={`float-end bi ${getSortIcon('email')}`}></i>
                    </th>
                    <th>...</th>
                </tr>
            </thead>
            <tbody>
                {
                    data.map((item, idx) => (
                        <CollapsibleRow
                        	key={idx}
                        	data={item}
			                currentPage={currentPage}
			                itemsPerPage={itemsPerPage}
                        	index={idx}
                        	targetData={data}
                        />
                    ))
                }
            </tbody>
        </table>
    );
}

const Users = () => {
	const { hasPermission } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const indexOfLastItem = parseInt(currentPage) * parseInt(itemsPerPage);
    const indexOfFirstItem = parseInt(indexOfLastItem) - parseInt(itemsPerPage);
	const [query, setQuery] = useState('');
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

	const [users, setUsers] = useState([]);
	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const resp = await axios.get('/api/users');
				setUsers(resp.data);
			} catch(err) {
				console.log(err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		}
		fetchUsers();
	},[users]);

	const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

	const sortedAndFilteredItems = useMemo(() => {
        let sortableItems = [...users];

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
    }, [users, query, sortConfig]);

	const currentItems = sortedAndFilteredItems.slice(indexOfFirstItem, indexOfLastItem);
    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
	const handleSearch = (evt) => {
		setQuery(evt.target.value);
		setCurrentPage(1);
	}

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

    return (
   		<main className="main">
	  		<Breadcrumb />
			<section id="starter-section" className="starter-section section">
				<div className="container-fluid">
					<article className="article">
	                	{
	                		hasPermission('create-users') && (
				    			<Link to="/dashboard/users/write" className="mb-3 text-white btn btn-primary"><i className="bi bi-plus"></i> Add User</Link>
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
	                        targetData={currentItems}
			            />

			            <div className="d-flex justify-content-between">
							<div>
								{ users && sortedAndFilteredItems.length > 0 &&  (<p>Showing <strong>{indexOfFirstItem+1}</strong> to <strong>{Math.min(indexOfLastItem, sortedAndFilteredItems.length)}</strong> of <strong>{sortedAndFilteredItems.length}</strong> entries</p>) }
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
		            </article>

	            </div>
            </section>
        </main>
    );
};

export default Users;
