function test({names, ...obj}) {
    console.log(names, obj)
}


const obj = {
    names: 'ulan',
    test: 'test'
}


test(obj)