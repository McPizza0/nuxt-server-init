Depreciated in favour of the amazing [`nuxt-prepare`](https://github.com/johannschopplich/nuxt-prepare) module by [@johannschopplich](https://github.com/johannschopplich) : https://github.com/johannschopplich/nuxt-prepare

# 🔌 nuxt-server-init

A Nuxt 3 module to run scripts before Nuxt 3 is ready to serve.


## ❓ Use Cases

- ✅ Check all required environment variables are set and valid
- 🔗 Test connections to Databases or other external resources
- 💾 Load environment variables from an external source such as a Database
- 🦄 Set new environment variables based on anything
- ❌ Stop new instances from running if version does not contain critical security patch

## 🌟 Features

- 🛑 Set scripts to either halt (default) or continue loading Nuxt if they fail
- 🔥 Inject/Insert new variables to runtimeConfig, public runtimeConfig and/or appConfig
- 🌈 Run a single or multiple scripts, each with their own failure action
- 🌳 Helpful logging for running scripts (can be silenced)

## 💾 Installation

Add nuxt-server-init dependency to your project

```bash
  npm install nuxt-server-init
```
Add nuxt-server-init to the modules section of nuxt.config.js
```javascript
{
  modules: [
    'nuxt-server-init'
  ]
}
```

## 🔥 Usage

### 1️⃣ Basic Usage
Create a file called `server.init.ts` (or `.js`) in the root directory of your Nuxt 3 project.

This file needs to export a const that returns an object that contains a `pass` boolean.

```javascript
export default const = { pass: true }
```

### 🟢 Continue if error
By default, an error will be thrown (Nuxt 3 will be halted) if `pass` is returned as `false`.

If you want Nuxt 3 to continue launching, also return `continueOnFail: true`. (You will still get failure logs in the console)

```javascript
export default const = { pass: false, continueOnFail:true }
```

### ➡️ Function vs Inline Function
Depending on your use case, you may want to use an inline function to simplify your code or return the values from multiple functions.

```javascript
export const result = (() => {
  
  // do something cool

  return { pass: true, continueOnFail:true }
})()
```

### ⏲️ Async/Await
If you need to do some long running tasks, simply set the const's function to `async` and add your `await`s within the code block

```javascript
export const result = (async () => {
  // sleep for 5 seconds - simulate a long running check
  await new Promise(resolve => setTimeout(resolve, 5000))

  return { pass: true, continueOnFail:true }
})()
```

### 🛠️ Returning Config
To insert new config variables into Nuxt, return `runtimeConfig`, `publicConfig`, and/or `appConfig` as an `object` with `key: "value"` pairs
```javascript
export const result = (() => {
  // setting the runtimeConfig values to be returned
  const runtimeConfig = {
    foo: 'bar'
  } // will add the variables for server side config only
  
  const publicConfig = {
    gee: 'wiz'
  } // will add the variables to server and client config
  
  const appConfig = {
    hello: 'world',
    pizza: 'Best Food!'
  } // will add the variables to the app config
  
  
  return { pass: true, runtimeConfig, publicConfig, appConfig }
})()
```

### 🟦 Typescript
To load types, import ServerInitResult from the module
```javascript
import { ServerInitResult } from 'nust-server-init'
export const result: Promise<ServerInitResult> = (async () => {
    // return the results
  return { pass: true, continueOnFail, runtimeConfig, publicConfig, appConfig }// will be correctly typed
})()
```
### 🌈 Multiple Scripts

To run multiple scripts, add the file names to the module options in `nuxt.config.ts`.
File names can include or exclude the extension, and will be run in the order they are written.

```javascript
modules: ['../src/module'],
  serverInit: {
    scripts: ['example.init', 'another.init.ts']
  }
```
When adding script file names to `nuxt.config.ts`, the default `server.init.ts` will not be run unless it is specifically added.
Adding `.init` is not required, but helps ensure everyone understands what the file is for.

### 💤 Silent Running

To keep your console logs clean, you may want to set the module to silent. You will still get log messages on failure and any `console.log` statements within your scripts.
To do this, add `silent: true` to the module's options in your `nuxt.config.ts` file

```javascript
modules: ['../src/module'],
  serverInit: {
    silent: true
  }
```

## 👍 Contributing

Contributions are always welcome!
Please open an issue and/or a pull request

To run locally:
- Clone this repository
- Install dependencies using npm install
- Prepare for development using npm run dev:prepare
- Start development server using npm run dev
