// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
// import { RouteProp, useRoute } from '@react-navigation/native';
// import { RootStackParamList } from '../type';
// import { Ionicons, AntDesign } from '@expo/vector-icons';
// import { Entypo } from '@expo/vector-icons';


// type AddListDetailsRouteProp = RouteProp<RootStackParamList, 'AddListDetails'>;

// const testtttt: React.FC = () => {
//   const route = useRoute<AddListDetailsRouteProp>();
//   const { item } = route.params;
//   const [isMenuVisible, setIsMenuVisible] = useState(false);

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>{item.title}</Text>
//         <TouchableOpacity
//           onPress={() => setIsMenuVisible(true)}
//           style={styles.menuButton}
//         >
//         <Entypo name="dots-three-horizontal" size={35} color="black" />
//         </TouchableOpacity>
//       </View>
//       <Text style={styles.description}>Description: {item.description}</Text>
//       <Text style={styles.date}>Date Created: {item.date_created}</Text>
//       <Text style={styles.status}>Status: {item.is_active ? 'Active' : 'Inactive'}</Text>

//       <Modal visible={isMenuVisible} transparent={true} animationType="slide">
//         <View style={styles.modalBackground}>
//           <TouchableOpacity style={styles.iconContainer}>
//             <Ionicons name="list-circle-outline" size={50} color="white" />
//             <Text style={styles.iconLabel}>Add List</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.iconContainer}>
//             <Ionicons name="color-palette-outline" size={50} color="white" />
//             <Text style={styles.iconLabel}>Background</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.iconContainer}>
//             <Ionicons name="text-outline" size={50} color="white" />
//             <Text style={styles.iconLabel}>Text Color</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.iconContainer}>
//             <Ionicons name="share-outline" size={50} color="white" />
//             <Text style={styles.iconLabel}>Share</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.iconContainer}>
//             <AntDesign name="delete" size={50} color="white" />
//             <Text style={styles.iconLabel}>Delete</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => setIsMenuVisible(false)} style={styles.iconContainer}>
//             <Ionicons name="close-circle-outline" size={50} color="white" />
//             <Text style={styles.iconLabel}>Close</Text>
//           </TouchableOpacity>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   description: {
//     fontSize: 18,
//     marginBottom: 10,
//   },
//   date: {
//     fontSize: 16,
//     marginBottom: 10,
//   },
//   status: {
//     fontSize: 16,
//     color: 'green',
//   },
//   menuButton: {
//     padding: 10,
//   },
//   modalBackground: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   iconContainer: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   iconLabel: {
//     color: 'white',
//     fontSize: 16,
//     marginTop: 8,
//   },
// });

// export default testttttt;

