import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Slider from "react-slick";
import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import NoPage from './NoPage';
import Isotope from 'isotope-layout';
import PureCounter from '@srexi/purecounterjs';
import ProgressBar from "@ramonak/react-progress-bar";
import GLightbox from 'glightbox';
import 'glightbox/dist/css/glightbox.min.css';
import { teams, testimonials, portfolios, stats, skills } from '../data.js';

const Breadcrumb = (props) => {
	return (
		<div className="page-title light-background">
		    <div className="container">
		        <nav className="breadcrumbs">
		            <ol>
		                <li><Link to="/">Home</Link></li>
		                <li className="current">{props.page_title}</li>
		            </ol>
		        </nav>
		        <h1>{props.page_title}</h1>
		    </div>
		</div>
	)
}

const SliderTestimonial = () => {
	let settings = {
		arrows: true,
		dots: true,
		infinite: true,
		slidesToShow: 2,
		slidesToScroll: 1,
		autoplay: true,
		speed: 2000,
		autoplaySpeed: 2000,
		cssEase: "linear"
	};

	return (
		<Slider {...settings}>
		{
			testimonials.map((testimonial, idx) => (
				<div key={idx} className={`slider-item item-${idx}`}>
                    <div className="testimonial-item">
                        <img src={`${window.location.origin}${testimonial.image}`} className="testimonial-img" alt=""/>
                        <h3>{testimonial.name}</h3>
                        <h4>{testimonial.ovvupation}</h4>
                        <div className="stars">
                            <i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i>
                        </div>
                        <p>
                            <i className="bi bi-quote quote-icon-left"></i>
                            <span>{testimonial.quotes}</span>
                            <i className="bi bi-quote quote-icon-right"></i>
                        </p>
                    </div>
                </div>
			))
		}
		</Slider>
	)
}

const TeamComponent = (props) => {
	return (
		<div className="col-md-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
            <div className="member">
                <div className="pic">
                    <img src={`${window.location.origin}${props.image}`} className="img-fluid" alt=""/>
                </div>
                <div className="member-info">
                    <h4>{props.name}</h4>
                    <span>{props.occupation}</span>
                    <div className="social">
                        <Link to=""><i className="bi bi-twitter-x"></i></Link>
                        <Link to=""><i className="bi bi-facebook"></i></Link>
                        <Link to=""><i className="bi bi-instagram"></i></Link>
                        <Link to=""><i className="bi bi-linkedin"></i></Link>
                    </div>
                </div>
            </div>
        </div>
	)
}

