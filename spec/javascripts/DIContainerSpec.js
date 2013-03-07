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
});