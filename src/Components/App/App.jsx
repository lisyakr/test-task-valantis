import { Filters } from '../Filters/Filters';
import { Products } from '../Products/Products';
import { Pagination } from '../Pagination/Pagination';
import './App.css';

import { AppDataProvider } from '../../appDataContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const AppInner = () => {
    return (
        <>
            <Pagination />
            <div className="main">
                <Filters />
                <Products />
            </div>
        </>
    );
};

export const App = () => {
    return (
        <DndProvider backend={HTML5Backend}>
            <AppDataProvider>
                <div className="wrapper">
                    <h1 className="title">Ювелирные изделия</h1>
                    <AppInner />
                </div>
            </AppDataProvider>
        </DndProvider>
    );
};
