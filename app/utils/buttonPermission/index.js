import storage from "../storage";

const hasButton = function (EModuleName,ActionName) {
  return new Promise((resolve,reject)=>{
    storage.get('userinfo').then(res => {
      const modules = res.jurisdic.Data.Module
      const actions = res.jurisdic.Data.Action
      const a = modules.find(x=>x.EModuleName===EModuleName)
      const b = actions.filter(x=>x.ModuleID===a.KeyID)
      const index = b.find(x=>x.EActionName===ActionName)
      if(index!==-1){
        resolve()
      }else{
        reject()
      }
    })
  })
}

const getButtons = function (EModuleName) {
  return new Promise((resolve,reject)=>{
    storage.get('userinfo').then(res => {
      const modules = res.jurisdic.Data.Module
      const actions = res.jurisdic.Data.Action
      const a = modules.find(x=>x.EModuleName===EModuleName)
      const b = actions.filter(x=>x.ModuleID===a.KeyID)
      resolve(b)
    })
  })
}

export {
  hasButton,
  getButtons
}
