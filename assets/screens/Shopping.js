import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';

const ShoppingCart = () => {
    const [cartItems, setCartItems] = useState([
          { id: '2', name: 'Article 2', price: 49.99, description: 'Description pour l\'article 2' },
        { id: '3', name: 'Article 3', price: 19.99, description: 'Description pour l\'article 3' },
    ]);

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
            <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
        </View>
    );

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.price, 0).toFixed(2);
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={cartItems}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
            <View style={styles.totalContainer}>
                <Text style={styles.totalText}>Total: ${getTotalPrice()}</Text>
                <Button title="Passer à la caisse" onPress={() => alert('Procéder au paiement')} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    itemContainer: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    itemDescription: {
        fontSize: 14,
        color: '#666',
    },
    itemPrice: {
        fontSize: 16,
        color: '#000',
    },
    totalContainer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        alignItems: 'center',
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ShoppingCart;