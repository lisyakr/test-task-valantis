import { useCallback } from 'react';
import { useAppData } from '../../appDataContext';
import './Pagination.css';
import { PAGE_LIMIT } from '../../constants';

export const Pagination = () => {
    const { currentPage, setCurrentPage, uniqIds } = useAppData();
    const pagesCount = Math.ceil(uniqIds.length / PAGE_LIMIT);

    const goBack = useCallback(async () => {
        setCurrentPage((c) => c - 1);
    }, [setCurrentPage]);

    const goNext = useCallback(async () => {
        setCurrentPage((c) => c + 1);
    }, [setCurrentPage]);

    return (
        <div className="pagination">
            {currentPage > 1 && <button onClick={goBack}>&#8592;</button>}
            <div className="currentPage">{currentPage}</div>
            {currentPage !== pagesCount && (
                <button onClick={goNext}>&#8594;</button>
            )}
        </div>
    );
};
