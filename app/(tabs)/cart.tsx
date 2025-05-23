import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { incrementQuantity, decrementQuantity, clearCart } from "../../redux/slices/cartSlices";
import { SafeAreaView } from "react-native-safe-area-context";
import { addOrder } from "../../redux/slices/orderSlice";

export default function CartScreen() {
    const dispatch = useDispatch();
    const cartItems = useSelector((state: RootState) => state.cart.items);

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

    const renderItem = ({ item }: any) => (
        <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
                <Text numberOfLines={1} style={styles.subtitle}>{item.title}</Text>
                <Text style={styles.price}>${(item.price * item.quantity).toFixed(2)}</Text>
                <View style={styles.controls}>
                    <TouchableOpacity onPress={() => dispatch(decrementQuantity(item.id))} style={styles.btn}>
                        <Text style={styles.btnText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.qty}>Quantity: {item.quantity}</Text>
                    <TouchableOpacity onPress={() => dispatch(incrementQuantity(item.id))} style={styles.btn}>
                        <Text style={styles.btnText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Cart</Text>
            <View style={{ flex: 1, padding: 16 }}>
                <Text style={styles.summary}>Items: {totalItems} | Total: ${totalPrice}</Text>
                <FlatList
                    data={cartItems}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ paddingVertical: 12 }}
                />
            </View>
            <View style={{ height: 1, backgroundColor: "#e0e0e0", marginVertical: 16 }} />
            <TouchableOpacity
                style={styles.checkoutbtn}
                onPress={() => {
                    if (cartItems.length === 0) {
                        alert("Your cart is empty.");
                        return;
                    }
                    dispatch(addOrder({ items: cartItems }));
                    dispatch(clearCart());
                    alert("Order placed successfully!");
                }}
            >
                <Text style={{ color: "#fff", textAlign: "center", fontSize: 18 }}>
                    Checkout
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
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
    },
    summary: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16,
        color: "#07689c",
        textAlign: "center",
        backgroundColor: "#42ecf5",
        borderRadius: 12,
        padding: 16,
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: "#e0e0e0",
    },
    image: {
        width: 60,
        height: 60,
        resizeMode: "contain",
        borderRadius: 8,
        marginRight: 12,
        backgroundColor: "#f5f5f5",
    },
    info: {
        flex: 1,
    },
    subtitle: {
        color: "#333",
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 4,
    },
    price: {
        color: "#007AFF",
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 8,
    },
    controls: {
        flexDirection: "row",
        alignItems: "center",
    },
    btn: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: "#07689c",
        justifyContent: "center",
        alignItems: "center",
    },
    btnText: {
        color: "#fff",
        fontSize: 18,
    },
    qty: {
        marginHorizontal: 12,
        fontSize: 16,
        fontWeight: "500",
    },
    checkoutbtn: {
        backgroundColor: "#007AFF",
        paddingVertical: 10,
        borderRadius: 8,
        width: "50%",
        marginTop: 5,
        alignSelf: "center",
    },
    topbox: {
        backgroundColor: "#f9f9f9",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
});
