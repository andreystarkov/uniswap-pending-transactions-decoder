const { bytesToHex } = require('web3-utils')
const { toChecksumAddress } = require('ethereumjs-util')
const InputDataDecoder = require('ethereum-input-data-decoder')

function decodeInput (decoderOrAbi, input) {
    // console.log({ decoderOrAbi, input })
    const decoder = decoderOrAbi.constructor.name === 'Array'
        ? new InputDataDecoder(decoderOrAbi) // ABI was passed
        : decoderOrAbi // Decoder was passed
    
    const data = safeDecode(decoder, input)
    if (!data || !data.method) return null

    const paramsObject = data.inputs.reduce((params, curVal, index) => {
        const type = data.types[index]
        // Handle tuples
        if (type.startsWith('(')) {
            const tupleName = data.names[index][0]
            const tupleParamNames = data.names[index][1]
            // Handle tuple[] type
            if (type.endsWith(')[]')) {
                return {
                    ...params,
                    [tupleName]: [
                        ...curVal.map(tuple => handleTupleType(
                            tupleParamNames,
                            type.slice(0, type.length - 2),
                            index,
                            tuple,
                        )),
                    ],
                }
            }
            // Handle tuple type
            if (type.endsWith(')')) {
                return {
                    ...params,
                    [tupleName]: { ...handleTupleType(tupleParamNames, type, index, curVal) },
                }
            }
        }
        const name = data.names[index]
        const parsedValue = parseCallValue(curVal, type)
        return { ...params, [name]: parsedValue }
    }, {})
    const methodName = data.method

    return {
        methodName,
        params: paramsObject,
    }
}

function safeDecode(decoder, input) {
    let decodedInput = { method: null }
    // console.log({ decoder, input })
    try {
        decodedInput = decoder.decodeData(input)
    } catch (error) {
        // Input was invalid, swallow error
    }
    // console.log({ path: decodedInput.params.path })
    return decodedInput
}

function handleTupleType(tupleParamNames, type, index, curVal) {
    const types = type
        .slice(1, type.length - 1) // strip parens
        .split(',')

    return curVal.reduce((acc, val, i) => {
        const name = tupleParamNames[i]
        return { ...acc, [name]: parseCallValue(val, types[i]) }
    }, {})
}

function parseCallValue(val, type) {
    // console.log({ val, type })
    try {
        if (type === 'address') return standardiseAddress(val)
        if (type.includes('address[')) return val.map(a => standardiseAddress(a))
        if (type === 'string' || type.includes('string[')) return val
        if (type.includes('int[')) return val.map(v => v.toString())
        if (type.includes('int256[')) return val.map(v => v.toString())
        if (type.includes('int8[')) return val.map(v => v.toString())
        if (type.includes('int')) return val.toString()
        if (type.includes('bool')) return val
        if (type.includes('bytes32[')) return val.map(b => bytesToHex(b))
        if (type.includes('bytes[')) return val.map(b => bytesToHex(b))
        if (type.includes('bytes')) return bytesToHex(val)
        throw Error(`Unknown type ${type}`)
    } catch (error) {
        throw Error(
            `Failed to decode { type: '${JSON.stringify(
                type,
            )}', val: '${val}', typeof val: '${typeof val}' }: ${error}`,
        )
    }
}

function standardiseAddress(ad) {
    if (!ad.startsWith('0x')) return toChecksumAddress(`0x${ad}`)
    return toChecksumAddress(ad)
}

exports.decodeInput = decodeInput