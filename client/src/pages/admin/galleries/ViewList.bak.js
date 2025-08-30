import { Link } from 'react-router-dom';

const ViewList = ({ allAlbums, allPhotos }) => {
	return (
		<div className="row">
            {
            	allAlbums.length > 0 || allPhotos.length > 0 ? (
	                allAlbums.map((album, idx) => {
	                    const thumbnailPhoto = allPhotos.find(photo => photo.album_id === album.id);
	                    const thumbnailUrl = thumbnailPhoto ? `../../../upload/${album.seotitle}/${thumbnailPhoto.picture}` : '../../../upload/default-150x150.png';

	                    return (
	                        <div key={idx} className="col-md-3 mb-3">
	                        	<Link to={`/dashboard/galleries/${album.seotitle}`} state={album}>
	                                <div className="card">
	                                    <img src={thumbnailUrl} alt={album.title} className="card-img-top" />
	                                    <div className="card-body">
	                                        <p className="card-text"><strong>{album.title}</strong></p>
	                                    </div>
	                                </div>
	                            </Link>
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
