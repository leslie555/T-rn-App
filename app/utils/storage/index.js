/* eslint-disable no-new-func */
// 存储前缀
import { storage_prefix } from '../../config/index'
import { AsyncStorage } from 'react-native'

class Storage {
    constructor() {
        this.prefix = storage_prefix
        this.store = AsyncStorage
    }

    set(key, value) {
        try {
            value = JSON.stringify(value)
        } catch (e) {
            //
        }
        return this.store.setItem(this.prefix + key, value)
    }

    get(key) {
        return new Promise((resolve, reject) => {
            if (!key) {
                return reject(new Error('没有找到key。'))
            }
            if (typeof key === 'object') {
                return reject(new Error('key不能是一个对象。'))
            }
            let value = {}
            this.store
                .getItem(this.prefix + key)
                .then(data => {
                    value = data
                    try {
                        value = JSON.parse(value)
                    } catch (e) {
                        //
                    }
                    return resolve(value)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    remove(key) {
        this.store.removeItem(this.prefix + key)
        return this
    }
}

export default new Storage()
