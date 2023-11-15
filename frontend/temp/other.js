const doAThing = (param) => {
    console.log(`${true ? "Hi" : 'hello'} ${param} from within other...`)

}
// this is equivalent to module.exports = { doAThing }
export { doAThing }