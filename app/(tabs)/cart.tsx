import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { incrementQuantity, decrementQuantity } from "../../redux/slices/cartSlices";
import { SafeAreaView } from "react-native-safe-area-context";

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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        padding: 16,
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
});
