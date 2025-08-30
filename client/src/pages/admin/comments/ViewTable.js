import React, { useState } from 'react';
import { useAuth } from './../../../contexts/AuthContext';

const CollapsibleRow = ({ data, currentPage, itemsPerPage, index, handleViewDetailComment, handleEditComment, handleDeleteComment }) => {
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
                    {data.active === 'Y' ? 'Active' : 'Inactive'}
                </div>
            </td>
        </tr>,
        <tr key="status">
            <th>Status</th>
            <td colSpan="3">
                <div>
                    {data.status === 'Y' ? 'Active' : 'Inactive'}
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
					{ hasPermission('read-comments') && (
						<button type="button" onClick={() => handleViewDetailComment(data)} className="text-white btn btn-sm btn-success"><i className="bi bi-eye"></i></button>) }
					{ hasPermission('update-comments') && (
	        		<button type="button" onClick={() => handleEditComment(data)} className="text-white btn btn-sm btn-warning"><i className="bi bi-pencil"></i></button>) }
					{ hasPermission('delete-comments') && (
	                	<button type="button" onClick={() => handleDeleteComment(data.id)} className="text-white btn btn-sm btn-danger"><i className="bi bi-trash"></i></button>) }
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
                <td>{data.email}</td>
                <td rowSpan={isExpanded ? expandedRowCount : null}>
                    <i className={`bi ${isExpanded ? 'bi-chevron-left' : 'bi-chevron-down'}`} onClick={toggleExpand}></i>
                </td>
            </tr>
			{ isExpanded && detailRows }
        </React.Fragment>
    );
};

const CollapsibleTable = ({ data, currentPage, itemsPerPage, sortConfig, onSort, handleViewDetailComment, handleEditComment, handleDeleteComment }) => {
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
		                    <th onClick={() => onSort('name')}>Name
								<i className={`float-end bi ${getSortIcon('name')}`}></i>
		                    </th>
		                    <th onClick={() => onSort('email')}>Email
								<i className={`float-end bi ${getSortIcon('email')}`}></i>
		                    </th>
		                    <th>...</th>
		                </tr>
		            </thead>
        		) : (null)
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
	                        	handleViewDetailComment={handleViewDetailComment}
	                        	handleEditComment={handleEditComment}
	                        	handleDeleteComment={handleDeleteComment}
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

export default CollapsibleTable;
