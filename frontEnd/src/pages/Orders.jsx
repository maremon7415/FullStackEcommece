import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../contexts/ShopContextsProvider";
import Title from "../components/Title";
import axios from "axios";
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiX,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiEye,
  FiCalendar,
  FiCreditCard,
  FiMapPin,
} from "react-icons/fi";
import OrderDetailsModal from "./OrderDetailsModal";

const Orders = () => {
  const { token, currency, backendUrl, navigate } = useContext(ShopContext);
  const [ordersData, setOrdersData] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Load orders from backend
  const loadOrders = async () => {
    try {
      if (!token) {
        navigate("/login");
        return;
      }

      setLoading(true);
      const response = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        const orderItems = [];

        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            orderItems.push({
              ...item,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
              orderId: order._id,
              orderAmount: order.amount,
              address: order.address,
            });
          });
        });

        const sortedOrders = orderItems.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setOrdersData(sortedOrders);
        setFilteredOrders(sortedOrders);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter orders based on search and status
  useEffect(() => {
    let filtered = ordersData;

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.orderId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(
        (order) => order.status?.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    setFilteredOrders(filtered);
  }, [searchTerm, filterStatus, ordersData]);

  useEffect(() => {
    loadOrders();
  }, [token]);

  // Helper functions
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return <FiCheckCircle className="w-5 h-5 text-green-500" />;
      case "shipped":
      case "out for delivery":
        return <FiTruck className="w-5 h-5 text-blue-500" />;
      case "processing":
        return <FiClock className="w-5 h-5 text-yellow-500" />;
      case "cancelled":
        return <FiX className="w-5 h-5 text-red-500" />;
      case "order placed":
        return <FiPackage className="w-5 h-5 text-purple-500" />;
      default:
        return <FiPackage className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "shipped":
      case "out for delivery":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "order placed":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pageW py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Title text1="My" text2="Orders" />
              <p className="text-gray-600 mt-2">Track and manage your orders</p>
            </div>
            <button
              onClick={loadOrders}
              disabled={loading}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              <FiRefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by product name or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white min-w-[150px]"
              >
                <option value="all">All Orders</option>
                <option value="order placed">Order Placed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <LoadingSkeleton />
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-sm border text-center">
            <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {ordersData.length === 0
                ? "No orders yet"
                : "No orders match your filters"}
            </h3>
            <p className="text-gray-500 mb-6">
              {ordersData.length === 0
                ? "Start shopping to see your orders here"
                : "Try adjusting your search or filter criteria"}
            </p>
            {ordersData.length === 0 && (
              <button
                onClick={() => navigate("/shop")}
                className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Start Shopping
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((item, index) => (
              <div
                key={`${item.orderId}-${index}`}
                className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  <div className="flex items-start gap-4 flex-1">
                    <img
                      className="w-20 h-20 lg:w-24 lg:h-24 object-cover rounded-lg shadow-sm"
                      src={item.image?.[0]?.url || "/placeholder.jpg"}
                      alt={item.name}
                      onError={(e) => (e.target.src = "/placeholder.jpg")}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2 truncate">
                        {item.name || "Unknown Product"}
                      </h3>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">Price:</span>
                          <span className="ml-1 font-medium">
                            {currency}
                            {item.price}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Qty:</span>
                          <span className="ml-1 font-medium">
                            {item.quantity}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Size:</span>
                          <span className="ml-1 font-medium">{item.size}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Total:</span>
                          <span className="ml-1 font-medium">
                            {currency}
                            {(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <FiCalendar className="w-4 h-4" />
                          {formatDate(item.date)}
                        </div>
                        <div className="flex items-center gap-1">
                          <FiCreditCard className="w-4 h-4" />
                          {item.paymentMethod}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col lg:items-end gap-4 lg:min-w-[200px]">
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm border ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {getStatusIcon(item.status)}
                      {item.status || "Processing"}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => openOrderDetails(item)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <FiEye className="w-4 h-4" />
                        Details
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors">
                        <FiTruck className="w-4 h-4" />
                        Track
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <OrderDetailsModal
            order={selectedOrder}
            currency={currency}
            onClose={closeModal}
          />
        )}
      </div>
    </div>
  );
};

export default Orders;
