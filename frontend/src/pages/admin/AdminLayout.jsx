import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Package, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
    const location = useLocation();
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Products', path: '/admin/products', icon: <ShoppingBag size={20} /> },
        { name: 'Orders', path: '/admin/orders', icon: <Package size={20} /> },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <aside style={{ width: '250px', backgroundColor: 'var(--color-primary)', color: 'white', padding: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '3rem', fontFamily: 'var(--font-heading)' }}>Admin Panel</h2>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {navItems.map(item => (
                        <Link
                            key={item.name}
                            to={item.path}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '10px 15px',
                                borderRadius: '4px',
                                backgroundColor: location.pathname === item.path ? 'var(--color-secondary)' : 'transparent',
                                color: 'white',
                                transition: '0.2s'
                            }}
                        >
                            {item.icon}
                            {item.name}
                        </Link>
                    ))}

                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '10px 15px',
                            marginTop: 'auto',
                            background: 'none',
                            border: 'none',
                            color: '#aaa',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        <LogOut size={20} /> Logout
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, backgroundColor: 'var(--color-surface)', padding: '2rem', overflowY: 'auto' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
