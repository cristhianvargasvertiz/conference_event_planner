// store.js
import { configureStore } from '@reduxjs/toolkit';
import venueReducer from './venueSlice'; // podria ser venueSlice pero por convencion le llaman venueReducer
import avReducer from './avSlice';
import mealsReducer from './mealsSlice';

export default configureStore({
  reducer: { 
    // La propiedad 'reducer' extrae los reducers de los archivos correspondientes
    // y los asigna a la parte del estado correspondiente de la tienda
    // Por convención, se elimina el sufijo 'Slice' y se utiliza 'Reducer' para mayor claridad
    
    venue: venueReducer, // la sintaxis es name: reducer, se hace esto para despues solo invocar state.name y acceder a la logica de ese reducer
    av: avReducer,
    meals:mealsReducer 
    
    // despues cuando se useSelector para mover del initialState a otro estado invocado como state.name
    // ejemplo: useSelector((state) => state.name)
  },
});
