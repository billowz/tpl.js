const observer = require('observer'),
    _ = observer.util

module.exports = _.assignIf({
        YieId: _.dynamicClass({
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
        }),
        eq: observer.eq,
        obj: observer.obj,
        proxy: observer.proxy,
        Logger: observer.Logger,
        logger: observer.logger,
        timeoutframe: observer.timeoutframe,
        observe: observer.on,
        unobserve: observer.un,
        isObserved: observer.hasListen
    }, _)

