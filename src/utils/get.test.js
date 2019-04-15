import get from './get';

describe('Get', () => {
  it('should handle a simple key value pair', () => {
    let test = {
      foo: 'bar',
    };
    expect(get(test, 'foo')).toEqual('bar');
  });

  it('should handle a simple key value pair where the value is an array', () => {
    let test = {
      foo: ['bar'],
    };
    expect(get(test, 'foo[0]')).toEqual('bar');
  });

  it('should handle complex nested values ', () => {
    let test = {
      foo: {
        bar: {
          fang: 'foo',
          bang: [
            {},
            {
              boo: 'bar',
            },
          ],
        },
      },
    };
    expect(get(test, 'foo.bar.bang[1].boo')).toEqual('bar');
    expect(get(test, 'foo.bar.fang')).toEqual('foo');
  });
});
