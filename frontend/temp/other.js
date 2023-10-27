const doAThing = (param) => {
    console.log(`${true ? "Hi" : 'hello'} ${param} from within other `)
}


// module.exports = { doAThing }
export { doAThing }