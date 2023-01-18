// export a defult const

export const result = (() => {
  console.log('Doing server init check from example file')
  console.log('Simulating a long running check')
  // sleep for 10 seconds - simulate a long running check

  // setting the runtimeConfig values to be set
  const runtimeConfig = {
    foo: 'bar'
  }
  const publicConfig = {
    gee: 'wiz'
  }
  const appConfig = {
    hello: 'world',
    pizza: 'Best Food!'
  }
  console.log('Finishing script')
  // return the results
  return { pass: true, runtimeConfig, publicConfig, appConfig, continueOnFail: true }
})()
