


          {/* 
          <Modal visible={isModalVisible} animationType="slide">
            <View style={styles.modalContainer}>
              <Text>Select Permission Type:</Text>
              <TouchableOpacity onPress={() => setPermissionType('read_only')}>
                <Text>Read Only</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setPermissionType('read_write')}>
                <Text>Read and Write</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleConfirmShare}>
                <Text>Share</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Text>Close</Text>
              </TouchableOpacity>
            </View>
          </Modal> */}


          
//   {/* מודל השיתוף */}
//   <Modal visible={isModalVisible} animationType="slide" transparent={true}>
//   <View style={styles.modalOverlay}>
//     <View style={styles.modalContainer}>
//       <Text style={styles.modalTitle}>Select Permission Type:</Text>

//       <View style={styles.optionContainer}>
//         <CheckBox
//           value={isReadOnlySelected}
//           onValueChange={() => handlePermissionSelect('read_only')}
//           style={styles.checkbox}
//         />
//         <Text style={styles.optionText}>Read Only</Text>
//       </View>

//       <View style={styles.optionContainer}>
//         <CheckBox
//           value={isFullAccessSelected}
//           onValueChange={() => handlePermissionSelect('full_access')}
//           style={styles.checkbox}
//         />
//         <Text style={styles.optionText}>Full Access</Text>
//       </View>

//       <TouchableOpacity onPress={handleConfirmShare} style={styles.confirmButton}>
//         <Text style={styles.confirmButtonText}>Share</Text>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeButton}>
//         <Ionicons name="close-circle" size={24} color="gray" />
//       </TouchableOpacity>
//     </View>
//   </View>
// </Modal>

































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

