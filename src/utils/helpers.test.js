import get from './get';
import isEmpty from './is_empty';
import isFunction, { isGeneratorFunction } from './is_function';
import isString from './is_string';

describe('get', () => {
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

describe('is_empty', () => {
  it('should return true with non-object values', () => {
    expect(isEmpty('test')).toEqual(true);
    expect(isEmpty(1)).toEqual(true);
    expect(isEmpty(1.1)).toEqual(true);
    expect(isEmpty(-1)).toEqual(true);
    expect(isEmpty(null)).toEqual(true);
    expect(isEmpty(undefined)).toEqual(true);
    expect(isEmpty(true)).toEqual(true);
  });
  it('should return true with a function', () => {
    const arrow = () => {};
    function normal() {}
    expect(isEmpty(arrow)).toEqual(true);
    expect(isEmpty(normal)).toEqual(true);
  });
  it('should return true with an empty array', () => {
    expect(isEmpty([])).toEqual(true);
  });
  it('should return true with an empty object', () => {
    expect(isEmpty({})).toEqual(true);
  });
  it('should return false with a filled array', () => {
    expect(isEmpty([1, 2, 3])).toEqual(false);
  });
  it('should return false with a filled object', () => {
    expect(isEmpty({ foo: 'bar' })).toEqual(false);
  });
});

describe('is_function', () => {
  const arrow = () => {};
  function normal() {}
  function* gen() {}
  it('should work with arrow, normal, and generator functions', () => {
    expect(isFunction(arrow)).toEqual(true);
    expect(isFunction(normal)).toEqual(true);
    expect(isFunction(gen)).toEqual(true);
  });
  it('should return false with non-functions', () => {
    expect(isFunction('test')).toEqual(false);
    expect(isFunction(1)).toEqual(false);
    expect(isFunction(1.1)).toEqual(false);
    expect(isFunction(-1)).toEqual(false);
    expect(isFunction(null)).toEqual(false);
    expect(isFunction(undefined)).toEqual(false);
    expect(isFunction(true)).toEqual(false);
  });
  describe('isGeneratorFunction', () => {
    it('should return true for only generator functions', () => {
      expect(isGeneratorFunction(arrow)).toEqual(false);
      expect(isGeneratorFunction(normal)).toEqual(false);
      expect(isGeneratorFunction(gen)).toEqual(true);
    });
  });
});

describe('is_string', () => {
  it('return true for strings', () => {
    expect(isString('test')).toEqual(true);
    expect(isString('')).toEqual(true);
  });
  it('should return false with non-strings', () => {
    expect(isString(1)).toEqual(false);
    expect(isString(1.1)).toEqual(false);
    expect(isString(-1)).toEqual(false);
    expect(isString(null)).toEqual(false);
    expect(isString(undefined)).toEqual(false);
    expect(isString(true)).toEqual(false);
  });
});
