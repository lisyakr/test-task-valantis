import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppData } from '../../appDataContext';
import { fetchOwnOptions } from '../../constants';
import './Filters.css';
import { debounce } from 'lodash-es';

function useDebounce(callback, ms) {
    return useMemo(() => debounce(callback, ms), [ms, callback]);
}

export const Filters = () => {
    const { filters, setFilters, setCurrentPage, isLoading } = useAppData();
    const [brands, setBrands] = useState([]);

    const makeRequestTitle = useDebounce((title) => {
        if (title) {
            if (filters) {
                setFilters({ ...filters, product: title });
            } else {
                setFilters({ product: title });
            }
        } else {
            if (filters) {
                // возвращаем все остальные поля, кроме product
                setFilters(({ product, ...rest }) => rest);
            }
        }
        setCurrentPage(1);
    }, 1000);

    const makeRequestPrice = useDebounce((price) => {
        if (price) {
            if (filters) {
                setFilters({ ...filters, price: Number(price) });
            } else {
                setFilters({ price: Number(price) });
            }
        } else {
            if (filters) {
                setFilters(({ price, ...rest }) => rest);
            }
        }
        setCurrentPage(1);
    }, 1000);

    const onChangeProduct = (e) => {
        const { value } = e.target;
        makeRequestTitle(value);
    };

    const onChangePrice = (e) => {
        const { value } = e.target;
        makeRequestPrice(value);
    };

    const onChangeBrand = useCallback(
        (event) => {
            const brand = event.target.value;
            if (brand) {
                if (filters) {
                    setFilters({ ...filters, brand });
                } else {
                    setFilters({ brand });
                }
            } else {
                if (filters) {
                    setFilters(({ brand, ...rest }) => rest);
                }
            }

            setCurrentPage(1);
        },
        [filters, setFilters, setCurrentPage]
    );

    useEffect(() => {
        (function request() {
            fetch('http://api.valantis.store:40000/', {
                ...fetchOwnOptions,
                body: JSON.stringify({
                    action: 'get_fields',
                    params: { field: 'brand' },
                }),
            })
                .then(async (r) => {
                    if (r.ok) {
                        return r.json();
                    }
                    try {
                        const res = await r.text();
                        if (res) {
                            console.log('Error get_fields token: ', res);
                            request();
                        }
                    } catch (e) {
                        throw new Error('unknown error');
                    }
                })
                .then((r) => {
                    if (r) {
                        const br = Array.from(new Set(r.result));
                        const brFilters = br.filter((br) => br !== null);
                        setBrands(brFilters);
                    }
                });
        })();
    }, []);

    return (
        <div className="filters">
            <label>
                Название:
                <input
                    type="text"
                    name="product"
                    placeholder="введите название продукта"
                    className="input__text"
                    onChange={onChangeProduct}
                    disabled={isLoading}
                />
            </label>
            <label disabled>
                Цена:
                <input
                    type="number"
                    name="price"
                    placeholder="введите цену"
                    onChange={onChangePrice}
                    className="input__price"
                    disabled={isLoading}
                />
            </label>
            <select
                onChange={onChangeBrand}
                value={filters?.brand || ''}
                placeholder="Выберите бренд"
                disabled={isLoading}
            >
                <option value="" disabled>
                    Выберите бренд
                </option>
                {brands.map((brand) => {
                    return (
                        <option key={brand} value={brand}>
                            {brand}
                        </option>
                    );
                })}
            </select>
        </div>
    );
};
