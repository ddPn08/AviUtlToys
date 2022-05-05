import { Module } from 'module'

const isDev = process.env['NODE_ENV'] === 'development'

if (isDev) for (const v of ['source-map-support']) require(v)
for (const v of ['esbuild-register']) require(v)

Module.prototype.require = new Proxy(Module.prototype.require, {
    apply(target, thisArg, args) {
        if (!isDev && typeof args[0] === 'string' && args[0].startsWith('@aviutil-toys/api')) {
            const splited = args[0].split('/')
            if (splited.length == 2) splited.push('root')
            args[0] = `${splited[0]}/${splited[1]}/dist/${splited[2]}`
        }
        return Reflect.apply(target, thisArg, args)
    },
})
