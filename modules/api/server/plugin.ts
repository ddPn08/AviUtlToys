import type { IPackageJson } from 'package-json-type'

export type PluginHookFn = (ctx: PluginContext) => Promise<void> | void

export type PluginContext = {
    dataFolder: string
    meta: IPackageJson
}
export type PluginHooks = {
    preInitialization?: PluginHookFn
    postInitialization?: PluginHookFn
}
export type PluginData = {
    context: PluginContext
    hooks?: PluginHooks
}
export const createPlugin = (hooks: PluginHooks) => hooks
export type PluginModule = {
    default: PluginHooks
    context: PluginContext
}

export class PluginManager {
    public plugins = new Map<string, PluginData>()

    public async registerPlugin(plugin: PluginModule) {
        const hooks = plugin.default
        this.plugins.set(plugin.context.meta['id'], {
            context: plugin.context,
            hooks: hooks || {},
        })

        if (plugin.context) this.updateContext(plugin.context.meta['id'], plugin.context)
    }

    public getContext(id: string) {
        return this.plugins.get(id)?.context
    }

    public updateContext(id: string, context: PluginContext) {
        const plugin = this.plugins.get(id)
        if (plugin) plugin.context = context
    }

    public *hook(type: keyof PluginHooks) {
        for (const plugin of this.plugins.values()) {
            const hook = plugin.hooks?.[type]
            if (hook)
                yield {
                    hook,
                    context: plugin.context,
                }
        }
    }
}
