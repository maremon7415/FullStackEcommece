import {
  FiX,
  FiCalendar,
  FiCreditCard,
  FiMapPin,
  FiCheckCircle,
  FiTruck,
  FiClock,
  FiPackage,
  FiX as FiCancel,
} from "react-icons/fi";

const OrderDetailsModal = ({ order, currency, onClose }) => {
  if (!order) return null;

  const address = order.address?.[0];

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
        return <FiCancel className="w-5 h-5 text-red-500" />;
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

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold">Order Details</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Order ID</p>
              <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                {order.orderId}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Order Date</p>
              <p className="flex items-center gap-2">
                <FiCalendar className="w-4 h-4" />
                {formatDate(order.date)}
              </p>
            </div>
          </div>

          {/* Product Details */}
          <div className="border rounded-lg p-4">
            <div className="flex items-start gap-4">
              <img
                className="w-24 h-24 object-cover rounded-lg"
                src={order.image?.[0]?.url || "/placeholder.jpg"}
                alt={order.name}
              />
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-2">{order.name}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Price: </span>
                    <span className="font-medium">
                      {currency}
                      {order.price}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Quantity: </span>
                    <span className="font-medium">{order.quantity}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Size: </span>
                    <span className="font-medium">{order.size}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Total: </span>
                    <span className="font-medium">
                      {currency}
                      {(order.price * order.quantity).toFixed(2)}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">Payment: </span>
                    <span className="font-medium">
                      {order.payment ? "Paid" : "Not Paid"} (
                      {order.paymentMethod})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-2">Status</p>
              <div
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm border ${getStatusColor(
                  order.status
                )}`}
              >
                {getStatusIcon(order.status)}
                {order.status || "Processing"}
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {address && (
            <div>
              <p className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                <FiMapPin className="w-4 h-4" />
                Shipping Address
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium">
                  {address.firstName} {address.lastName}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {address.street}
                  <br />
                  {address.city}, {address.state} {address.zipCode}
                  <br />
                  {address.country}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Phone: {address.phone}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
