import React, { useState } from 'react';
import { useAuth } from './../../../contexts/AuthContext';

const CollapsibleRow = ({ data, currentPage, itemsPerPage, index, handleViewDetailPhoto, handleEditPhoto, handleDeletePhoto, allAlbums }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const toggleExpand = () => setIsExpanded(!isExpanded);
    const { hasPermission } = useAuth();
    // const albumTitle = allAlbums?.find(album => album.id === data.album_id)?.atitle || null;
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
        		<td>{new Date(data.created_at).toLocaleDateString()}</td>
                <td rowSpan={isExpanded ? expandedRowCount : null}>
                    <i className={`bi ${isExpanded ? 'bi-chevron-left' : 'bi-chevron-down'}`} onClick={toggleExpand}></i>
                </td>
            </tr>
			{ isExpanded && detailRows }
        </React.Fragment>
    );
};

const CollapsibleTable = ({ data, currentPage, itemsPerPage, sortConfig, onSort, handleViewDetailPhoto, handleEditPhoto, handleDeletePhoto, allAlbums }) => {
	const getSortIcon = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'asc' ? 'bi-chevron-up' : 'bi-chevron-down';
        }
        return 'bi-chevron-down';
    };

    return (
        <table className="table table-responsive-md table-hover table-striped table-bordered">
            {
            	data.length > 0 && (
	                <thead className="table-dark">
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
	                        <th onClick={() => onSort('created_at')}>Created At
	                            <i className={`float-end bi ${getSortIcon('created_at')}`}></i>
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
                                allAlbums={allAlbums}
	                        />
	                    ))
                    ) : (
                    	<tr>
                    		<td colSpan="6" className="text-center">No data to show</td>
                    	</tr>
                    )
                }
            </tbody>
        </table>
    );
};

export default CollapsibleTable;

/*
<React.Fragment>
    <tr>
        <td rowSpan={isExpanded ? expandedRowCount : null}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
        <td>
            <Link to={`/dashboard/galleries/${data.seotitle}`} className="text-decoration-none text-dark">{data.title}</Link>
        </td>
        <td>{albumTitle}</td>
        <td>{data.picture}</td>
        <td>{data.created_at}</td>
        <td className="text-center">
            <button onClick={toggleExpand} className="btn btn-sm btn-link text-dark">
                <i className={`bi bi-chevron-${isExpanded ? 'up' : 'down'}`}></i>
            </button>
        </td>
    </tr>
    {isExpanded && (
        <tr className="detail-row">
            <td colSpan="6">
                <div className="p-3">
                    <h6 className="mt-0">Description</h6>
                    <p>{data.content || 'No description'}</p>
                    <h6>Details</h6>
                    <table className="table table-sm table-bordered">
                        <tbody>
                            <tr>
                                <th>Created By</th>
                                <td>{data.name || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th>Last Update</th>
                                <td>{data.updated_at ? new Date(data.updated_at).toLocaleDateString() : 'N/A'}</td>
                            </tr>
                            <tr>
                                <th>Actions</th>
                                <td>
                                    <div className="btn-group" role="group">
                                        { hasPermission('read-galleries') && (<button type="button" onClick={() => handleViewDetailPhoto(data)} className="text-white btn btn-sm btn-success"><i className="bi bi-eye"></i></button>)}
                                        { hasPermission('update-galleries') && (<button type="button" onClick={() => handleEditPhoto(data)} className="text-white btn btn-sm btn-warning"><i className="bi bi-pencil"></i></button>)}
                                        { hasPermission('delete-galleries') && (<button type="button" onClick={() => handleDeletePhoto(data.id)} className="text-white btn btn-sm btn-danger"><i className="bi bi-trash"></i></button>)}
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </td>
        </tr>
    )}
</React.Fragment>
*/