const Page = () => {
    const location = useLocation();
    const page = location.pathname.split('/')[2];
	const [key, setKey] = useState('tab-1');
    const [filterKey, setFilterKey] = useState('*');
    const isotope = useRef(null);
    const portfolioContainerRef = useRef(null);

	useEffect(() => {
		function pureCounterFn() {
			return new PureCounter();
		}
		window.addEventListener('load', pureCounterFn);
		return () => {
			window.removeEventListener('load', pureCounterFn);
		}
	}, []);

    useEffect(() => {
        if (page === 'portfolio' && portfolioContainerRef.current) {
            const images = portfolioContainerRef.current.querySelectorAll('img');
            let imagesLoaded = 0;
            const checkImagesLoaded = () => {
                imagesLoaded++;
                if (imagesLoaded === images.length) {
                    if (isotope.current) {
                        isotope.current.destroy();
                    }
                    isotope.current = new Isotope(portfolioContainerRef.current, {
                        itemSelector: '.portfolio-item',
                        percentPosition: true,
                        layoutMode: 'masonry',
                    });
                }
            };
            images.forEach(img => {
                if (img.complete) {
                    checkImagesLoaded();
                } else {
                    img.addEventListener('load', checkImagesLoaded);
                }
            });
        }
        return () => {
            if (isotope.current) {
                isotope.current.destroy();
            }
        };
    }, [page]);

    useEffect(() => {
        if (isotope.current && page === 'portfolio') {
            const filterValue = filterKey === '*' ? '*' : `.filter-${filterKey}`;
            isotope.current.arrange({ filter: filterValue });
        }
    }, [filterKey, page]);

    useEffect(() => {
        if (isotope.current && page === 'portfolio') {
            const filterValue = filterKey === '*' ? '*' : `.filter-${filterKey}`;
            isotope.current.arrange({ filter: filterValue });
        }
    }, [filterKey, page]);

    useEffect(() => {
        const lightbox = GLightbox({
            selector: '.glightbox',
        });
        return () => {
            lightbox.destroy();
        };
    }, []);

    const handleFilterKeyChange = (key) => () => {
        setFilterKey(key);
    };

	switch(page) {
		case 'about': return (
			<>
				<Breadcrumb page_title="About Us" />

				<section id="about-2" className="about-2 section">
				    <div className="container" data-aos="fade-up">
				        <div className="row g-4 g-lg-5" data-aos="fade-up" data-aos-delay="200">
				            <div className="col-lg-5">
				                <div className="about-img">
				                    <img src={`${window.location.origin}/img/about-portrait.jpg`} className="img-fluid" alt=""/>
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

				<section id="stats" className="stats section light-background">
				    <div className="container" data-aos="fade-up" data-aos-delay="100">
				        <div className="row gy-4">
							{
								stats.map((stat, idx) => (
						            <div key={idx} className="col-lg-3 col-md-6">
						                <div className="stats-item">
						                    <i className={stat.icon}></i>
						                    <span data-purecounter-start={stat.start} data-purecounter-end={stat.end} data-purecounter-duration="1" className="purecounter"></span>
						                    <p><strong>{stat.title}</strong> <span>{stat.descriptions}</span></p>
						                </div>
						            </div>
								))
							}
				        </div>
				    </div>
				</section>

				<section id="team" className="team section">
				    <div className="container">
				        <div className="row gy-5">
							{
								teams.map((team ,idx) => (
									<TeamComponent key={idx} {...team} />
								))
							}
				        </div>
				    </div>
				</section>

				<section id="skills" className="skills section">
				    <div className="container section-title" data-aos="fade-up">
				        <h2>Skills</h2>
				        <p>
				            Check Our Skills
				        </p>
				    </div>

				    <div className="container" data-aos="fade-up" data-aos-delay="100">
				        <div className="row">
				            <div className="col-lg-6 d-flex align-items-center">
				                <img src={`${window.location.origin}/img/skills.png`} className="img-fluid" alt=""/>
				            </div>

				            <div className="col-lg-6 pt-4 pt-lg-0 content">
				                <h3>Voluptatem dignissimos provident quasi corporis voluptas</h3>
				                <p className="fst-italic">
				                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
				                </p>
				                <div className="skills-content skills-animation">
					                {
										skills.map((skill, idx) => (
						                    <div className="progress">
						                        <span className="skill"><span>{skill.name}</span> <i className="val">{skill.now}%</i></span>
						                        <ProgressBar ariaValueMin={skill.min} ariaValueMax={skill.max} completed={skill.now} bgColor="#8BB838" animateOnRender={true} transitionTimingFunction="linear" transitionDuration="3s" />
						                    </div>
										))
					                 }
				                </div>
				            </div>
				        </div>
				    </div>
				</section>

				<section id="testimonials" className="testimonials section">
				    <div className="container section-title" data-aos="fade-up">
				        <h2>Testimonials</h2>
				        <p>Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit</p>
				    </div>
				    <SliderTestimonial />
				</section>
			</>
		)
		case 'team': return (
			<>
				<Breadcrumb page_title="Our Team" />
				<section id="team" className="team section">
				    <div className="container">
				        <div className="row gy-5">
				        {
							teams.map((team, idx) => (
								<TeamComponent key={idx} {...team} />
							))
				        }
				        </div>
				    </div>
				</section>
			</>
		)
		case 'pricing': return (
			<>
				<Breadcrumb page_title="Pricing" />
				<section id="pricing" className="pricing section">

				    <div className="container">
				        <div className="row g-4 g-lg-0">
				            <div className="col-lg-4" data-aos="zoom-in" data-aos-delay="100">
				                <div className="pricing-item">
				                    <h3>Free Plan</h3>
				                    <h4><sup>$</sup>0<span> / month</span></h4>
				                    <ul>
				                        <li><i className="bi bi-check"></i> <span>Quam adipiscing vitae proin</span></li>
				                        <li><i className="bi bi-check"></i> <span>Nec feugiat nisl pretium</span></li>
				                        <li><i className="bi bi-check"></i> <span>Nulla at volutpat diam uteera</span></li>
				                        <li className="na"><i className="bi bi-x"></i> <span>Pharetra massa massa ultricies</span></li>
				                        <li className="na"><i className="bi bi-x"></i> <span>Massa ultricies mi quis hendrerit</span></li>
				                    </ul>
				                    <div className="text-center">
				                        <Link to="#" className="buy-btn">Buy Now</Link>
				                    </div>
				                </div>
				            </div>

				            <div className="col-lg-4 featured" data-aos="zoom-in" data-aos-delay="200">
				                <div className="pricing-item">
				                    <h3>Business Plan</h3>
				                    <h4><sup>$</sup>29<span> / month</span></h4>
				                    <ul>
				                        <li><i className="bi bi-check"></i> <span>Quam adipiscing vitae proin</span></li>
				                        <li><i className="bi bi-check"></i> <span>Nec feugiat nisl pretium</span></li>
				                        <li><i className="bi bi-check"></i> <span>Nulla at volutpat diam uteera</span></li>
				                        <li><i className="bi bi-check"></i> <span>Pharetra massa massa ultricies</span></li>
				                        <li><i className="bi bi-check"></i> <span>Massa ultricies mi quis hendrerit</span></li>
				                    </ul>
				                    <div className="text-center">
				                        <Link to="#" className="buy-btn">Buy Now</Link>
				                    </div>
				                </div>
				            </div>

				            <div className="col-lg-4" data-aos="zoom-in" data-aos-delay="100">
				                <div className="pricing-item">
				                    <h3>Developer Plan</h3>
				                    <h4><sup>$</sup>49<span> / month</span></h4>
				                    <ul>
				                        <li><i className="bi bi-check"></i> <span>Quam adipiscing vitae proin</span></li>
				                        <li><i className="bi bi-check"></i> <span>Nec feugiat nisl pretium</span></li>
				                        <li><i className="bi bi-check"></i> <span>Nulla at volutpat diam uteera</span></li>
				                        <li><i className="bi bi-check"></i> <span>Pharetra massa massa ultricies</span></li>
				                        <li><i className="bi bi-check"></i> <span>Massa ultricies mi quis hendrerit</span></li>
				                    </ul>
				                    <div className="text-center">
				                        <Link to="#" className="buy-btn">Buy Now</Link>
				                    </div>
				                </div>
				            </div>
				        </div>
				    </div>

				</section>

				<section id="alt-pricing" className="alt-pricing section">
				    <div className="container section-title" data-aos="fade-up">
				        <h2>Alt Pricing</h2>
				        <p>
				            Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit
				        </p>
				    </div>

				    <div className="container">
				        <div className="row gy-4 pricing-item" data-aos="fade-up" data-aos-delay="100">
				            <div className="col-lg-3 d-flex align-items-center justify-content-center">
				                <h3>Free Plan</h3>
				            </div>
				            <div className="col-lg-3 d-flex align-items-center justify-content-center">
				                <h4><sup>$</sup>0<span> / month</span></h4>
				            </div>
				            <div className="col-lg-3 d-flex align-items-center justify-content-center">
				                <ul>
				                    <li><i className="bi bi-check"></i> <span>Quam adipiscing vitae proin</span></li>
				                    <li><i className="bi bi-check"></i> <span>Nulla at volutpat diam uteera</span></li>
				                    <li className="na"><i className="bi bi-x"></i> <span>Pharetra massa massa ultricies</span></li>
				                </ul>
				            </div>
				            <div className="col-lg-3 d-flex align-items-center justify-content-center">
				                <div className="text-center">
				                    <Link to="#" className="buy-btn">Buy Now</Link>
				                </div>
				            </div>
				        </div>

				        <div className="row gy-4 pricing-item featured mt-4" data-aos="fade-up" data-aos-delay="200">
				            <div className="col-lg-3 d-flex align-items-center justify-content-center">
				                <h3>Business Plan</h3>
				            </div>
				            <div className="col-lg-3 d-flex align-items-center justify-content-center">
				                <h4><sup>$</sup>29<span> / month</span></h4>
				            </div>
				            <div className="col-lg-3 d-flex align-items-center justify-content-center">
				                <ul>
				                    <li><i className="bi bi-check"></i> <span>Quam adipiscing vitae proin</span></li>
				                    <li><i className="bi bi-check"></i> <strong>Nec feugiat nisl pretium</strong></li>
				                    <li><i className="bi bi-check"></i> <span>Nulla at volutpat diam uteera</span></li>
				                </ul>
				            </div>
				            <div className="col-lg-3 d-flex align-items-center justify-content-center">
				                <div className="text-center">
				                    <Link to="#" className="buy-btn">Buy Now</Link>
				                </div>
				            </div>
				        </div>

				        <div className="row gy-4 pricing-item mt-4" data-aos="fade-up" data-aos-delay="300">
				            <div className="col-lg-3 d-flex align-items-center justify-content-center">
				                <h3>Developer Plan</h3>
				            </div>
				            <div className="col-lg-3 d-flex align-items-center justify-content-center">
				                <h4><sup>$</sup>49<span> / month</span></h4>
				            </div>
				            <div className="col-lg-3 d-flex align-items-center justify-content-center">
				                <ul>
				                    <li><i className="bi bi-check"></i> <span>Quam adipiscing vitae proin</span></li>
				                    <li><i className="bi bi-check"></i> <span>Nec feugiat nisl pretium</span></li>
				                    <li><i className="bi bi-check"></i> <span>Nulla at volutpat diam uteera</span></li>
				                </ul>
				            </div>
				            <div className="col-lg-3 d-flex align-items-center justify-content-center">
				                <div className="text-center">
				                    <Link to="#" className="buy-btn">Buy Now</Link>
				                </div>
				            </div>
				        </div>

				    </div>
				</section>
			</>
		)
		case 'services': return (
			<>
				<Breadcrumb page_title="Services" />

				<section id="services" className="services section">
				    <div className="container">
				        <div className="row gy-4">
				            <div className="col-md-4 col-md-6 service-item d-flex" data-aos="fade-up" data-aos-delay="100">
				                <div className="icon flex-shrink-0">
				                    <i className="bi bi-briefcase"></i>
				                </div>
				                <div>
				                    <h4 className="title">
				                    <Link href="service-details" className="stretched-link">Lorem Ipsum</Link>
				                    </h4>
				                    <p className="description">
				                        Voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident
				                    </p>
				                </div>
				            </div>

				            <div className="col-md-4 col-md-6 service-item d-flex" data-aos="fade-up" data-aos-delay="200">
				                <div className="icon flex-shrink-0">
				                    <i className="bi bi-card-checklist"></i>
				                </div>
				                <div>
				                    <h4 className="title"><Link href="service-details" className="stretched-link">Dolor Sitema</Link></h4>
				                    <p className="description">
				                        Minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat tarad limino ata
				                    </p>
				                </div>
				            </div>

				            <div className="col-md-4 col-md-6 service-item d-flex" data-aos="fade-up" data-aos-delay="300">
				                <div className="icon flex-shrink-0">
				                    <i className="bi bi-bar-chart"></i>
				                </div>
				                <div>
				                    <h4 className="title"><Link href="service-details" className="stretched-link">Sed ut perspiciatis</Link></h4>
				                    <p className="description">
				                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur
				                    </p>
				                </div>
				            </div>

				            <div className="col-md-4 col-md-6 service-item d-flex" data-aos="fade-up" data-aos-delay="400">
				                <div className="icon flex-shrink-0">
				                    <i className="bi bi-binoculars"></i>
				                </div>
				                <div>
				                    <h4 className="title"><Link href="service-details" className="stretched-link">Magni Dolores</Link></h4>
				                    <p className="description">
				                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
				                    </p>
				                </div>
				            </div>

				            <div className="col-md-4 col-md-6 service-item d-flex" data-aos="fade-up" data-aos-delay="500">
				                <div className="icon flex-shrink-0">
				                    <i className="bi bi-brightness-high"></i>
				                </div>
				                <div>
				                    <h4 className="title"><Link href="service-details" className="stretched-link">Nemo Enim</Link></h4>
				                    <p className="description">
				                        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque
				                    </p>
				                </div>
				            </div>

				            <div className="col-md-4 col-md-6 service-item d-flex" data-aos="fade-up" data-aos-delay="600">
				                <div className="icon flex-shrink-0">
				                    <i className="bi bi-calendar4-week"></i>
				                </div>
				                <div>
				                    <h4 className="title"><Link href="service-details" className="stretched-link">Eiusmod Tempor</Link></h4>
				                    <p className="description">
				                        Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi
				                    </p>
				                </div>
				            </div>
				        </div>
				    </div>
				</section>

				<section id="features" className="features section">
				    <div className="container section-title" data-aos="fade-up">
				        <h2>Features</h2>
				        <p>Check Our Features</p>
				    </div>

				    <div className="container">
				        <div className="d-flex justify-content-center">
				            <ul className="nav nav-tabs" data-aos="fade-up" data-aos-delay="100">
				                <li className="nav-item">
				                    <Link className={`nav-link show ${ key === 'tab-1' ? 'nav-active' : '' }`} data-bs-toggle="tab" data-bs-target="#tab-1" selected={ key === 'tab-1' ? true : false } onClick={() => setKey('tab-1')}>
				                        <h4>Modisit</h4>
				                    </Link>
				                </li>
				                <li className="nav-item">
				                    <Link className={`nav-link show ${ key === 'tab-2' ? 'bav-active' : '' }`} data-bs-toggle="tab" data-bs-target="#tab-2" selected={ key === 'tab-2' ? true : false } onClick={() => setKey('tab-2')}>
				                        <h4>Praesenti</h4>
				                    </Link>
				                </li>
				                <li className="nav-item">
				                    <Link className={`nav-link show ${ key === 'tab-3' ? 'nav-active' : '' }`} data-bs-toggle="tab" data-bs-target="#tab-3" selected={ key === 'tab-3' ? true : false } onClick={() => setKey('tab-3')}>
				                        <h4>Explica</h4>
				                    </Link>
				                </li>
				            </ul>
				        </div>

				        <div className="tab-content" data-aos="fade-up" data-aos-delay="200">
				            <div className={`tab-pane fade show ${ key === 'tab-1' ? 'active' : '' }`} id="tab-1">
				                <div className="row">
				                    <div className="col-lg-6 order-2 order-lg-1 mt-3 mt-lg-0 d-flex flex-column justify-content-center">
				                        <h3>Voluptatem dignissimos provident</h3>
				                        <p className="fst-italic">
				                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
				                        </p>
				                        <ul>
				                            <li><i className="bi bi-check2-all"></i> <span>Ullamco laboris nisi ut aliquip ex ea commodo consequat.</span></li>
				                            <li><i className="bi bi-check2-all"></i> <span>Duis aute irure dolor in reprehenderit in voluptate velit.</span></li>
				                            <li><i className="bi bi-check2-all"></i> <span>Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate trideta storacalaperda mastiro dolore eu fugiat nulla pariatur.</span></li>
				                        </ul>
				                    </div>
				                    <div className="col-lg-6 order-1 order-lg-2 text-center">
				                        <img src={`${window.location.origin}/img/working-1.jpg`} alt="" className="img-fluid" />
				                    </div>
				                </div>
				            </div>

				            <div className={`tab-pane fade show ${ key === 'tab-2' ? 'active' : '' }`} id="tab-2">
				                <div className="row">
				                    <div className="col-lg-6 order-2 order-lg-1 mt-3 mt-lg-0 d-flex flex-column justify-content-center">
				                        <h3>Neque exercitationem debitis</h3>
				                        <p className="fst-italic">
				                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
				                        </p>
				                        <ul>
				                            <li><i className="bi bi-check2-all"></i> <span>Ullamco laboris nisi ut aliquip ex ea commodo consequat.</span></li>
				                            <li><i className="bi bi-check2-all"></i> <span>Duis aute irure dolor in reprehenderit in voluptate velit.</span></li>
				                            <li><i className="bi bi-check2-all"></i> <span>Provident mollitia neque rerum asperiores dolores quos qui a. Ipsum neque dolor voluptate nisi sed.</span></li>
				                            <li><i className="bi bi-check2-all"></i> <span>Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate trideta storacalaperda mastiro dolore eu fugiat nulla pariatur.</span></li>
				                        </ul>
				                    </div>
				                    <div className="col-lg-6 order-1 order-lg-2 text-center">
				                        <img src={`${window.location.origin}/img/working-2.jpg`} alt="" className="img-fluid" />
				                    </div>
				                </div>
				            </div>

				            <div className={`tab-pane fade show ${ key === 'tab-3' ? 'active' : '' }`} id="tab-3">
				                <div className="row">
				                    <div className="col-lg-6 order-2 order-lg-1 mt-3 mt-lg-0 d-flex flex-column justify-content-center">
				                        <h3>Voluptatibus commodi accusamu</h3>
				                        <ul>
				                            <li><i className="bi bi-check2-all"></i> <span>Ullamco laboris nisi ut aliquip ex ea commodo consequat.</span></li>
				                            <li><i className="bi bi-check2-all"></i> <span>Duis aute irure dolor in reprehenderit in voluptate velit.</span></li>
				                            <li><i className="bi bi-check2-all"></i> <span>Provident mollitia neque rerum asperiores dolores quos qui a. Ipsum neque dolor voluptate nisi sed.</span></li>
				                        </ul>
				                        <p className="fst-italic">
				                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
				                            magna aliqua.
				                        </p>
				                    </div>
				                    <div className="col-lg-6 order-1 order-lg-2 text-center">
				                        <img src={`${window.location.origin}/img/working-3.jpg`} alt="" className="img-fluid" />
				                    </div>
				                </div>
				            </div>

				        </div>
				    </div>
				</section>
			</>
		)
		case 'portfolio': return (
                <>
                    <Breadcrumb page_title="Portfolio" />
                    <section id="portfolio" className="portfolio section">
                        <div className="container">
                            <div className="isotope-layout">
                                <ul className="portfolio-filters isotope-filters">
                                    <li onClick={handleFilterKeyChange('*')} className={filterKey === '*' ? 'filter-active' : ''}>All</li>
                                    <li onClick={handleFilterKeyChange('App')} className={filterKey === 'App' ? 'filter-active' : ''}>App</li>
                                    <li onClick={handleFilterKeyChange('Card')} className={filterKey === 'Card' ? 'filter-active' : ''}>Card</li>
                                    <li onClick={handleFilterKeyChange('Web')} className={filterKey === 'Web' ? 'filter-active' : ''}>Web</li>
                                </ul>
                                <div className="row gy-4 portfolio-container" ref={portfolioContainerRef}>
                                    {
                                        portfolios.map((portfolio, idx) => (
                                            <div key={idx} className={`col-md-4 col-md-6 portfolio-item filter-${portfolio.category}`}>
                                                <img src={portfolio.image} className="img-fluid" alt={portfolio.name} />
                                                <div className="portfolio-info">
                                                    <h4>{portfolio.name}</h4>
                                                    <p>{portfolio.description}</p>
                                                    <a href={portfolio.image} data-title={portfolio.name} data-description={portfolio.description} className="glightbox preview-link"><i className="bi bi-zoom-in"></i></a>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            )
		case 'testimonials': return (
			<>
				<Breadcrumb page_title="Testimonial" />
				<section id="testimonials" className="testimonials section">
				    <div className="container" data-aos="fade-up" data-aos-delay="100">
						<SliderTestimonial />
					</div>
				</section>
			</>
		)
		case 'contact': return (
			<>
				<Breadcrumb page_title="Contact" />

				<section id="contact" className="contact section">
				    <div className="container" data-aos="fade-up" data-aos-delay="100">
				        <div className="mb-4" data-aos="fade-up" data-aos-delay="200">
				            <iframe style={{ border: '0', width: '100%', height: '270px' }} src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d48389.78314118045!2d-74.006138!3d40.710059!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a22a3bda30d%3A0xb89d1fe6bc499443!2sDowntown%20Conference%20Center!5e0!3m2!1sen!2sus!4v1676961268712!5m2!1sen!2sus" frameBorder="0" allowFullscreen="" loading="lazy" title="Map" referrerPolicy="no-referrer-when-downgrade"></iframe>
				        </div>

				        <div className="row gy-4">

				            <div className="col-md-4">
				                <div className="info-item d-flex" data-aos="fade-up" data-aos-delay="300">
				                    <i className="bi bi-geo-alt flex-shrink-0"></i>
				                    <div>
				                        <h3>Address</h3>
				                        <p>
				                            A108 Adam Street, New York, NY 535022
				                        </p>
				                    </div>
				                </div>

				                <div className="info-item d-flex" data-aos="fade-up" data-aos-delay="400">
				                    <i className="bi bi-telephone flex-shrink-0"></i>
				                    <div>
				                        <h3>Call Us</h3>
				                        <p>
				                            +1 5589 55488 55
				                        </p>
				                    </div>
				                </div>

				                <div className="info-item d-flex" data-aos="fade-up" data-aos-delay="500">
				                    <i className="bi bi-envelope flex-shrink-0"></i>
				                    <div>
				                        <h3>Email Us</h3>
				                        <p>
				                            info@example.com
				                        </p>
				                    </div>
				                </div>

				            </div>

				            <div className="col-lg-8">
				                <form action="forms/contact.php" method="post" className="php-email-form" data-aos="fade-up" data-aos-delay="200">
				                    <div className="row gy-4">

				                        <div className="col-md-6">
				                            <input type="text" name="name" className="form-control" placeholder="Your Name" required="" />
				                        </div>

				                        <div className="col-md-6 ">
				                            <input type="email" className="form-control" name="email" placeholder="Your Email" required="" />
				                        </div>

				                        <div className="col-md-12">
				                            <input type="text" className="form-control" name="subject" placeholder="Subject" required="" />
				                        </div>

				                        <div className="col-md-12">
				                            <textarea className="form-control" name="message" rows="6" placeholder="Message" required=""></textarea>
				                        </div>

				                        <div className="col-md-12 text-center">
				                            <button type="submit" className="btn btn-primary">Send Message</button>
				                        </div>

				                    </div>
				                </form>
				            </div>

				        </div>

				    </div>

				</section>
			</>
		)
		default: return (<NoPage />)
	}
};

export default Page;
