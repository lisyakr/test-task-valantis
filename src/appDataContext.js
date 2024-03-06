import { useCallback, useContext, useEffect, useState } from 'react';
import React from 'react';
import { fetchOwnOptions } from './constants';

const appDataContext = React.createContext();

export const useAppData = () => useContext(appDataContext);

export const AppDataProvider = ({ children }) => {
    const [filters, setFilters] = useState(null);
    const [uniqIds, setUniqIds] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const getIdsByFilter = useCallback(async (filters) => {
        setIsLoading(true);
        let uniq = new Set();

        if (!filters) {
            const ids = await fetch('http://api.valantis.store:40000/', {
                ...fetchOwnOptions,
                body: JSON.stringify({
                    action: 'get_ids',
                }),
            })
                .then((r) => r.json())
                .then((r) => r.result)
                .catch((e) => {
                    console.log(e);
                });
            uniq = new Set([...ids]);
        } else {
            const ids = await fetch('http://api.valantis.store:40000/', {
                ...fetchOwnOptions,
                body: JSON.stringify({
                    action: 'filter',
                    params: filters,
                }),
            })
                .then((r) => r.json())
                .then((r) => r.result)
                .catch((e) => {
                    console.log(e);
                });

            uniq = new Set(ids);
        }
        setUniqIds(Array.from(uniq));
    }, []);

    useEffect(() => {
        getIdsByFilter(filters);
    }, [getIdsByFilter, filters]);

    return (
        <appDataContext.Provider
            value={{
                filters,
                setFilters,
                currentPage,
                setCurrentPage,
                uniqIds,
                isLoading,
                setIsLoading,
            }}
        >
            {children}
        </appDataContext.Provider>
    );
};
