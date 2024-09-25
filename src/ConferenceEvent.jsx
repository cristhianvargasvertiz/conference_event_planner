
import React, { useState } from "react";
import "./ConferenceEvent.css";
import TotalCost from "./TotalCost";
import { useSelector, useDispatch } from "react-redux";
import { incrementQuantity, decrementQuantity } from "./venueSlice";
import { incrementAvQuantity, decrementAvQuantity } from "./avSlice";
import { toggleMealSelection } from "./mealsSlice";


// -----------------------------------------------------------------------------------------------------------------------

const ConferenceEvent = () => { // esta es la funcion principal del archivo que sera exportado al final

    const [showItems, setShowItems] = useState(false); // al establecer el estado inicial como "false", obliga a que el unico estado opuesto posible sea "true" 
    const [numberOfPeople, setNumberOfPeople] = useState(1);
    
    // --------------------------------------------------------------------------------------------------------------------

    const venueItems = useSelector((state) => state.venue); // establece la variable venueItems, el metodo ".venue" se establece por la propiedad name:"venue" del slice venueSlice, que hace que se genere una suscripcion entonces si "estado initial" cambia este actualiza con los cambios y su vez actualiza a venueItems 
    const avItems = useSelector((state) => state.av); // establece la variable avItems, useSelector() suscribe los cambios del initialState de av en avItems 
    const mealsItems = useSelector((state) => state.meals); // establece la variable mealsItems, useSelector() suscribe los cambios del initialState de meals en mealsItems

    // --------------------------------------------------------------------------------------------------------------------
    
    const dispatch = useDispatch(); // para importar los reducers de los slices para el documento jsx

    // --------------------------------------------------------------------------------------------------------------------

    const remainingAuditoriumQuantity = 3 - venueItems.find(item => item.name === "Auditorium Hall (Capacity:200)").quantity; // establece una logica especial  
    
    // en esta logica señala que la variable comienza con 3 - menos la coincidencia de cantidad de la variable "Auditorium Hall (Capacity:200)"
    // como solo hay un item.name = "Auditorium Hall (Capacity:200)", solo afectara a esa unica variable
    // entonces cuando haga un click sumara 3 - 1 = 2, despues 3 - 2 = 1, 3 - 3 = 0 
    // lineas mas abajo la variable remainingAuditoriumQuantity sera sometida a un operador ternario (variable ? (..) : (..)) cuando llegue a cero se cambira de estilo CSS
    
    // --------------------------------------------------------------------------------------------------------------------

    const handleToggleItems = () => {
        console.log("handleToggleItems called");
        setShowItems(!showItems); // esta funcion genera un swicht que alterna dos estados opuestos cuando se va actualizando
    };

    // --------------------------------------------------------------------------------------------------------------------

    const handleAddToCart = (index) => {
        if (venueItems[index].name === "Auditorium Hall (Capacity:200)" && venueItems[index].quantity >= 3) {
          // este codigo hace que los numeros de click mayores o iguales a 3 para las coincidencias establecidad no permitan que se incremente
          // es decir llegara a 3 y se desabilitara solo para "Auditorium Hall (Capacity:200)"
          return; // Guard clause: interrumpe la ejecución si la cantidad es 3 o más.
        }
        dispatch(incrementQuantity(index)); // la logica de incrementQuantity esta funcion esta en venueSlice.js y se utiliza para construir la logica de la funcion handleAddToCart
      };
    
      const handleRemoveFromCart = (index) => {
        if (venueItems[index].quantity > 0) {
          dispatch(decrementQuantity(index)); // la logica de decrementQuantity esta funcion esta en venueSlice.js y se utiliza para construir la logica de la funcion handleRemoveFromToCart
        }
      };

    // --------------------------------------------------------------------------------------------------------------------

    const handleIncrementAvQuantity = (index) => { // la logica de esta funcion esta en avSlice.js
      dispatch(incrementAvQuantity(index));
    };

    const handleDecrementAvQuantity = (index) => { // la logica de esta funcion esta en avSlice.js
      dispatch(decrementAvQuantity(index));
    };

    // --------------------------------------------------------------------------------------------------------------------

    const handleMealSelection = (index) => { // se usa solo para el evento que desencadena checkbox (marcado o no marcado)
      const item = mealsItems[index];
        
      if (item.selected && item.type === "mealForPeople") { //  (desmarcado) si item ya cambio select a "true" y cumple con el type se cumple la condicion 
            
          // Ensure numberOfPeople is set before toggling selection
          
            const newNumberOfPeople = item.selected ? numberOfPeople : 0; // newNumberOfPeople se resetea o configura como initialstate 1 otra vez (cuando se desmarca)
            // para que llegue a este punto del codigo es porque item.selected = true
            // cuando eso pasa entonces "newNumberOfPeople" se resetea a su estado inicial "numberOfPeople" que es = 1  
            
            dispatch(toggleMealSelection(index, newNumberOfPeople)); // volvera a cambiar "false" como en su estado incial y newNumberOfPeople se reseta a 1 
            // newNumberOfPeople no afecta la logica de toggleMealSelection
        }
      
      else {
            dispatch(toggleMealSelection(index)); // se usa para cambiar la propiedadad select a "true" y pueda ser utilizado posteriormente
        }
    };
    
// --------------------------------------------------------------------------------------------------------------------
       
    const getItemsFromTotalCost = () => {
        const items = [];

        venueItems.forEach((item) => { // .forEach() se utiliza cuando quieres que el resultado de tu operacion sea devuelto como un tipo de dato como "Integer" y no como un array, esta es la diferencia con map() que devuelve una array
          if (item.quantity > 0) {
            items.push({ ...item, type: "venue" }); // push() es un operador para agregar elementos a un array
            // en este caso venueItems es una array con varios elementos como img, name, cost, quantity y a todos los que cumple la condicion (>0) le agrega el elemento type:"venue" para codificarlos
          }
        });

        avItems.forEach((item) => {
          if (item.quantity > 0 && !items.some((i) => i.name === item.name && i.type === "av")) 
            // .some() para verifica si algun elemento cumple con la condicion y devuelve un valor boolean
            // en este caso si la propiedad quantity es mayor que cero se cumple la condicion 
            // ademas si existe hay algun elemento coincida con el name y que tenga el type pasara falso por el operador (!)
            {
            items.push({ ...item, type: "av" });
            }
        });

        mealsItems.forEach((item) => {
          if (item.selected) {
            const itemForDisplay = { ...item, type: "meals" };
            
            if (item.numberOfPeople) {
              itemForDisplay.numberOfPeople = numberOfPeople;
            }
            items.push(itemForDisplay);
          }
        });
        return items;
      };
    
  
  // --------------------------------------------------------------------------------------------------------------------
    
    const items = getItemsFromTotalCost();

  // --------------------------------------------------------------------------------------------------------------------
    
    const ItemsDisplay = ({ items }) => { // recoger la variable items del array inicial de la Funcion getItemsFromTotalCost que se va llenando con los items selecionados
      console.log(items);
      return <>
          <div className="display_box1">
              {items.length === 0 && <p>No items selected</p>}
              <table className="table_item_data">
                  <thead>
                      <tr>
                          <th>Name</th>
                          <th>Unit Cost</th>
                          <th>Quantity</th>
                          <th>Subtotal</th>
                      </tr>
                  </thead>

                  <tbody>
                      {items.map((item, index) => (
                          <tr key={index}>
                              <td>{item.name}</td>
                              <td>${item.cost}</td>
                              <td>
                                  {item.type === "meals" || item.numberOfPeople // si es de tipo meals mostrara numberOfPeople sino mostrara item.que 
                                  ? ` For ${numberOfPeople} people`
                                  : item.quantity}
                              </td>
                              <td>{item.type === "meals" || item.numberOfPeople
                                  ? `${item.cost * numberOfPeople}`
                                  : `${item.cost * item.quantity}`}
                              </td>
                          </tr>
                      ))}
                  </tbody>

              </table>
          </div>
      </>
  };
      
    // --------------------------------------------------------------------------------------------------------------------

    const calculateTotalCost = (section) => {
        let totalCost = 0;

        if (section === "venue") {
          venueItems.forEach((item) => {
            totalCost += item.cost * item.quantity;
          });
        
        } else if (section === "av") {
            avItems.forEach((item) => {
              totalCost += item.cost * item.quantity;
          });

        } else if (section === "meals") {
          mealsItems.forEach((item) => {
              if (item.selected) {
                totalCost += item.cost * numberOfPeople;
              
              }
          });

        }

        return totalCost;
      
        };

    // --------------------------------------------------------------------------------------------------------------------

    const venueTotalCost = calculateTotalCost("venue");
    const avTotalCost = calculateTotalCost("av");
    const mealsTotalCost = calculateTotalCost("meals")

    // --------------------------------------------------------------------------------------------------------------------
    
    // a diferencia de los enlaces <a href> que te desplazan a la seccion indicada
    // "navigateToProducts" te muestra una section o te oculta otra
    // en este caso linea mas abajo veras que habra un operador ternario decidara entre mostrar "items-information" o "Total_amount_detail"

    const navigateToProducts = (idType) => { // esta funcion trabaja con la barra de navegacion
        if (idType == '#venue' || idType == '#addons' || idType == '#meals') { // cuando se pasa uno de esos valores como parametro se cumple la condicion
          if (showItems) { // Check if showItems is false
            setShowItems(!showItems); // Toggle showItems to true only if it's currently false
          }
        }
      }
    
    // --------------------------------------------------------------------------------------------------------------------
      
    const totalCosts = {
      venue : venueTotalCost,
      av : avTotalCost,
      meals: mealsTotalCost,
    };
  
      
    // -------------------------------------------------------------------------------------------------------------------  
    // -------------------------------------------------------------------------------------------------------------------  
    // -------------------------------------------------------------------------------------------------------------------  
    // -------------------------------------------------------------------------------------------------------------------  
    // -------------------------------------------------------------------------------------------------------------------  
    // -------------------------------------------------------------------------------------------------------------------  
    

    // Barra de navegacion -----------------------------------------------------------------------------------------------

    return (

        <>
            <navbar className="navbar_event_conference"> {/* navigation bar */}
                <div className="company_logo">Conference Expense Planner</div>
                <div className="left_navbar">
                    <div className="nav_links">
                        <a href="#venue" onClick={() => navigateToProducts("#venue")} >Venue</a> {/* estos enlaces te desplazan a la seccion correspondiente */}
                        <a href="#addons" onClick={() => navigateToProducts('#addons')}>Add-ons</a>
                        <a href="#meals" onClick={() => navigateToProducts('#meals')}>Meals</a>
                    </div>
                    <button className="details_button" onClick={() => setShowItems(!showItems)}>
                        Show Details
                    </button>
                </div>
            </navbar> {/* close navigation bar */}

    {/* -------------------------------------------------------------------------------------------------------------- */}

            <div className="main_container">
                
                {!showItems ? // cuando showItems sale de su estadio inicial se motrara items-information

                    (
                        <div className="items-information">

                             <div id="venue" className="venue_container container_main"> {/* aqui se estable #venue */}
        
        <div className="text">
          <h1>Venue Room Selection</h1>
        </div>

        <div className="venue_selection">

          {venueItems.map((item, index) => ( // itera por todas los items de venue y establece el index

            <div className="venue_main" key={index}>
              
              <div className="img">
                <img src={item.img} alt={item.name} />
              </div>
              <div className="text">{item.name}</div>
              <div>${item.cost}</div>

     <div className="button_container">

        {venueItems[index].name === "Auditorium Hall (Capacity:200)" ? (

          <>
          <button
            className={venueItems[index].quantity === 0 ? "btn-warning btn-disabled" : "btn-minus btn-warning"}
            onClick={() => handleRemoveFromCart(index)}
          >
            &#8211; {/* signo menos */}
          </button>

          <span className="selected_count">
            {venueItems[index].quantity > 0 ? `${venueItems[index].quantity}` : "0"} 
            {/* si es mayor que cero interpola la variables sino se convierte en una cadena "0" */}
          </span>
          
          <button
            className={remainingAuditoriumQuantity === 0 ? "btn-success btn-disabled" : "btn-success btn-plus"}
            onClick={() => handleAddToCart(index)}
          >
            &#43; {/* signo mas */}
          </button>
        </>
        ) 
        
        : // separador del operador ternario de la condicion {venueItems[index].name === "Auditorium Hall (Capacity:200)" ?
        
        (
          <div className="button_container">
           
           <button
              className={venueItems[index].quantity === 0 ? " btn-warning btn-disabled" : "btn-warning btn-plus"}
              onClick={() => handleRemoveFromCart(index)}
            >
               &#8211; {/* signo menos */}
            </button>

            <span className="selected_count">
              {venueItems[index].quantity > 0 ? ` ${venueItems[index].quantity}` : "0"}
            </span>

            <button
              className={venueItems[index].quantity === 10 ? " btn-success btn-disabled" : "btn-success btn-plus"}
              onClick={() => handleAddToCart(index)}
            >
             &#43; {/* signo mas */}
            </button>
            
            
          </div>
        )}

  {/* Total Cost Venue -------------------------------------------------------------------------------------------------------------- */}    

      </div>
            </div>
          ))}
        </div>
        <div className="total_cost">Total Cost: ${venueTotalCost}</div>
      </div>

  {/* -------------------------------------------------------------------------------------------------------------- */}

        {/*Necessary Add-ons*/}

        <div id="addons" className="venue_container container_main"> {/* aqui se estable #addons */}

        <div className="text">
            <h1> Add-ons Selection</h1>
        </div>
          
        <div className="addons_selection">

          {avItems.map((item, index) => ( // aqui itera por todos los items y establece el index que se usara en las logicas

            <div className="av_data venue_main" key={index}>
                
                <div className="img">
                    <img src={item.img} alt={item.name} /> 
                </div>
                <div className="text"> {item.name} </div>
                <div> ${item.cost} </div>

                <div className="addons_btn">

                    <button className="btn-warning" onClick={() => handleDecrementAvQuantity(index)}> &ndash; </button>
                    
                    <span className="quantity-value">{item.quantity}</span>

                    <button className=" btn-success" onClick={() => handleIncrementAvQuantity(index)}> &#43; </button>
                </div>
            </div>
        ))}

{/* Total Cost Av -------------------------------------------------------------------------------------------------------------- */}    

                                
                                </div>
                                
                                <div className="total_cost">Total Cost:${avTotalCost}</div>

                                </div>

{/* Meal Section -------------------------------------------------------------------------------------------------------------- */}

                            {/* Meal Section */}

                            <div id="meals" className="venue_container container_main">
                              
                                <div className="text">
                                    <h1>Meals Selection</h1>
                                </div>

                                <div className="input-container venue_selection">

                                <div className="input-container venue_selection">

                      <label htmlFor="numberOfPeople"><h3>Number of People:</h3></label>
                      <input type="number" 
                             className="input_box5" 
                             id="numberOfPeople" 
                             value={numberOfPeople} // estadp inicial de numberOfPeople es 1
                             onChange={(e) => setNumberOfPeople(parseInt(e.target.value))} // el evento de desecadena cuando ingresas otro numero o usas los botones de incremento y decremento predeterminados
                             min="1"
            
            // el input type="number" viene con botones fecha de incremento y decremento predeterminados para este navegador
            // ademas cuenta con propiedades adicionales como min, max, step
            // (e.target.value) obtiene el valor actual del campo de entrada (input) donde el usuario está escribiendo
            // "e" es el evento que se dispara para el usuario cambia el input 
            // parseInt convierte a Integer el valor o en todo caso se asegura que sea Integer
            
            />             
                                </div>

                                </div>

                                <div className="meal_selection">

                                <div className="meal_selection">

                    {mealsItems.map((item, index) => ( // itera para crear checkboxes con meals items

                      <div className="meal_item" key={index} style={{ padding: 15 }}>
                          <div className="inner">
                              <input type = "checkbox" 
                                     id = { `meal_${index}` }
                                     checked = { item.selected }
                                     onChange = {() => handleMealSelection(index)}/> {/* el evento que desencadena el cambio onChange es que solo coloca una marca en la casilla del checkbox*/}

                        <label htmlFor={`meal_${index}`}> {item.name} </label> {/* establece los nombres de los meals para los checkboxes */}
                              
                        </div>
                            <div className="meal_cost">${item.cost}</div> {/* establece el costo de los meals para los checkboxes */}
                        </div>
                          ))}

                      </div>

  {/* Total Cost meals -------------------------------------------------------------------------------------------------------------- */}                                
                                
                                
                                </div>
                                <div className="total_cost">Total Cost: ${mealsTotalCost}</div>


                            </div>
                        </div>
                    ) 
                    
                    : // Separador de los operadores ternarios entre mostrar "items-information" o "Total_amount_detail"
                    
                    (
                        <div className="total_amount_detail">
                            <TotalCost totalCosts={totalCosts} handleClick={handleToggleItems} ItemsDisplay={() => <ItemsDisplay items={items} />} />
                        </div>
                    )
                }




            </div>
        </>

    );
};

export default ConferenceEvent;
