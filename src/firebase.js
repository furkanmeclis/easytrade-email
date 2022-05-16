import instance from 'firebase/app';
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyDIiREZy-KiFPIeCUDnrBLOjfu_Hp1wr3E',
  authDomain: 'easytradeopportunities.firebaseapp.com',
  projectId: 'easytradeopportunities',
  storageBucket: 'easytradeopportunities.appspot.com',
  messagingSenderId: '434310500384',
  appId: '1:434310500384:web:6f835c00bb4b9ac2d4ac45',
};

const app = instance.initializeApp(firebaseConfig);
const db = instance.firestore();
const storage = instance.storage();
export {db,storage,app}
