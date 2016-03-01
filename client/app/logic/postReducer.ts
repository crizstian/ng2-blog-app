import {OpaqueToken,provide,Inject} from 'angular2/core';
import {Subject}                    from 'rxjs/Subject';
import {Injectable}                 from 'angular2/core';
import {AppState,stateRedux}        from './AppState';
import {Post}                   from '../models/post';
import {Action,PostActions,networkAction,stateAction}       from './Actions';
import {Observable}                 from 'rxjs/Observable';


export function posts(initState: stateRedux, actions: Observable<Action>): Observable<Object> {
  //State is the accumulator && Action is the current value
  return actions.scan((state, action) => {
    let items = [];
    switch(action.action.type){
      // =============================
      case stateAction.REQUEST_DATA:

        return Object.assign({}, state, {
          isFetching: true,
          didInvalidate: false,
          items: action.action.json.map(item => postReducer(item,'ADD_DATA'))
        });
      // =============================
      case stateAction.RECEIVE_DATA:
        let didInvalidate = false;
        items         = state.items;

        if(action.action.err){
          didInvalidate = true;
          items         = [];
        }

        return Object.assign({}, state, {
            isFetching: false,
            didInvalidate,
            items
          });
        // =============================
        case stateAction.DELETE_DATA:
          return Object.assign({}, state, {
              isFetching: false,
              didInvalidate: false,
              items: state.items.filter(t => t._id !== action.action.id)
            });
        // =============================
        case stateAction.ADD_DATA:
          return Object.assign({}, state, {
              isFetching: false,
              didInvalidate: false,
              items: [...state.items, postReducer(action.action.json,stateAction.ADD_DATA)]
            });
        // =============================
        case stateAction.UPDATE_DATA:
          return Object.assign({}, state, {
              isFetching: false,
              didInvalidate: false,
              items: state.items.map(item => (item._id !== action.action.id) ?
                item : postReducer(item,stateAction.UPDATE_DATA))
            });

    }
  }, initState);
}

function postReducer(item:any,type:string) {
  switch(type){
    case stateAction.ADD_DATA:
      return new Post(item.title,item.content,item.img,new Date(item.created),item._id);
    // case stateAction.UPDATE_DATA:

  }
}
