var landscapingMockProvider = {
   getBrushMock: function() {
    return {
      getAffectedTiles: function() {}
    };
  },
   getToolMock: function() {
    return {
      processTile: function() {}
    };
  },
  getTileMock: function() {
    return function() {}
  }
}
