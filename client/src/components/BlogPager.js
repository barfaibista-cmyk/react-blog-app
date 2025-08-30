import classnames from 'classnames';
import { usePaginator, DOTS } from '../hooks/usePaginator';
import { Link } from 'react-router-dom';

const BlogPager = (props) => {
	const {
	    onPageChange,
	    totalCount,
	    siblingCount = 1,
	    currentPage,
	    pageSize,
	    className
	} = props;

	const paginationRange = usePaginator({
	    currentPage,
	    totalCount,
	    siblingCount,
	    pageSize
	});

	if (currentPage === 0 || paginationRange.length < 2) {
		return null;
	}

	const onNext = () => {
		onPageChange(currentPage + 1);
	};

	const onPrevious = () => {
		onPageChange(currentPage - 1);
	};

	let lastPage = paginationRange[paginationRange.length - 1];

	return (
		<ul className={classnames('pagination-container', { [className]: className })}>
			<li key={currentPage - 1} className={classnames('', {
	          disabled: currentPage === 1
	        })} onClick={onPrevious}>
				<Link to="#">
					<i className="bi bi-chevron-left"></i>
				</Link>
	        </li>

			{
				paginationRange.map((pageNumber, idx) => {
			        if (pageNumber === DOTS) {
			          return <li key={idx} className="dots">&#8230;</li>;
			        }

			        return (
			          <li key={idx} className={classnames('', {
			              selected: pageNumber === currentPage
			            })} onClick={() => onPageChange(pageNumber)}>
			            <Link to="#"  className={ pageNumber === currentPage ? 'active' : '' }>{pageNumber}</Link>
			          </li>
			        );
			      })
			}

	        <li key={currentPage + 1} className={classnames('', {
	          disabled: currentPage === lastPage
	        })} onClick={onNext}>
				<Link to="#">
					<i className="bi bi-chevron-right"></i>
				</Link>
			</li>
	    </ul>
	)
}

export default BlogPager;
