import { createSlice } from "@reduxjs/toolkit";

export const avSlice = createSlice({
  name: "av",
  initialState: [ // se establecen los Items o lo que seria "avItems"
        {
        img: "",
        name: "Projectors",
        cost: 200,
        quantity: 0,
    },
    {
        img: "",
        name: "Speaker",
        cost: 35,
        quantity: 0,
    },
    {
        img: "",
        name: "Microphones",
        cost: 45,
        quantity: 0,
    },
    {
        img: "",
        name: "Whiteboards",
        cost: 80,
        quantity: 0,
    },

    {
        img: "",
        name: "Signage",
        cost: 80,
        quantity: 0,
    },

  ],


  reducers: {
    
    incrementAvQuantity: (state, action) => { // state = InitialState, action = es lo que pasara a ser en lugar de state
        const item = state[action.payload]; // aqui se almacena en la variable "item" el index del estado inicial a traves de payload
        // payload es el index o identificador de los Items del estado inicial
        // actions por su naturaleza de reducer pasa dos parametros type (el nombre) y payload (el ID)
        // en este caso usando payload identificas el index del item para luego ejecutar la logica de incremento
        // por ejemplo si el payload (index) es 1 seria item = state[1] y de esta forma puede proceder a la logica de incremente
        if (item) {
            item.quantity++;
        }
    },
    decrementAvQuantity: (state, action) => {
        const item = state[action.payload];
        if (item && item.quantity > 0) {
            item.quantity--;
        }
    },
  },
});

export const { incrementAvQuantity, decrementAvQuantity } = avSlice.actions;

export default avSlice.reducer;