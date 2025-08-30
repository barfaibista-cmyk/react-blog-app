import { Link } from 'react-router-dom';

const ViewList = ({ allAlbums, allPhotos, handleEditAlbum, handleDeleteAlbum }) => {
	return (
		<div className="row">
            {
            	allAlbums.length > 0 || allPhotos.length > 0 ? (
	                allAlbums.map((album, idx) => {
	                    const thumbnailPhoto = allPhotos.find(photo => photo.album_id === album.id);
	                    const thumbnailUrl = thumbnailPhoto ? `http://localhost:3001/api/images/${album.seotitle}/${thumbnailPhoto.picture}` : `http://localhost:3001/api/images/default-150x150.png`;

	                    return (
	                        <div key={idx} className="col-md-4 mb-3">
                                <div className="card">
                                    <div className="position-relative">
	                                    <div className="position-absolute top-0 end-0">
	                                        <button type="button" className="m-1 btn btn-warning" onClick={() => handleEditAlbum(album)}><i className="bi bi-pencil"></i></button>
	                                        <button type="button" className="m-1 btn btn-danger" onClick={() => handleDeleteAlbum(album.id)}><i className="bi bi-trash"></i></button>
	                                    </div>
                                    	<img src={thumbnailUrl} alt={album.title} className="card-img-top" height="150" width="150"/>
                                    </div>
                                    <div className="card-body">
                                    	<Link to={`/dashboard/galleries/${album.seotitle}`} state={album}>
                                    		<p className="card-text"><strong>{album.title}</strong></p>
                                		</Link>
                                    </div>
                                </div>
	                        </div>
	                    );
	                })
                ) : (
                	<p className="text-center">No data to show</p>
                )
            }
        </div>
	)
}

export default ViewList;
