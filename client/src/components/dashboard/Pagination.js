const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const maxPagesToShow = 7;

    const getPageNumbers = () => {
        if (totalPages <= maxPagesToShow) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const start = Math.max(2, currentPage - 2);
        const end = Math.min(totalPages - 1, currentPage + 2);
        const pages = [];

        pages.push(1);

        if (start > 2) {
            pages.push('...');
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (end < totalPages - 1) {
            pages.push('...');
        }

        pages.push(totalPages);

        return [...new Set(pages)];
    };

    const handlePageClick = (pageNumber) => {
        if (pageNumber !== '...') {
            onPageChange(pageNumber);
        }
    };

    return (
        <div className="btn-group" role="group">
            <button
                className="btn btn-outline-primary"
                onClick={() => handlePageClick(currentPage - 1)}
                disabled={currentPage === 1}
            >
            	<i className="bi bi-chevron-left"></i>
            </button>

            {getPageNumbers().map((pageNumber, index) => (
                <button
                    key={index}
                    className={`btn btn-outline-primary ${currentPage === pageNumber ? 'active' : ''}`}
                    onClick={() => handlePageClick(pageNumber)}
                    disabled={pageNumber === '...'}
                >
                    {pageNumber}
                </button>
            ))}

            <button
                className="btn btn-outline-primary"
                onClick={() => handlePageClick(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
            	<i className="bi bi-chevron-right"></i>
            </button>
        </div>
    );
};

export default Pagination;
