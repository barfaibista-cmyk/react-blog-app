import { useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
	useLayoutEffect(() => {
		document.body.classList.remove('login-page');
		document.body.classList.remove('bg-body-secondary');
	},[])

	const [ key, setKey ] = useState('tab-1');
	return (
		<>
			{/* <!-- Hero Section --> */}
			<section id="hero" className="hero section dark-background">

			    <img src="/img/hero-bg.jpg" alt="" data-aos="fade-in" />

			    <div className="container text-center" data-aos="zoom-out" data-aos-delay="100">
			        <div className="row justify-content-center">
			            <div className="col-lg-8">
			                <h2>Welcome to Our Serenity</h2>
			                <p>
			                    We are team of talented designers making websites with Bootstrap
			                </p>
			                <Link to="pages/about" className="btn-get-started">Get Started</Link>
			            </div>
			        </div>
			    </div>

			</section>
			{/* <!-- /Hero Section --> */}

			{/* <!-- About Section --> */}
			<section id="about" className="about section">

			    {/* <!-- Section Title --> */}
			    <div className="container section-title" data-aos="fade-up">
			        <h2>About</h2>
			        <p>
			            Rerum debitis facere soluta tenetur. Iure molestiae assumenda sunt qui inventore eligendi voluptates nisi
			        </p>
			    </div>
			    {/* <!-- End Section Title --> */}

			    <div className="container" data-aos="fade-up">

			        <div className="row g-4 g-lg-5" data-aos="fade-up" data-aos-delay="200">

			            <div className="col-lg-5">
			                <div className="about-img">
			                    <img src="/img/about-portrait.jpg" className="img-fluid" alt="" />
			                </div>
			            </div>

						<div className="col-lg-7">
			                <h3 className="pt-0 pt-lg-5">Neque officiis dolore maiores et exercitationem quae est seda lidera pat claero</h3>

			                <ul className="nav nav-pills mb-3">
			                    <li><Link className={`nav-link ${key === 'tab-1' ? 'nav-active' : ''}`} data-bs-toggle="pill" to="#tab1" onClick={() => setKey('tab-1')}>Saepe fuga</Link></li>
			                    <li><Link className={`nav-link ${key === 'tab-2' ? 'nav-active' : ''}`} data-bs-toggle="pill" to="#tab2" onClick={() => setKey('tab-2')}>Voluptates</Link></li>
			                    <li><Link className={`nav-link ${key === 'tab-3' ? 'nav-active' : ''}`} data-bs-toggle="pill" to="#tab3" onClick={() => setKey('tab-3')}>Corrupti</Link></li>
			                </ul>
			                <div className="tab-content">

			                    <div className={`tab-pane fade ${key === 'tab-1' ? 'active show' : ''}`} id="tab1">
									<h4>Content Tab 1</h4>

						            <p className="fst-italic">
						                Consequuntur inventore voluptates consequatur aut vel et. Eos doloribus expedita. Sapiente atque consequatur minima nihil quae aspernatur quo suscipit voluptatem.
						            </p>

						            <div className="d-flex align-items-center mt-4">
						                <i className="bi bi-check2"></i>
						                <h4>Repudiandae rerum velit modi et officia quasi facilis</h4>
						            </div>
						            <p>
						                Laborum omnis voluptates voluptas qui sit aliquam blanditiis. Sapiente minima commodi dolorum non eveniet magni quaerat nemo et.
						            </p>

						            <div className="d-flex align-items-center mt-4">
						                <i className="bi bi-check2"></i>
						                <h4>Incidunt non veritatis illum ea ut nisi</h4>
						            </div>
						            <p>
						                Non quod totam minus repellendus autem sint velit. Rerum debitis facere soluta tenetur. Iure molestiae assumenda sunt qui inventore eligendi voluptates nisi at. Dolorem quo tempora. Quia et perferendis.
						            </p>

						            <div className="d-flex align-items-center mt-4">
						                <i className="bi bi-check2"></i>
						                <h4>Omnis ab quia nemo dignissimos rem eum quos..</h4>
						            </div>
						            <p>
						                Eius alias aut cupiditate. Dolor voluptates animi ut blanditiis quos nam. Magnam officia aut ut alias quo explicabo ullam esse. Sunt magnam et dolorem eaque magnam odit enim quaerat. Vero error error voluptatem eum.
						            </p>
			                    </div>
			                    <div className={`tab-pane fade ${key === 'tab-2' ? 'active show' : ''}`} id="tab2">
									<h4>Content Tab 2</h4>

						            <p className="fst-italic">
						                Consequuntur inventore voluptates consequatur aut vel et. Eos doloribus expedita. Sapiente atque consequatur minima nihil quae aspernatur quo suscipit voluptatem.
						            </p>

						            <div className="d-flex align-items-center mt-4">
						                <i className="bi bi-check2"></i>
						                <h4>Repudiandae rerum velit modi et officia quasi facilis</h4>
						            </div>
						            <p>
						                Laborum omnis voluptates voluptas qui sit aliquam blanditiis. Sapiente minima commodi dolorum non eveniet magni quaerat nemo et.
						            </p>

						            <div className="d-flex align-items-center mt-4">
						                <i className="bi bi-check2"></i>
						                <h4>Incidunt non veritatis illum ea ut nisi</h4>
						            </div>
						            <p>
						                Non quod totam minus repellendus autem sint velit. Rerum debitis facere soluta tenetur. Iure molestiae assumenda sunt qui inventore eligendi voluptates nisi at. Dolorem quo tempora. Quia et perferendis.
						            </p>

						            <div className="d-flex align-items-center mt-4">
						                <i className="bi bi-check2"></i>
						                <h4>Omnis ab quia nemo dignissimos rem eum quos..</h4>
						            </div>
						            <p>
						                Eius alias aut cupiditate. Dolor voluptates animi ut blanditiis quos nam. Magnam officia aut ut alias quo explicabo ullam esse. Sunt magnam et dolorem eaque magnam odit enim quaerat. Vero error error voluptatem eum.
						            </p>
								</div>
			                    <div className={`tab-pane fade ${key === 'tab-3' ? 'active show' : ''}`} id="tab3">
									<h4>Content Tab 3</h4>

						            <p className="fst-italic">
						                Consequuntur inventore voluptates consequatur aut vel et. Eos doloribus expedita. Sapiente atque consequatur minima nihil quae aspernatur quo suscipit voluptatem.
						            </p>

						            <div className="d-flex align-items-center mt-4">
						                <i className="bi bi-check2"></i>
						                <h4>Repudiandae rerum velit modi et officia quasi facilis</h4>
						            </div>
						            <p>
						                Laborum omnis voluptates voluptas qui sit aliquam blanditiis. Sapiente minima commodi dolorum non eveniet magni quaerat nemo et.
						            </p>

						            <div className="d-flex align-items-center mt-4">
						                <i className="bi bi-check2"></i>
						                <h4>Incidunt non veritatis illum ea ut nisi</h4>
						            </div>
						            <p>
						                Non quod totam minus repellendus autem sint velit. Rerum debitis facere soluta tenetur. Iure molestiae assumenda sunt qui inventore eligendi voluptates nisi at. Dolorem quo tempora. Quia et perferendis.
						            </p>

						            <div className="d-flex align-items-center mt-4">
						                <i className="bi bi-check2"></i>
						                <h4>Omnis ab quia nemo dignissimos rem eum quos..</h4>
						            </div>
						            <p>
						                Eius alias aut cupiditate. Dolor voluptates animi ut blanditiis quos nam. Magnam officia aut ut alias quo explicabo ullam esse. Sunt magnam et dolorem eaque magnam odit enim quaerat. Vero error error voluptatem eum.
						            </p>
			                    </div>	                 
			                </div>

			            </div>

			        </div>

			    </div>

			</section>
			{/* <!-- /About Section --> */}

			{/* <!-- Call To Action Section --> */}
			<section id="call-to-action" className="call-to-action section accent-background">

			    <div className="container">
			        <div className="row justify-content-center" data-aos="zoom-in" data-aos-delay="100">
			            <div className="col-xl-10">
			                <div className="text-center">
			                    <h3>Call To Action</h3>
			                    <p>
			                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
			                    </p>
			                    <Link className="cta-btn text-white" to="#">Call To Action</Link>
			                </div>
			            </div>
			        </div>
			    </div>

			</section>
			{/* <!-- /Call To Action Section --> */}

			{/* <!-- Services Section --> */}
			<section id="services" className="services section">

			    <div className="container">

			        <div className="row gy-4">

			            <div className="col-lg-4 col-md-6 service-item d-flex" data-aos="fade-up" data-aos-delay="100">
			                <div className="icon flex-shrink-0">
			                    <i className="bi bi-briefcase"></i>
			                </div>
			                <div>
			                    <h4 className="title"><Link to="service-details.html" className="stretched-link">Lorem Ipsum</Link></h4>
			                    <p className="description">
			                        Voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident
			                    </p>
			                </div>
			            </div>
			            {/* <!-- End Service Item --> */}

			            <div className="col-lg-4 col-md-6 service-item d-flex" data-aos="fade-up" data-aos-delay="200">
			                <div className="icon flex-shrink-0">
			                    <i className="bi bi-card-checklist"></i>
			                </div>
			                <div>
			                    <h4 className="title"><Link to="service-details.html" className="stretched-link">Dolor Sitema</Link></h4>
			                    <p className="description">
			                        Minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat tarad limino ata
			                    </p>
			                </div>
			            </div>
			            {/* <!-- End Service Item --> */}

			            <div className="col-lg-4 col-md-6 service-item d-flex" data-aos="fade-up" data-aos-delay="300">
			                <div className="icon flex-shrink-0">
			                    <i className="bi bi-bar-chart"></i>
			                </div>
			                <div>
			                    <h4 className="title"><Link to="service-details.html" className="stretched-link">Sed ut perspiciatis</Link></h4>
			                    <p className="description">
			                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur
			                    </p>
			                </div>
			            </div>
			            {/* <!-- End Service Item --> */}

			            <div className="col-lg-4 col-md-6 service-item d-flex" data-aos="fade-up" data-aos-delay="400">
			                <div className="icon flex-shrink-0">
			                    <i className="bi bi-binoculars"></i>
			                </div>
			                <div>
			                    <h4 className="title"><Link to="service-details.html" className="stretched-link">Magni Dolores</Link></h4>
			                    <p className="description">
			                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
			                    </p>
			                </div>
			            </div>
			            {/* <!-- End Service Item --> */}

			            <div className="col-lg-4 col-md-6 service-item d-flex" data-aos="fade-up" data-aos-delay="500">
			                <div className="icon flex-shrink-0">
			                    <i className="bi bi-brightness-high"></i>
			                </div>
			                <div>
			                    <h4 className="title"><Link to="service-details.html" className="stretched-link">Nemo Enim</Link></h4>
			                    <p className="description">
			                        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque
			                    </p>
			                </div>
			            </div>
			            {/* <!-- End Service Item --> */}

			            <div className="col-lg-4 col-md-6 service-item d-flex" data-aos="fade-up" data-aos-delay="600">
			                <div className="icon flex-shrink-0">
			                    <i className="bi bi-calendar4-week"></i>
			                </div>
			                <div>
			                    <h4 className="title"><Link to="service-details.html" className="stretched-link">Eiusmod Tempor</Link></h4>
			                    <p className="description">
			                        Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi
			                    </p>
			                </div>
			            </div>
			            {/* <!-- End Service Item --> */}

			        </div>

			    </div>

			</section>
			{/* <!-- /Services Section --> */}
		</>
	)
}

export default Home
