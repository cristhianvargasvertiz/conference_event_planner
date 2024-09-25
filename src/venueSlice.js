// venueSlice.js
// breaks down the application states into smaller features, helping organize your code, making it easier to read and simpler maintain

import { createSlice } from "@reduxjs/toolkit";

export const venueSlice = createSlice({
  name: "venue",
  initialState: [ // estado inicial de cada Item o venueItems pero en este caso solo se modificaran "quantity"
    {
      img: "https://pixabay.com/images/download/chairs-2181916_640.jpg", // thumbnail
      name: "Conference Room (Capacity:15)", // name service
      cost: 3500, // Cost
      quantity: 0, // Initial Quantity that it will be change
    },
    {
      img: "https://pixabay.com/images/download/event-venue-1597531_640.jpg",
      name: "Auditorium Hall (Capacity:200)",
      cost: 5500,
      quantity: 0,
    },
    {
      img: "https://pixabay.com/images/download/convention-center-3908238_640.jpg",
      name: "Presentation Room (Capacity:50)",
      cost: 700,
      quantity: 0,
    },
    {
      img: "https://pixabay.com/images/download/chairs-2181916_640.jpg", // thumbnail
      name: "Large Meeting Room (Capacity:10)", // name service
      cost: 900, // Cost
      quantity: 0, // Initial Quantity that it will be change
    },
    {
      img: "https://pixabay.com/images/download/laptops-593296_640.jpg",
      name: "Small Meeting Room (Capacity:5)",
      cost: 1100,
      quantity: 0,
    },
  
  ],
  reducers: {
   
    incrementQuantity: (state, action) => { // aca state = initialState y action es lo que pasara lineas abajo

      const { payload: index } = action; // actions por su naturaleza de reducer pasa dos parametros type y payload
      if (state[index]) { // se refiere al index de los elementos con relacion a initialState = state
        if (state[index].name === "Auditorium Hall (Capacity:200)" && state[index].quantity >= 3) 
          {return;} // Guard clause: interrumpe la ejecución si la cantidad es 3 o más.
          
        state[index].quantity++; // // Incrementa la cantidad del elemento
      }
    },
    decrementQuantity: (state, action) => {
      const { payload: index } = action;
      if (state[index] && state[index].quantity > 0) {
        state[index].quantity--;
      }
    },
  },
});

export const { incrementQuantity, decrementQuantity } = venueSlice.actions;

export default venueSlice.reducer;
