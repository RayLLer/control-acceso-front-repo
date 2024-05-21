import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyC_wsuM2qStOEnGXA4v9tHw5tMhTZd7EKc',
  authDomain: 'rosmetro-ee61b.firebaseapp.com',
  projectId: 'rosmetro-ee61b',
  storageBucket: 'rosmetro-ee61b.appspot.com',
  messagingSenderId: '953244967467',
  appId: '1:953244967467:web:e4bf5ad7c66fce637a406e',
};

export const firebaseApp = initializeApp(firebaseConfig);