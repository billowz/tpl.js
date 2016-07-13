const observer = require('observer'),
    regHump = /(^[a-z])|([_-][a-zA-Z])/g

function _hump(k) {
    if (k[0] == '_' || k[0] == '-')
        k = k[1]
    return k.toUpperCase();
}

function assign(target, source, alias){
    observer.each(source, (v,k)=>{
        target[alias[k] || k] = v
    })
    return target
}

module.exports = assign({
    hump(str) {
        return str.replace(regHump, _hump);
    },
    YieId: observer.dynamicClass({
        constructor() {
            this.doned = false
            this.thens = []
        },
        then(callback) {
            if (this.doned)
                callback()
            else
                this.thens.push(callback)
        },
        done() {
            if (!this.doned) {
                let thens = this.thens;
                for (let i = 0, l = thens.length; i < l; i++) {
                    thens[i]()
                }
                this.doned = true
            }
        },
        isDone() {
            return this.doned
        }
    })
}, observer, {
    on: 'observe',
    un: 'unobserve',
    hasListen: 'isObserved'
})

if(!Object.create)
    Object.create = observer.create
