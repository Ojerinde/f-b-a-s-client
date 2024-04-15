import { useState } from "react";

interface PaginationProps {
  length: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
}

const Pagination: React.FC<PaginationProps> = ({
  length,
  onPageChange,
  itemsPerPage,
}) => {
  // Calculate the total number of pages
  const totalPages = Math.ceil(length / itemsPerPage);

  // State to keep track of the current page
  const [currentPage, setCurrentPage] = useState(1);
  const [pageNumber, setPageNumber] = useState<number | string>("");

  // Function to handle page changes
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return; // Guard clause for invalid page numbers
    setCurrentPage(page);
    onPageChange(page);
  };

  // Handle next and previous page buttons
  const handleNext = () => {
    goToPage(currentPage + 1);
  };

  const handlePrev = () => {
    goToPage(currentPage - 1);
  };

  // Function to handle input page change
  const handlePageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseInt(e.target.value);
    if (inputValue > totalPages || inputValue < 1) return;
    setPageNumber(inputValue);
  };
  const handleGoToSubmission = () => {
    goToPage(+pageNumber);
  };

  return (
    <div className="pagination">
      <div className="pagination-left">
        <button
          className="pagination-change"
          onClick={handlePrev}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="pagination-change"
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
      <div className="pagination-right">
        <input
          type="number"
          min="1"
          max={totalPages}
          value={pageNumber}
          onChange={handlePageInput}
        />
        <button onClick={handleGoToSubmission}>Go</button>
      </div>
    </div>
  );
};

export default Pagination;
