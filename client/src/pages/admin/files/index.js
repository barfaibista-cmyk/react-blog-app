import React, { useState } from 'react';
import axios from 'axios';
import Breadcrumb from './../../../components/dashboard/Breadcrumb';

const Files = () => {
	const [selectedFile, setSelectedFile] = useState(null);
	const [userId, setUserId] = useState('');

	const handleFileChange = (event) => {
		setSelectedFile(event.target.files[0]);
	};

	const handleUserIdChange = (event) => {
		setUserId(event.target.value);
	};

	const handleUpload = async () => {
		if (!selectedFile || !userId) {
		    alert('Please select a file and enter a user ID.');
		    return;
		}

		const formData = new FormData();
		formData.append('userId', userId);
		formData.append('file', selectedFile);

		try {
		    const response = await axios.post('http://localhost:3001/api/upload', formData, {
			    headers: {
			      'Content-Type': 'multipart/form-data',
			    },
		    });
		    alert(response.data);
		} catch (error) {
		    console.error('Error uploading file:', error);
		    alert('File upload failed.');
		}
	};

	return (
   		<main className="main">
	  		<Breadcrumb />
			<section id="starter-section" className="starter-section section">
				<div className="container-fluid">

					<article className="article">
						<h3>File Manager</h3>

						<div className="form-group mb-3">
							<input type="text" className="form-control" placeholder="Enter User ID" value={userId} name="userId" onChange={handleUserIdChange} />
						</div>
                        <div className="form-group mb-3">
                            <input type="file" className="form-control" name="file" onChange={handleFileChange} />
                        </div>
                        <button type="button" className="btn btn-primary" onClick={handleUpload}>Upload File</button>
					</article>
				</div>
			</section>
		</main>
	)
}

export default Files;
