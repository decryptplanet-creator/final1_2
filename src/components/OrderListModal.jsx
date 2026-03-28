import { X, Package, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/labelstatus';
import { Button } from './ui/button';
import { useTheme } from '../contexts/ThemeContext';
export function OrderListModal({ type, orders, onClose, onViewDetails }) {
  const { isDarkMode } = useTheme();

  const filteredOrders = orders.filter(order => {
    if (type === 'total') return true;
    if (type === 'active') return order.status === 'pending' || order.status === 'in-progress';
    if (type === 'completed') return order.status === 'completed';
    return false;
  });

  const getTitle = () => {
    switch (type) {
      case 'total':
        return 'All Orders';
      case 'active':
        return 'Active Orders';
      case 'completed':
        return 'Completed Orders';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'total':
        return <Package className="size-6 text-[#2563EB]" />;
      case 'active':
        return <Clock className="size-6 text-yellow-600" />;
      case 'completed':
        return <CheckCircle className="size-6 text-green-600" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-600/30">Pending</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-600/20 text-green-400 border-green-600/30">Completed</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className={`max-w-4xl w-full max-h-[80vh] overflow-hidden ${
        isDarkMode ? 'bg-[#2A3642] border-gray-800' : 'bg-white border-gray-200'
      }`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getIcon()}
              <div>
                <CardTitle className={isDarkMode ? 'text-white' : 'text-[#1F2933]'}>
                  {getTitle()}
                </CardTitle>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className={isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
            >
              <X className="size-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="overflow-y-auto max-h-[calc(80vh-100px)]">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className={`size-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                No orders found
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    isDarkMode 
                      ? 'bg-[#1F2933] border-gray-800 hover:border-gray-700' 
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    if (onViewDetails) {
                      onViewDetails(order);
                      onClose();
                    }
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>
                          {order.title}
                        </h4>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {order.description}
                      </p>
                    </div>
                    <ArrowRight className={`size-5 flex-shrink-0 ml-4 ${
                      isDarkMode ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <div>
                      <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>Order ID:</span>
                      <span className={`ml-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {order.id}
                      </span>
                    </div>
                    <div>
                      <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>Quantity:</span>
                      <span className={`ml-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {order.quantity}
                      </span>
                    </div>
                    <div>
                      <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>Budget:</span>
                      <span className={`ml-2 font-medium ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>
                        PKR {order.budget.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>Deadline:</span>
                      <span className={`ml-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {order.deadline}
                      </span>
                    </div>
                  </div>

                  {order.manufacturer && (
                    <div className={`mt-3 pt-3 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          Manufacturer:
                        </span>
                        <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {order.manufacturer.name}
                        </span>
                        <div className="flex items-center gap-1 ml-2">
                          <span className="text-yellow-400">★</span>
                          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {order.manufacturer.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Summary */}
          {filteredOrders.length > 0 && (
            <div className={`mt-6 p-4 rounded-lg border ${
              isDarkMode ? 'bg-[#1F2933] border-gray-800' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Total Orders:</span>
                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>
                  {filteredOrders.length}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Total Budget:</span>
                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>
                  PKR {filteredOrders.reduce((sum, order) => sum + order.budget, 0).toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
/*User ko orders (total / active / completed) list view me dikhata hai aur unki details open karne ka option deta hai.

Yeh web-based React component hai, lekin hybrid apps me bhi use ho sakta hai (dono ke liye). */