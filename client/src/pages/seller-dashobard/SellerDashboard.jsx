
import { Link, Outlet } from 'react-router-dom';

const SellerDashboard = () => {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-1/4 bg-gray-600 text-white">
                <ul className="p-4">
                    <li className="mb-4">
                        <span className="font-bold text-lg">Products</span>
                        <ul className="ml-4 mt-2">
                            <li className="mb-2">
                                <Link to="add-product" className="hover:text-blue-400">Add Product</Link>
                            </li>
                            <li>
                                <Link to="view-products" className="hover:text-blue-400">View Products</Link>
                            </li>
                            <li>
                                <Link to="view-all-posts" className="hover:text-blue-400">View Posts</Link>
                            </li>
                        </ul>
                    </li>
                </ul>
            </aside>

            {/* Main Content */}
            <main className="w-3/4 bg-gray-100 p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default SellerDashboard;
