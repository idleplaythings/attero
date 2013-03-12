describe("Scrolling", function() {
  var scrolling;

  beforeEach(function() {
    var mockElement = {on:function(){}};
    var mockDispatcher = {attach:function(){}, dispatch:function(){}};

    scrolling = new Scrolling(mockElement, mockDispatcher);

  });

  it("should return scalar values as is", function() {
    expect(dic.get('first_name')).toEqual('John');
  });
});