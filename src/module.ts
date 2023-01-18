import { defineNuxtModule, findPath } from '@nuxt/kit'
import jiti from 'jiti'
import consola from 'consola'
import { name, version } from '../package.json'

const _require = jiti(process.cwd(), { interopDefault: true, esmResolve: true })

export type ServerInitResult = {
  pass: boolean
  continueOnFail?: boolean
  runtimeConfig?: object
  publicConfig?: object
  appConfig?: object
}

type Arrayable<T> = T | T[]

export interface ModuleOptions {
  scripts: Arrayable<string>
  silent: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: 'serverInit',
    compatibility: {
      nuxt: '^3.0.0'
    }
  },
  defaults: {
    scripts: 'server.init',
    silent: false
  },

  async setup (options, nuxt) {
    /**
     * Server Init Script file handling
     */
    interface initScript {
      name: string,
      path: string
    }

    // creating logger based on silent option
    const logger = consola.create({
      level: options.silent ? 1 : 4
    })

    const initScripts: initScript[] = []

    logger.info(' 🟠 Checking if there are any server initialization scripts to run')

    // if an array is passed using the options, use that, otherwise use the default script filename as an array
    const initScriptNames = Array.isArray(options.scripts) ? options.scripts : [options.scripts]

    // for each of the paths within the initScripts array, try to find the file and add it to the initScriptPaths array
    for (const initScriptName of initScriptNames) {
      // find the path of the file
      const initScriptPath: string = (await findPath(initScriptName, { extensions: ['.js', '.cjs', '.mjs', '.ts'] }, 'file')) || ''

      // if its using the deafult path without additonal scripts, but didnt find the file, then skip
      if (initScriptName === 'server.init' && !Array.isArray(options.scripts) && !initScriptPath) {
        logger.warn(' 🟡 No default script file found and no additional scripts declared, continuing without running server initialization scripts.')
        logger.info(' ❓ To run server initialization scripts, create a file at the root path of your Nuxt 3 project called: server.init.ts or add files to the serverInit.scripts array in your nuxt.config.ts file.')
        return
      }

      // if a file was declared in the nuxt.config.ts options, but the file was not found, then warn and exit
      if (!initScriptPath) {
        logger.warn(` 🚨 A file called ${initScriptName} was configured for server initializaion, but the file was not found. Please check the file exists, or remove the path from the serverInit.scripts array in your nuxt.config.ts file.`)
        throw new Error('Server initialization script not found')
      }

      // if a file was found, add it to the initScripts array
      if (initScriptPath) {
        logger.info(` 👍 Found script file at: ${initScriptPath}`)
        initScripts.push({ name: initScriptName, path: initScriptPath })
      }
    }

    // for each of the paths within the initScripts array, import the file process the results
    for (const initScript of initScripts) {
      logger.info(` 🚦 Runing script: ${initScript.name}`)

      // using jiti to import the file as Nuxt importModule is deprecated
      const result: ServerInitResult = await _require(initScript.path).result

      // if script failed, warn and exit if continueOnFail is false else continue
      if (!result.pass && result.continueOnFail) {
        logger.warn(` 🚨 ${initScript.name} server initialization script failed but 🔵 continueOnFail was set to true, continuing to run scripts`)
        continue
      }
      if (!result.pass && !result.continueOnFail) {
        logger.warn(` 🚨 ${initScript.name} server initialization script failed and ❌ continueOnFail was set to false (default), stopping further scripts and halting Nuxt 3 launch.`)
        throw new Error('Server initialization script failed')
      }

      // if some configs were returned, add them to the runtimeConfig, publicConfig and appConfig objects
      if (result.runtimeConfig) {
        logger.info(` 🛠️  Merging new config from ${initScript.name} to Nuxt 3 runtimeConfig!`)
        Object.assign(nuxt.options.runtimeConfig, result.runtimeConfig)
      }
      if (result.publicConfig) {
        logger.info(` 🛠️  Merging new config from ${initScript.name} to Nuxt 3 runtimeConfig.public!`)
        Object.assign(nuxt.options.runtimeConfig.public, result.publicConfig)
      }
      if (result.appConfig) {
        logger.info(` 🛠️  Merging new from ${initScript.name} to Nuxt 3 appConfig!`)
        Object.assign(nuxt.options.appConfig, result.appConfig)
      }

      // if the script passed, log a success message
      logger.success(` ✅ ${initScript.name} script ran succesfully`)
    }

    logger.success(' 🎉 Finished running all server initialization scripts, starting Nuxt 3 server')
  }
})
