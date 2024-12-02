// Import the Firebase SDK and initialize Firebase
const firebase = require("firebase/compat/app");
require("firebase/compat/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyBiVD74lGlaAhmRNJ-OuIgXtYs3BwnppXk",
  authDomain: "subproject-96426.firebaseapp.com",
  projectId: "subproject-96426",
  storageBucket: "subproject-96426.firebasestorage.app",
  messagingSenderId: "124321505047",
  appId: "1:124321505047:web:d8a58c372030dd5c712152",
  measurementId: "G-PY3DWTZV97",
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

// Get a reference to the "Product" collection
const collectionRef = db.collection("Products");

const addManualProduct = () => {
  const product = {
    name: "Cole Haan Men's Grandpro Ashland Laser Perf Sneaker",
    description:
      "A timeless take on the classic sport silhouette, this lace-up sneaker is crafted from luxurious leathers for a touch of elegance.",
    price: 160,
    quantity: 400,
    category: "Shoes",
    type: "",
    rating: "",
    mainImage: "https://m.media-amazon.com/images/I/71XF6ewbzSL._AC_SX500_.jpg",
    subImages: [
      {
        name: "Navy",
        img: "https://m.media-amazon.com/images/I/71XF6ewbzSL._AC_SX500_.jpg",
      },
      {
        name: "Sesame",
        img: "https://m.media-amazon.com/images/I/71zZbwrInJL._AC_SX395_.jpg",
      },
    ],
    sizes: [],
    createdAt: firebase.firestore.FieldValue.serverTimestamp(), // Thêm timestamp
  };

  const docRef = collectionRef.doc("S0000005"); // Tạo document với ID
  docRef
    .set(product)
    .then(() => {
      console.log("Sản phẩm đã được thêm vào Firestore");
    })
    .catch((error) => {
      console.error("Lỗi khi thêm sản phẩm: ", error);
    });
};

// Gọi hàm để thêm sản phẩm thủ công
addManualProduct();
