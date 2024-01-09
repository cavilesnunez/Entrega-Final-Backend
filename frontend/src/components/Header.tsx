// Header.tsx
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Header: React.FC = () => {
    return (
        <header className="bg-blue-800 text-white shadow-md">
            <nav className="container mx-auto flex justify-between items-center p-4">
                {/* Logo o título del sitio web */}
                <div className="font-bold text-lg">
                    <Link href="/">
                        Mi Sitio Web
                    </Link>
                </div>

                {/* Enlaces de navegación */}
                <div className="flex gap-4">
                    <Link href="/" className="hover:bg-blue-700 px-3 py-2 rounded transition-colors">
                        Inicio
                    </Link>
                    <Link href="/about" className="hover:bg-blue-700 px-3 py-2 rounded transition-colors">
                        Acerca de
                    </Link>
                    <Link href="/contact" className="hover:bg-blue-700 px-3 py-2 rounded transition-colors">
                        Contacto
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default Header;
