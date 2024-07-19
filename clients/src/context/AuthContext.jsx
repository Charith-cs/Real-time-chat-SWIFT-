import { createContext,useReducer,useEffect} from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
    user:false,
    isFetching:false,
    error:false
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({children}) =>{
    //check if there is a user
    const localState = JSON.parse(localStorage.getItem("authState")) || INITIAL_STATE;
    const [state , dispatch] = useReducer(AuthReducer , localState);

    //save auth state
    useEffect(()=>{
        localStorage.setItem("authState" , JSON.stringify(state));
    },[state]);

    return(
        <AuthContext.Provider
            value={{
                user:state.user,
                isFetching:state.isFetching,
                error:state.error,
                dispatch,
            }}
        >
            {children}
        </AuthContext.Provider>
    )};