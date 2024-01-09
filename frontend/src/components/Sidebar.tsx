// Sidebar.tsx
import React from 'react';

const Sidebar: React.FC = () => {
    return (
        <aside className="w-64 h-screen bg-gray-800 text-white fixed">
            <div className="p-4 text-xl font-semibold border-b border-gray-700">Menú</div>
            <ul className="flex flex-col py-4">
                <li>
                    <a href="/category1" className="flex items-center p-2 hover:bg-gray-700 transition-colors">
                        <span className="ml-3">Categoría 1</span>
                    </a>
                </li>
                <li>
                    <a href="/category2" className="flex items-center p-2 hover:bg-gray-700 transition-colors">
                        <span className="ml-3">Categoría 2</span>
                    </a>
                </li>
                <li>
                    <a href="/category3" className="flex items-center p-2 hover:bg-gray-700 transition-colors">
                        <span className="ml-3">Categoría 3</span>
                    </a>
                </li>
            </ul>
        </aside>
    );
};

export default Sidebar;
