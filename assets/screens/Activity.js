import React from 'react';
import { View, Text, StyleSheet} from 'react-native';


// import React from 'react';
// import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Button } from 'react-native';

// // Local images
// const Image1 = require('../images/photo1.jpg');
// const Image2 = require('../images/photo2.jpg');
// const Image3 = require('../images/photo3.jpg');

// // Sample event data
// const carnivalActivities = [
//     {
//         id: '1',
//         title: 'Parade du Carnaval',
//         date: '2024-10-20', // ISO format for easier comparison
//         time: '15h00 - 18h00',
//         description: 'Une parade avec musique et chars colorés.',
//         image: Image1,
//     },
//     {
//         id: '2',
//         title: 'Concert de Musique',
//         date: '2024-10-21',
//         time: '19h00 - 22h00',
//         description: 'Un concert avec des artistes locaux.',
//         image: Image2,
//     },
//     {
//         id: '3',
//         title: 'Feu d\'artifice',
//         date: '2024-10-22',
//         time: '21h00 - 22h00',
//         description: 'Un spectacle de feux d\'artifice.',
//         image: Image3,
//     },
// ];

// const Activity = () => {
//     const renderItem = ({ item }) => (
//         <View style={styles.item}>
//             <Image source={item.image} style={styles.image} />
//             <Text style={styles.title}>{item.title}</Text>
//             <Text style={styles.date}>{item.date}</Text>
//             <Text style={styles.time}>{item.time}</Text>
//             <Text style={styles.description}>{item.description}</Text>
//         </View>
//     );

//     return (
//         <FlatList
//             data={carnivalActivities}
//             renderItem={renderItem}
//             keyExtractor={item => item.id}
//         />
//     );
// };

// const styles = StyleSheet.create({
//     item: {
//         padding: 10,
//         marginVertical: 8,
//         marginHorizontal: 16,
//         backgroundColor: '#fff',
//         borderRadius: 5,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.8,
//         shadowRadius: 2,
//         elevation: 1,
//     },
//     image: {
//         width: '100%',
//         height: 200,
//         borderRadius: 5,
//     },
//     title: {
//         fontSize: 18,
//         fontWeight: 'bold',
//     },
//     date: {
//         fontSize: 14,
//         color: '#888',
//     },
//     time: {
//         fontSize: 14,
//         color: '#888',
//     },
//     description: {
//         fontSize: 16,
//         marginTop: 5,
//     },
// });

// export default Activity;

const Activity = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Page en développement</Text>
            <Text style={styles.subtext}>Cette fonctionnalité est encore en cours de développement. Revenez plus tard pour plus de détails.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    text: {
        fontSize: 19,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subtext: {
        fontSize: 16,
        color: '#888',
        marginTop: 10,
        textAlign: 'center',
    },
});

export default Activity;
