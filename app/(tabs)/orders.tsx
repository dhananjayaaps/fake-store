import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrders, updateOrder } from "../../redux/slices/orderSlice";
import { AppDispatch, RootState } from "../../redux/store";

type OrderStatus = "new" | "paid" | "delivered" | "cancelled";

export default function OrdersScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { items: orders, status, error } = useSelector((state: RootState) => state.orders);
  const [expandedOrders, setExpandedOrders] = useState<{ [key: string]: boolean }>({});
  const [refreshing, setRefreshing] = useState(false);

  // Fetch orders on initial load
  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchUserOrders()).unwrap();
    } catch (err) {
      Alert.alert("Error", "Failed to refresh orders");
    } finally {
      setRefreshing(false);
    }
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const handleStatusUpdate = async (id: string, status: OrderStatus) => {
    try {
      await dispatch(updateOrder({ id, status })).unwrap();
      Alert.alert("Success", `Order marked as ${status}`);
    } catch (error) {
      Alert.alert("Error", `Failed to update order status: ${error}`);
    }
  };

 const renderOrder = ({ item }: { item: any }) => {
    const isExpanded = expandedOrders[item._id];

    return (
      <View style={styles.card}>
        <TouchableOpacity onPress={() => toggleExpand(item._id)} style={styles.header}>
          <View>
            <Text style={styles.orderId}>Order #{item._id ? item._id.slice(-6).toUpperCase() : 'N/A'}</Text>
            <Text style={styles.meta}>
              {item.items.length} items • ${item.total.toFixed(2)}
            </Text>
            <Text style={[styles.statusBadge, {
              backgroundColor:
                item.status === 'new' ? '#FFA50020' :
                  item.status === 'paid' ? '#00800020' :
                    '#00008020',
              color:
                item.status === 'new' ? '#FFA500' :
                  item.status === 'paid' ? '#008000' :
                    '#000080'
            }]}>
              {item.status.toUpperCase()}
            </Text>
          </View>
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={20}
            color="#333"
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.details}>
            {item.items.map((product: any) => (
              <View key={`${item._id}-${product._id}`} style={styles.itemRow}>
                <Image
                  source={{ uri: product.image }}
                  style={styles.image}
                  resizeMode="contain"
                />
                <View style={styles.productInfo}>
                  <Text numberOfLines={2} style={styles.title}>{product.title}</Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.price}>${product.price.toFixed(2)}</Text>
                    <Text style={styles.quantity}>× {product.quantity}</Text>
                  </View>
                </View>
              </View>
            ))}

            <View style={styles.actions}>
              {item.status === "new" && (
                <>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.payButton]}
                    onPress={() => handleStatusUpdate(item._id, "paid")}
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Pay Now</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.cancelButton]}
                    onPress={() => handleStatusUpdate(item._id, "cancelled")}
                    disabled={status === 'loading'}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </>
              )}
              {item.status === "paid" && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.deliverButton]}
                  onPress={() => handleStatusUpdate(item._id, "delivered")}
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Mark as Delivered</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderCategory = (status: OrderStatus) => {
    const filteredOrders = orders.filter(order => order.status === status);

    if (filteredOrders.length === 0) return null;

    return (
      <View key={status}>
        <Text style={styles.statusHeader}>
          {status.toUpperCase()} ORDERS ({filteredOrders.length})
        </Text>
        <FlatList
          data={filteredOrders}
          keyExtractor={item => item._id}
          renderItem={renderOrder}
          scrollEnabled={false}
        />
      </View>
    );
  };

  if (status === 'loading' && !refreshing && orders.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#07689c" />
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load orders</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => dispatch(fetchUserOrders())}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>My Orders</Text>

      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={60} color="#e0e0e0" />
          <Text style={styles.emptyText}>No orders yet</Text>
          <Text style={styles.emptySubtext}>Your orders will appear here</Text>
        </View>
      ) : (
        <FlatList
          data={['new', 'paid', 'delivered'] as OrderStatus[]}
          renderItem={({ item }) => renderCategory(item)}
          keyExtractor={(item) => item}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#07689c']}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ff0000',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#07689c',
    padding: 12,
    borderRadius: 6,
    minWidth: 100,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
    marginBottom: 20,
    letterSpacing: 1.2,
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -50,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  statusHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    color: "#07689c",
    paddingHorizontal: 4,
  },
  card: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    backgroundColor: "#fdfdfd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderId: {
    fontSize: 16,
    fontWeight: "600",
  },
  meta: {
    fontSize: 14,
    color: "gray",
    marginTop: 2,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 6,
    fontSize: 12,
    fontWeight: '500',
  },
  details: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
  },
  priceRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: '#07689c',
  },
  quantity: {
    fontSize: 14,
    color: "gray",
    marginLeft: 8,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 16,
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  payButton: {
    backgroundColor: '#07689c',
  },
  cancelButton: {
    backgroundColor: '#ff4444',
  },
  deliverButton: {
    backgroundColor: '#00aa00',
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});