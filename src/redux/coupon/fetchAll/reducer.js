import * as Types from './types';

const InitialState = {
    data : [],
    errors : '',
    loading : false
}

const Reducer = (state = InitialState, action)=>{
    switch(action.type){
        case Types.FETCH_COUPON_LIST_REQUEST:
            return{
                ...state,
                loading : true
            }
        case Types.FETCH_COUPON_LIST_SUCCESS:
            return{
                ...state,
                data : action.payload,
                loading : false
            }
        case Types.FETCH_COUPON_LIST_FAILED:
            return{
                ...state,
                loading : false
            }
        default:
            return state
    }
}

export default Reducer;