import React from 'react'
import { useReducer } from 'react'
import DigitButton from './DigitButton'
import OperationButton from './OperationButton'

export const ACTION={
    ADD_DIGIT : "add_digit",
    CHOOSE_OPERATION : "choose_operation",
    CLEAR : 'clear',
    DELETE_DIGIT : "delete_digit",
    EVALUATE : 'evaluate'
}
function reducer(state,{type,payload}){
    switch(type)
    {
        case ACTION.ADD_DIGIT:
            if(state.overwrite)
            {
                return{
                    ...state,
                    currrentOperand:payload.digit,
                    overwrite:false
                }
            }
            if(payload.digit==="0" && state.currrentOperand==="0"){
                return state;
            }
            if(payload.digit==="." && state.currrentOperand.includes(".")){
                return state;
            }
            
            return{
                ...state,
                currrentOperand : `${state.currrentOperand || ""}${payload.digit}`
            }
        case ACTION.DELETE_DIGIT:
            if(state.overwrite)
            {
                return{
                    ...state,
                    overwrite:false,
                    currrentOperand:null
                }
            }
            if(state.currrentOperand==null)
            {
                    return state
            }
            if(state.currrentOperand.length===1)
            {
                return {
                    ...state,
                    currrentOperand:null,
                }
            }
            return{
                ...state,
                currrentOperand : state.currrentOperand.slice(0,-1)
            }
        case ACTION.CHOOSE_OPERATION:
            if(state.currrentOperand==null && state.prevOperand==null)
            {
                return state
            }
            if(state.prevOperand==null)
            {
                return {
                    ...state,
                    operation : payload.operation,
                    prevOperand : state.currrentOperand,
                    currrentOperand : null
                }
            }
            if(state.currrentOperand==null)
            {
                return{
                    ...state,
                    operation : payload.operation
                }
            }
            return {
                ...state,
                prevOperand : evaluate(state),
                operation : payload.operation,
                
                currrentOperand :null
            }
        case ACTION.EVALUATE:
            if(state.currrentOperand==null || state.prevOperand==null || state.operation==null)
            {
                return state
            }
            return {
                ...state,
                overwrite: true,
                operation : null,
                prevOperand :null,
                currrentOperand:evaluate(state)
            }
        case ACTION.CLEAR:
            return {}
        
    }
}
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us",{
    maximumFractionDigits:0,
})
function formatOperand(operand){
    if(operand==null) return
    const [integer,decimal] = operand.split(".")
    if(decimal==null) return INTEGER_FORMATTER.format(integer)
    
    return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}
function evaluate({currrentOperand,prevOperand,operation})
{
    const prev = parseFloat(prevOperand)
    const curr = parseFloat(currrentOperand)
    let computation =""
    switch(operation)
    {
        case "+":
            computation = prev+curr
            break
        case "-":
            computation = prev-curr
            break
        case "*":
            computation = prev*curr
            break
        case "/":
            computation = prev/curr
            break
            
    }
    return computation.toString();
}
export default function Calci() {
    const [{currrentOperand,prevOperand, operation}, dispatch] = useReducer(reducer,{})
    // dispatch({type: ACTION.ADD_DIGIT,payload:{digit:1}})
  return (
    <div className='App'>
        <div className="container">
            <div className="display_screen">
                <div className='previosoperand'>{formatOperand(prevOperand)}</div>
                <div className='currentoperand'>{formatOperand(currrentOperand)}{operation}</div>
                
            </div>
            <div className="operators">
                <button className='erase_button1' onClick={()=>dispatch({type:ACTION.CLEAR})}>AC</button>
                <button className='erase_button2' onClick={()=>dispatch({type:ACTION.DELETE_DIGIT})}>DEL</button>
                <OperationButton operation="/" dispatch={dispatch}/>
                <OperationButton operation="*" dispatch={dispatch}/>
                <OperationButton operation="+" dispatch={dispatch}/>
                <OperationButton operation="-" dispatch={dispatch}/>
            </div>
            <div className="digits">
                 <DigitButton digit="7" dispatch={dispatch}/>
                 <DigitButton digit="8" dispatch={dispatch}/>
                 <DigitButton digit="9" dispatch={dispatch}/>
                 <DigitButton digit="4" dispatch={dispatch}/>
                 <DigitButton digit="5" dispatch={dispatch}/>
                 <DigitButton digit="6" dispatch={dispatch}/>
                 <DigitButton digit="1" dispatch={dispatch}/>
                 <DigitButton digit="2" dispatch={dispatch}/>
                 <DigitButton digit="3" dispatch={dispatch}/>
                 

                 <DigitButton digit="." dispatch={dispatch}/>
                 <DigitButton digit="0" dispatch={dispatch}/>
                 <button onClick={()=>{dispatch({type:ACTION.EVALUATE})}}>=</button>
            </div>
        </div>
    </div>
  )
}
