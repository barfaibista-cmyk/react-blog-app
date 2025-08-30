import React, { useState } from 'react';

const ExampleForm = () => {
    const [ formData, setFormData ] = useState({
        fullname: '',
        email: '',
        comments: '',
        programming: [],
        gender: '',
        favColor: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if(type === 'checkbox') {
			if(checked) {
				setFormData({
					...formData, 
					[name]: [...formData[name], value]
				})
			} else {
				setFormData({
					...formData, 
					[name]: formData[name].filter(item => item !== value)
				})
			}
        } else if(type === 'radio') {
			setFormData({
				...formData, 
				[name]: value
			})
        } else {
			setFormData({
				...formData, 
				[name]: value
			})			
        }
    }
    
    return (
		<div className="container py-5">
	        <form>
				<div className="mb-2 form-group">
					<label htmlFor="fullname" className="form-label">Fullname</label>
					<input type="text" id="fullname" name="fullname" value={formData.fullname} onChange={handleChange} placeholder="Fullname" className="form-control" />
				</div>

				<div className="mb-2 form-group">
					<label htmlFor="fullname" className="form-label">Email</label>
					<input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="form-control" />
				</div>

				<div className="row">
					<div className="col-md-6 mb-2 form-group">
						<p>Programming Language</p>
						<div className="form-check">
							<label htmlFor="javascript">JavaScript</label>
							<input type="checkbox" name="programming" id="javascript" className="form-check-input" value="javascript" onChange={handleChange} checked={formData.programming.includes('javascript')} />
						</div>
						<div className="form-check">
							<label htmlFor="php">PHP</label>
							<input type="checkbox" name="programming" id="php" className="form-check-input" value="php" onChange={handleChange} checked={formData.programming.includes('php')} />
						</div>
						<div className="form-check">
							<label htmlFor="ruby">Ruby</label>
							<input type="checkbox" name="programming" id="ruby" className="form-check-input" value="ruby" onChange={handleChange} checked={formData.programming.includes('ruby')} />
						</div>
						<div className="form-check">
							<label htmlFor="go">Go</label>
							<input type="checkbox" name="programming" id="go" className="form-check-input" value="go" onChange={handleChange} checked={formData.programming.includes('go')} />
						</div>
						<div className="form-check">
							<label htmlFor="java">Java</label>
							<input type="checkbox" name="programming" id="java" className="form-check-input" value="java" onChange={handleChange} checked={formData.programming.includes('java')} />
						</div>
						<div className="form-check">
							<label htmlFor="c++">C++</label>
							<input type="checkbox" name="programming" id="c++" className="form-check-input" value="c++" onChange={handleChange} checked={formData.programming.includes('c++')} />
						</div>
						<div className="form-check">
							<label htmlFor="c#">C#</label>
							<input type="checkbox" name="programming" id="c#" className="form-check-input" value="c#" onChange={handleChange} checked={formData.programming.includes('c#')} />
						</div>
						<div className="form-check">
							<label htmlFor="python">Python</label>
							<input type="checkbox" name="programming" id="python" className="form-check-input" value="python" onChange={handleChange} checked={formData.programming.includes('python')} />
						</div>
					</div>

					<div className="col-md-6 mb-2 form-group">
						<p>Gender</p>
						<div className="form-check">
							<input type="radio" name="gender" id="male" checked={formData.gender === 'male'} value="male" onChange={handleChange} />{' '}
							<label htmlFor="male" className="form-check-label">Male</label>
						</div>
						<div className="form-check">
							<input type="radio" name="gender" id="female" checked={formData.gender === 'female'} value="female" onChange={handleChange} />{' '}
							<label htmlFor="female" className="form-check-label">Female</label>
						</div>
						<div className="form-check">
							<input type="radio" name="gender" id="other" checked={formData.gender === 'other'} value="other" onChange={handleChange} />{' '}
							<label htmlFor="other" className="form-check-label">Other</label>
						</div>
					</div>
				</div>

				<div className="mb-2 form-group">
					<label htmlFor="favColor" className="form-label">Favourite Color</label>
		            <select name="favColor" id="favColor" className="form-select" onChange={handleChange}>
		                <option value="">-- Choose Color --</option>
		                <option value="red">Red</option>
		                <option value="green">Green</option>
		                <option value="blue">Blue</option>
		                <option value="yellow">Yellow</option>
		                <option value="brown">Brown</option>
		            </select>
	            </div>

				<div className="mb-2 form-group">
					<label htmlFor="comments" className="form-label">Comments</label>
					<textarea name="comments" id="comments" value={formData.comments} onChange={handleChange} placeholder="Comments" className="form-control" />
	            </div>
	            <button type="button" className="btn btn-primary">Submit</button>
	        </form>

			<div className="container py-5">
				<p>{JSON.stringify(formData)}</p>
			</div>
        </div>
    )
}

export default ExampleForm;
