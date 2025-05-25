import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { incrementQuantity, decrementQuantity, clearCart } from "../../redux/slices/cartSlices";
import { SafeAreaView } from "react-native-safe-area-context";
import { addOrder } from "../../redux/slices/orderSlice";
import { fetchCart } from "../../redux/slices/cartSlices";
import { useEffect } from "react";

export default function CartScreen() {
    const dispatch = useDispatch<AppDispatch>();
    const { items, status, error } = useSelector((state: RootState) => state.cart);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2);

    type CartItem = {
        id: string;
        quantity: number;
        product: {
            id: string | number;
            title: string;
            price: number;
            image: string;
        };
    };
    
        const renderItem = ({ item }: { item: CartItem }) => (
        <View style={styles.card}>
            <Image source={{ uri: item.product.image }} style={styles.image} />
            <View style={styles.info}>
                <Text numberOfLines={1} style={styles.subtitle}>{item.product.title}</Text>
                <Text style={styles.price}>${(item.product.price * item.quantity).toFixed(2)}</Text>
                <View style={styles.controls}>
                    <TouchableOpacity 
                        onPress={() => dispatch(decrementQuantity(item.id))} 
                        style={styles.btn}
                    >
                        <Text style={styles.btnText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.qty}>Quantity: {item.quantity}</Text>
                    <TouchableOpacity 
                        onPress={() => dispatch(incrementQuantity(item.id))} 
                        style={styles.btn}
                    >
                        <Text style={styles.btnText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    if (status === 'loading') {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#07689c" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity 
                    onPress={() => dispatch(fetchCart())}
                    style={styles.retryButton}
                >
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Cart</Text>
            <View style={{ flex: 1, padding: 16 }}>
                <Text style={styles.summary}>Items: {totalItems} | Total: ${totalPrice}</Text>
                {items.length === 0 ? (
                    <View style={styles.emptyCart}>
                        <Text style={styles.emptyCartText}>Your cart is empty</Text>
                    </View>
                ) : (
                    <FlatList
                        data={items}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={{ paddingVertical: 12 }}
                    />
                )}
            </View>
            {items.length > 0 && (
                <>
                    <View style={{ height: 1, backgroundColor: "#e0e0e0", marginVertical: 16 }} />
                    <TouchableOpacity
                        style={styles.checkoutbtn}
                        onPress={() => {
                            dispatch(addOrder({ items: items.map(item => ({ ...item.product, quantity: item.quantity })) }));
                            dispatch(clearCart());
                            alert("Order placed successfully!");
                        }}
                    >
                        <Text style={{ color: "#fff", textAlign: "center", fontSize: 18 }}>
                            Checkout
                        </Text>
                    </TouchableOpacity>
                </>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#fff",
        flex: 1,
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
        padding: 10,
        borderRadius: 5,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
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
    emptyCart: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyCartText: {
        fontSize: 18,
        color: '#666',
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
});