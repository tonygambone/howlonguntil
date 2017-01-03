
import { moment } from '../app/shims';

describe('the import shim', () => {
    it('imports moment with the duration formatter', () => {
        expect(moment.duration(1).format).toBeDefined();
    });
});

