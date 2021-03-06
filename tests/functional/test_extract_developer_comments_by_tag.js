import { expect } from 'chai';
import * as babel from 'babel-core';
import fs from 'fs';
import c3po from 'src/plugin';
import { rmDirSync } from 'src/utils';
import dedent from 'dedent';

const output = 'debug/translations.pot';
const options = {
    plugins: [[c3po, { extract: { output }, addComments: 'translator:' }]],
};

describe('Extract developer comments by tag', () => {
    before(() => {
        rmDirSync('debug');
    });

    it('should extract comment comment', () => {
        const input = dedent(`
        import { t } from 'c-3po';
        
        //translator: test1
        t\`test\`
        `);
        babel.transform(input, options);
        const result = fs.readFileSync(output).toString();
        expect(result).to.contain('#. test1');
    });

    it('should not extract comment', () => {
        const input = dedent(`
        import { t } from 'c-3po';
        
        //comment2
        t\`test2\`
        `);
        babel.transform(input, options);
        const result = fs.readFileSync(output).toString();
        expect(result).to.not.contain('#. comment2');
    });
});
