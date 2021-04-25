import {expect} from 'chai'
import {timestamp} from "../../src"

describe('basic test', () => {
    it('timestamp date in the expected format', () => {
        const r = timestamp()
        expect(r).to.match(/^\d\d\d\d-\d\d-\d\d/)
    })
    it('timestamp fully in the expected format', () => {
        const r = timestamp()
        expect(r).to.match(/^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d\.\d\d\dZ/)
    })
})
