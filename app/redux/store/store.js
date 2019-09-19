import { createStore, applyMiddleware, compose } from 'redux'
import createLogger from 'redux-logger'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'
const configureStore = preloadedState => {
  return createStore(
    rootReducer,
    preloadedState,
    compose(applyMiddleware(thunk, createLogger))
  )
}

const store = configureStore()
export default store
