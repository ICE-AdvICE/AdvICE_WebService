const Pagination = ({ paginate, currentPage, totalPages }) => {
    const handleClick = (e, number) => {
        e.preventDefault();
        if (number < 1 || number > totalPages) return; //  
        paginate(number);
    };

    
    return (
        <nav aria-label="Page navigation example"className="pagination-bar">
            <ul className="pagination">
                <li className={currentPage === 1 ? "page-item disabled" : "page-item"}>
                    <a className="page-link" onClick={(e) => handleClick(e, currentPage - 1)}>이전</a>
                </li>
                {Array.from({ length: totalPages }, (_, i) => (
                    <li key={i + 1} className={currentPage === i + 1 ? "page-item active" : "page-item"}>
                        <a className="page-link" onClick={(e) => handleClick(e, i + 1)}>{i + 1}</a>
                    </li>
                ))}
                <li className={currentPage === totalPages ? "page-item disabled" : "page-item"}>
                    <a className="page-link"  onClick={(e) => handleClick(e, currentPage + 1)}>다음</a>
                </li>
            </ul>
        </nav>
    );
}

export default Pagination;