import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Search, Trash2, Edit2, Save, X, Users, ShoppingCart, BarChart3, Menu } from 'lucide-react';
import AdminSidebar from './AdminSidebar';

export default function AdminUsers() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const menuItems = [
        { icon: BarChart3, label: 'Dashboard', path: '/admin/dashboard', color: 'text-blue-500' },
        { icon: Users, label: 'Manage Users', path: '/admin/users', color: 'text-purple-500' },
        { icon: ShoppingCart, label: 'Manage Items', path: '/admin/items', color: 'text-orange-500' },
        { icon: ShoppingCart, label: 'Manage Orders', path: '/admin/orders', color: 'text-green-500' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    useEffect(() => { fetchUsers(); }, []);

    async function fetchUsers() {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:8000/api/admin/users.php?action=list', {
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('authToken') }
            });
            const json = await res.json();
            if (json.success) setUsers(json.users || []);
        } catch (e) {
            console.error(e);
        } finally { setLoading(false); }
    }

    const openEdit = (u) => setEditing({ ...u });

    const saveEdit = async () => {
        if (!editing) return;
        setSaving(true);
        try {
            const res = await fetch('http://localhost:8000/api/admin/users.php?action=update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('authToken')
                },
                body: JSON.stringify(editing)
            });
            const json = await res.json();
            if (json.success) {
                setEditing(null);
                await fetchUsers();
            } else {
                alert(json.message || 'Failed to save');
            }
        } catch (e) {
            console.error(e);
            alert('Error saving user');
        } finally { setSaving(false); }
    };

    const askDelete = (id) => setDeleteTarget(id);

    const confirmDelete = async (id) => {
        try {
            const res = await fetch(`http://localhost:8000/api/admin/users.php?action=delete&id=${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('authToken') }
            });
            const json = await res.json();
            if (json.success) setUsers(prev => prev.filter(p => p.id !== id));
            else alert(json.message || 'Delete failed');
        } catch (e) {
            console.error(e);
            alert('Error deleting user');
        } finally { setDeleteTarget(null); }
    };

    const filtered = users.filter(u => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return (u.name || '').toLowerCase().includes(q)
            || (u.email || '').toLowerCase().includes(q)
            || (u.phone || '').toLowerCase().includes(q);
    });

    return (
        <div className="flex h-screen bg-gray-100">
            <AdminSidebar sidebarOpen={sidebarOpen} user={user} handleLogout={handleLogout} menuItems={menuItems} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="bg-white shadow-sm border-b border-gray-200">
                    <div className="px-6 py-4 flex items-center justify-between">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-bold text-gray-800">Users</h2>
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                            {user.name?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <div className="flex items-center">
                                <button
                                    onClick={() => navigate('/admin/dashboard')}
                                    className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <h1 className="text-2xl font-bold text-gray-800">Users</h1>
                            </div>
                            <p className="text-sm text-gray-500">Manage registered users and roles.</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center border rounded-lg px-3 py-2 w-96">
                                <Search className="w-4 h-4 text-gray-400 mr-2" />
                                <input
                                    placeholder="Search name, email or phone"
                                    className="flex-1 outline-none"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        {loading ? (
                            <div className="p-8 text-center text-gray-500">Loading users...</div>
                        ) : (
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="text-left px-4 py-3">User</th>
                                        <th className="text-left px-4 py-3">Email</th>
                                        <th className="text-left px-4 py-3">Phone</th>
                                        <th className="text-left px-4 py-3">Role</th>
                                        <th className="text-left px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(u => (
                                        <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b hover:bg-gray-50">
                                            <td className="px-4 py-3 flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">{(u.name || 'U').split(' ').map(p => p[0]).slice(0, 2).join('')}</div>
                                                <div>
                                                    <div className="font-medium">{u.name}</div>
                                                    <div className="text-xs text-gray-500">ID: {u.id}</div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">{u.email}</td>
                                            <td className="px-4 py-3">{u.phone || '—'}</td>
                                            <td className="px-4 py-3">
                                                <span className="inline-block px-2 py-1 text-xs rounded bg-gray-100 capitalize">{u.role}</span>
                                            </td>
                                            <td className="px-4 py-3">{u.status === 1 ? <span className="text-green-600">Active</span> : <span className="text-red-600">Inactive</span>}</td>
                                            <td className="px-4 py-3 text-center">
                                                <button onClick={() => openEdit(u)} className="p-2 mr-2 text-blue-600 hover:bg-blue-50 rounded">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => askDelete(u.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Delete Modal */}
                    {deleteTarget && (
                        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                            <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
                                <h3 className="text-lg font-semibold mb-2">Delete user</h3>
                                <p className="text-sm text-gray-600 mb-4">This action cannot be undone. Are you sure?</p>
                                <div className="flex justify-end gap-3">
                                    <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                                    <button onClick={() => confirmDelete(deleteTarget)} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {/* Edit Modal */}
                    {editing && (
                        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                            <motion.div initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold">Edit user</h3>
                                    <button onClick={() => setEditing(null)} className="p-1 text-gray-500"><X /></button>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm text-gray-600">Name</label>
                                        <input className="w-full border rounded px-3 py-2" value={editing.name || ''} onChange={e => setEditing({ ...editing, name: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">Email</label>
                                        <input className="w-full border rounded px-3 py-2" value={editing.email || ''} onChange={e => setEditing({ ...editing, email: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">Password</label>
                                        <input type="password" className="w-full border rounded px-3 py-2" placeholder="Leave empty to keep current password" value={editing.password || ''} onChange={e => setEditing({ ...editing, password: e.target.value })} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-sm text-gray-600">Phone</label>
                                            <input className="w-full border rounded px-3 py-2" value={editing.phone || ''} onChange={e => setEditing({ ...editing, phone: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600">Role</label>
                                            <select className="w-full border rounded px-3 py-2" value={editing.role} onChange={e => setEditing({ ...editing, role: e.target.value })}>
                                                <option value="customer">Customer</option>
                                                <option value="restaurant">Restaurant</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">Status</label>
                                        <select className="w-full border rounded px-3 py-2" value={editing.status} onChange={e => setEditing({ ...editing, status: parseInt(e.target.value) })}>
                                            <option value={1}>Active</option>
                                            <option value={0}>Inactive</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-6">
                                    <button onClick={() => setEditing(null)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                                    <button onClick={saveEdit} disabled={saving} className="px-4 py-2 bg-green-600 text-white rounded flex items-center gap-2">{saving ? 'Saving...' : <><Save className="w-4 h-4" /> Save</>}</button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
