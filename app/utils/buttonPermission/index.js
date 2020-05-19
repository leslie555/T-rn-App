import storage from "../storage";

const getButtons = function (EModuleName) {
  return new Promise((resolve,reject)=>{
    storage.get('userinfo').then(res => {
      const modules = res.jurisdic.Data.Module
      const actions = res.jurisdic.Data.Action
      const a = modules.find(x=>x.EModuleName===EModuleName)
      if(a){
        const b = actions.filter(x=>x.ModuleID===a.KeyID)
        resolve(b)
      }else{
        resolve([])
      }
    })
  })
}

const hasModule = function (EModuleName) {
  return new Promise((resolve,reject)=>{
    storage.get('userinfo').then(res => {
      const modules = res.jurisdic.Data.Module
      const a = modules.find(x=>x.EModuleName===EModuleName)
      console.log(a)
      if(a){
        resolve()
      }else {
        reject()
      }
    })
  })
}

export {
  hasModule,
  getButtons
}
