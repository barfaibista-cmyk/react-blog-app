const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const handlePageClick = (pageNumber) => {
        onPageChange(pageNumber);
    };

    return (
        <div className="btn-group mb-3">
            <button type="button" className="btn btn-outline-secondary" onClick={()=> handlePageClick(currentPage - 1)} disabled={currentPage === 1}>
                <i className="bi bi-chevron-left"></i>
            </button>
            {
                Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                    <button
                        type="button"
                        className={`btn btn-outline-secondary ${currentPage === pageNumber ? 'active' : ''}`}
                        key={pageNumber}
                        onClick={()=> handlePageClick(pageNumber)}
                    >
                        {pageNumber}
                    </button>
                ))
            }
            <button type="button" className="btn btn-outline-secondary" onClick={()=> handlePageClick(currentPage + 1)} disabled={currentPage === totalPages}>
                <i className="bi bi-chevron-right"></i>
            </button>
        </div>
    );
};

export default Pagination;
