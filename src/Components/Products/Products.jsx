import { useCallback, useEffect, useState } from 'react';
import './Products.css';
import { useAppData } from '../../appDataContext';
import { PAGE_LIMIT, fetchOwnOptions } from '../../constants';

export const Products = () => {
    const { currentPage, isLoading, uniqIds, setIsLoading } = useAppData();
    const [filteredItems, setFilteredItems] = useState([]);

    const getItemsRequest = useCallback((uniqIds, resolve) => {
        fetch('http://api.valantis.store:40000/', {
            ...fetchOwnOptions,
            body: JSON.stringify({
                action: 'get_items',
                params: { ids: [...uniqIds] },
            }),
        })
            .then(async (r) => {
                if (r.ok) {
                    return r.json();
                }
                try {
                    const res = await r.text();
                    if (res) {
                        console.log('Error get_items token: ', res);
                        getItemsRequest(uniqIds, resolve);
                    }
                } catch (e) {
                    throw new Error('unknown error');
                }
            })
            .then((r) => {
                if (r) resolve(r.result);
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    const getItems = useCallback(
        async (idsParam) => {
            setIsLoading(true);
            const items = await new Promise((res, rej) => {
                getItemsRequest(idsParam, res);
            });

            const uniqItemsIds = new Set();

            const filtered = items.filter((item) => {
                if (uniqItemsIds.has(item.id)) return false;

                uniqItemsIds.add(item.id);
                return true;
            });

            setFilteredItems(Array.from(filtered));
            setIsLoading(false);
        },
        [getItemsRequest, setIsLoading]
    );

    useEffect(() => {
        if (uniqIds.length) {
            const offset = (currentPage - 1) * PAGE_LIMIT;
            getItems(uniqIds.slice(offset, offset + PAGE_LIMIT));
        }
    }, [currentPage, uniqIds, getItems]);

    return isLoading ? (
        <div className="indicator">
            <img
                src="/img/pablita-loading.gif"
                alt="spinner"
                className="spinner"
            />
        </div>
    ) : (
        <div id="products">
            {filteredItems.map(({ id, price, brand, product }) => (
                <div className="product" key={id}>
                    <div>ID: {id}</div>
                    <div>price: {price}</div>
                    <div>brand: {brand ? brand : 'Отсутствует'}</div>
                    <div>product: {product}</div>
                </div>
            ))}
        </div>
    );
};
