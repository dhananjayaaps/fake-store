import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

type OrderStatus = "new" | "paid" | "delivered";

export default function OrdersScreen() {
  const orders = useSelector((state: RootState) => state.orders.items);
  const [expandedOrders, setExpandedOrders] = useState<{ [key: string]: boolean }>({});

  const toggleExpand = (orderId: string) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const renderOrder = ({ item }: any) => {
    const isExpanded = expandedOrders[item.id];

    return (
      <View style={styles.card}>
        <TouchableOpacity onPress={() => toggleExpand(item.id)} style={styles.header}>
          <View>
            <Text style={styles.orderId}>Order #{item.id}</Text>
            <Text style={styles.meta}>
              {item.items.length} items • ${item.total.toFixed(2)}
            </Text>
          </View>
          <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color="#333" />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.details}>
            {item.items.map((product: any) => (
              <View key={product.id} style={styles.itemRow}>
                <Image source={{ uri: product.image }} style={styles.image} />
                <View style={{ marginLeft: 10 }}>
                  <Text numberOfLines={1} style={styles.ordertitle}>{product.title}</Text>
                  <Text style={styles.quantity}>Qty: {product.quantity}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderCategory = (status: OrderStatus) => {
    const filteredOrders = orders.filter(order => order.status === status);

    if (filteredOrders.length === 0) return null;

    return (
      <View>
        <Text style={styles.statusHeader}>{status.toUpperCase()} ORDERS</Text>
        <FlatList
          data={filteredOrders}
          keyExtractor={item => item.id}
          renderItem={renderOrder}
          scrollEnabled={false}
        />
      </View>
    );
  };

  const allOrdersEmpty = orders.length === 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Orders</Text>

      {allOrdersEmpty ? (
        <Text style={styles.emptyText}>You have no orders yet.</Text>
      ) : (
        <>
          {renderCategory("new")}
          {renderCategory("paid")}
          {renderCategory("delivered")}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
    marginBottom: 20,
    letterSpacing: 1.2,
    marginTop: 20
  },
  statusHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    color: "#07689c",
  },
  card: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#fdfdfd",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderId: {
    fontSize: 14,
    fontWeight: "600",
  },
  meta: {
    fontSize: 12,
    color: "gray",
  },
  details: {
    marginTop: 10,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 6,
  },
  ordertitle: {
    fontSize: 13,
    fontWeight: "500",
    maxWidth: 240,
  },
  quantity: {
    fontSize: 12,
    color: "gray",
  },
  emptyText: {
    fontSize: 16,
    color: "gray",
    marginTop: 32,
    textAlign: "center",
  },
});
