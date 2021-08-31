import { ActionContext, ActionTree, MutationTree } from 'vuex';


// export interface State {
//     test: string | null;
//     userData:object,
//     interestDialog: boolean,
//     switchEdition: boolean,
//     courseList: object[],
//     selectDataStart: number,
//     detailStart:number
// }
// export interface RootState extends State {}

// export interface Actions<S, R> extends ActionTree<S, R> {
//     nuxtServerInit (context: ActionContext<S, R>): void
//     setTest(context: ActionContext<S, R>,data:string | null):void
//     setUserData(userData:object):void
// }
/**
 * Root State
 */
export const state = ()=>({
  test: '无所谓',
  userData:{},
  interestDialog: false,
  switchEdition: true,
  courseList: [],
  selectDataStart: 0,
  detailStart:1,
  orderData: {},
  isIE:false,
  receiveCouponClick:false
})

/**
 * Root Mutations
 */
export const mutations = {
    SETTEST(state,payload){
        state.test = payload
    },
    SETUSERDATA(state,payload){
        state.userData = payload
    },
    SETINTERESTDIALOG(state,payload){
        state.interestDialog = payload
    },
    SWITCHEDITIONBOOL(state,payload){
        state.switchEdition = payload
    },
    GETCOURSELISTDATA(state,payload){
        state.courseList = payload
    },
    ISSELECtSMSTART(state, payload) { 
        state.selectDataStart = payload
    },
    ISDETAILTART(state, payload) { 
        state.detailStart = payload
    },    
    SETORDERDATA(state,payload){
        state.orderData = payload;
    },
    SETISIE(state,payload){
        state.isIE = payload;
    },
    SETRECEIVECOUPONCLICK(state,payload){
        state.receiveCouponClick = payload;
    } 
};

/**
 * Root Actions
 */
export const actions = {
    async nuxtServerInit ({ commit }) {
        
    },
    setTest({ commit },payload){
        commit('SETTEST',payload)
    },
    setUserData({ commit },payload){
        commit('SETUSERDATA',payload)
    },
    setInterestDialog({ commit },payload){
        commit('SETINTERESTDIALOG',payload)
    },
    setSwitchBoolCommit({ commit },payload){
        commit('SWITCHEDITIONBOOL',payload)
    }, 
    setCourseListDataCommit({ commit },payload) { 
        commit('GETCOURSELISTDATA',payload)
    },
    selectMyStartEven({ commit },payload) { 
        commit('ISSELECtSMSTART',payload)
    },
    setOrderData({commit},payload){
        commit('SETORDERDATA',payload)
    },
    setDetailStart({ commit },payload) { 
        commit('ISDETAILTART',payload)
    },
    setIsIE({commit},payload){
        commit('SETISIE',payload)
    },
    setReceiveCouponClick({commit},payload){
        commit('SETRECEIVECOUPONCLICK',payload)
    }
};

