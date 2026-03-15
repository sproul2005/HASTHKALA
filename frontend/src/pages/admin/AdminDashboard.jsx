import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Package, ShoppingBag, IndianRupee, Users } from 'lucide-react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        stats: { totalSales: 0, totalOrders: 0, totalProducts: 0, totalUsers: 0 },
        recentOrders: [],
        salesByCategory: [],
        monthlyRevenue: []
    });
    const [loading, setLoading] = useState(true);

    const COLORS = ['#1a1a1a', '#4a4a4a', '#8b8b8b', '#cccccc'];

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/admin/stats');
                if (data.success) {
                    setDashboardData(data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Dashboard Insights...</div>;

    const { stats, recentOrders, salesByCategory, monthlyRevenue } = dashboardData;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
                <h1 style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>Dashboard Overview</h1>
                <p style={{ color: 'var(--color-text-light)' }}>Welcome back, here's your store's performance at a glance.</p>
            </div>

            {/* Top Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                <StatCard title="Total Sales" value={`₹${stats.totalSales.toLocaleString('en-IN')}`} icon={<IndianRupee size={24} color="#fff" />} color="#1a1a1a" />
                <StatCard title="Total Orders" value={stats.totalOrders} icon={<ShoppingBag size={24} color="#fff" />} color="#4a4a4a" />
                <StatCard title="Active Products" value={stats.totalProducts} icon={<Package size={24} color="#1a1a1a" />} color="#f0f0f0" textColor="#1a1a1a" />
                <StatCard title="Registered Users" value={stats.totalUsers} icon={<Users size={24} color="#1a1a1a" />} color="#f0f0f0" textColor="#1a1a1a" />
            </div>

            {/* Charts Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>

                {/* Revenue Line Chart */}
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 600 }}>Revenue (Last 6 Months)</h3>
                    <div style={{ height: 300, width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyRevenue} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value}`} />
                                <RechartsTooltip
                                    formatter={(value) => [`₹${value}`, 'Revenue']}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Line type="monotone" dataKey="revenue" stroke="#1a1a1a" strokeWidth={3} dot={{ r: 4, fill: '#1a1a1a' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Pie Chart */}
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 600 }}>Sales by Category</h3>
                    <div style={{ height: 300, width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={salesByCategory}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {salesByCategory.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    formatter={(value) => [value, 'Items Sold']}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Recent Orders</h3>
                    <Link to="/admin/orders" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>View All</Link>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #eee', color: 'var(--color-text-light)' }}>
                                <th style={{ padding: '12px' }}>Order ID</th>
                                <th style={{ padding: '12px' }}>Customer</th>
                                <th style={{ padding: '12px' }}>Date</th>
                                <th style={{ padding: '12px' }}>Amount</th>
                                <th style={{ padding: '12px' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.length === 0 ? (
                                <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>No orders found</td></tr>
                            ) : (
                                recentOrders.map(order => (
                                    <tr key={order._id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '12px', fontSize: '0.9rem', fontFamily: 'monospace' }}>#{order._id.substring(order._id.length - 6)}</td>
                                        <td style={{ padding: '12px', fontWeight: 500 }}>{order.user?.name || 'Guest'}</td>
                                        <td style={{ padding: '12px', color: '#666' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td style={{ padding: '12px', fontWeight: 600 }}>₹{order.totalPrice}</td>
                                        <td style={{ padding: '12px' }}>
                                            <span style={{
                                                padding: '4px 10px',
                                                borderRadius: '20px',
                                                fontSize: '0.8rem',
                                                fontWeight: 600,
                                                backgroundColor:
                                                    order.orderStatus === 'Completed' ? '#e6f4ea' :
                                                        order.orderStatus === 'Pending' ? '#fef7e0' :
                                                            order.orderStatus === 'Cancelled' ? '#fce8e6' : '#e8f0fe',
                                                color:
                                                    order.orderStatus === 'Completed' ? '#137333' :
                                                        order.orderStatus === 'Pending' ? '#b06000' :
                                                            order.orderStatus === 'Cancelled' ? '#c5221f' : '#1a73e8'
                                            }}>
                                                {order.orderStatus}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// Helper Component for Stats
const StatCard = ({ title, value, icon, color, textColor = '#fff' }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: color,
        padding: '1.5rem',
        borderRadius: '12px',
        color: textColor
    }}>
        <div>
            <h3 style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem', fontWeight: 500 }}>{title}</h3>
            <p style={{ fontSize: '1.8rem', fontWeight: 700 }}>{value}</p>
        </div>
        <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: textColor === '#fff' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {icon}
        </div>
    </div>
);

export default AdminDashboard;
