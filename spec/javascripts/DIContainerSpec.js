describe("Dependency Injection Container", function() {
  var dic;

  beforeEach(function() {
    dic = new DIContainer({
      'first_name': 'John',
      'last_name': function() {
        return 'Doe';
      },
      'full_name': function(dic) {
        return dic.get('first_name') + ' ' + dic.get('last_name');
      },
      'birth_date': {
        '_shared': function() {
          return new Date("October 13, 1975 11:13:00");
        }
      },
      'pets': function() {
        return new Array("Miss Kitty Fantastico");
      }
    });
  });

  it("should return scalar values as is", function() {
    expect(dic.get('first_name')).toEqual('John');
  });

  it("should run factory functions", function() {
    expect(dic.get('last_name')).toEqual('Doe');
  });

  it("should be able to nest factory calls", function() {
    expect(dic.get('full_name')).toEqual('John Doe');
  });

  it("should throw an exception if requested key has not been defined", function() {
    expect(function() {
      dic.get('foobar');
    }).toThrow('Key "foobar" has not been defined');
  });

  it("should not return shared instances by default", function() {
    var first = dic.get('pets');
    var second = dic.get('pets');

    expect(first).not.toBe(second);
  });

  it("should return a shared instance if sharing is enabled", function() {
    var first = dic.get('birth_date');
    var second = dic.get('birth_date');

    expect(first).toBe(second);
  });
});