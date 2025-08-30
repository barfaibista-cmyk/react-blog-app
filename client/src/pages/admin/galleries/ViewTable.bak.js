import React, { useState } from 'react';
import { useAuth } from './../../../contexts/AuthContext';

const CollapsibleRow = ({ data, currentPage, itemsPerPage, index, handleViewDetailPhoto, handleEditPhoto, handleDeletePhoto }) => {
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
					{ hasPermission('read-galleries') && (<button type="button" onClick={() => handleViewDetailPhoto(data)} className="text-white btn btn-sm btn-success"><i className="bi bi-eye"></i></button>)}
	        		{ hasPermission('update-galleries') && (<button type="button" onClick={() => handleEditPhoto(data)} className="text-white btn btn-sm btn-warning"><i className="bi bi-pencil"></i></button>)}
	                { hasPermission('delete-galleries') && (<button type="button" onClick={() => handleDeletePhoto(data.id)} className="text-white btn btn-sm btn-danger"><i className="bi bi-trash"></i></button>)}
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
                <td>{data.atitle}</td>
                <td>{data.picture}</td>
                <td rowSpan={isExpanded ? expandedRowCount : null}>
                    <i className={`bi ${isExpanded ? 'bi-chevron-left' : 'bi-chevron-down'}`} onClick={toggleExpand}></i>
                </td>
            </tr>
			{ isExpanded && detailRows }
        </React.Fragment>
    );
};

const CollapsibleTable = ({ data, currentPage, itemsPerPage, sortConfig, onSort, handleViewDetailPhoto, handleEditPhoto, handleDeletePhoto }) => {
	const getSortIcon = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'asc' ? 'bi-chevron-up' : 'bi-chevron-down';
        }
        return 'bi-chevron-down';
    };

    return (
        <table className="table table-striped table-bordered">
        	{
        		data.length > 0 && (
		            <thead>
		                <tr>
		                    <th>#</th>
		                    <th onClick={() => onSort('title')}>Title
								<i className={`float-end bi ${getSortIcon('title')}`}></i>
		                    </th>
		                    <th onClick={() => onSort('album')}>Album
								<i className={`float-end bi ${getSortIcon('album')}`}></i>
		                    </th>
		                    <th onClick={() => onSort('picture')}>Picture
								<i className={`float-end bi ${getSortIcon('picture')}`}></i>
		                    </th>
		                    <th>...</th>
		                </tr>
		            </thead>
        		)
        	}
            <tbody>
                {
                	data.length > 0 ? (
	                    data.map((item, idx) => (
	                        <CollapsibleRow
	                        	key={idx}
	                        	data={item}
	                        	index={idx}
				                currentPage={currentPage}
				                itemsPerPage={itemsPerPage}
	                        	handleViewDetailPhoto={handleViewDetailPhoto}
	                        	handleEditPhoto={handleEditPhoto}
	                        	handleDeletePhoto={handleDeletePhoto}
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
