describe('Array', function(){
	describe('#indexOf()', function(){
		it('should return -1 when the value is not present', function() {
			chai.assert.equal(-1, [1,2,3].indexOf(5));
			chai.assert.equal(-1, [1,2,3].indexOf(0));
		})
	})
	describe('#forEach()', function(){
		it('should loop through the entire array', function() {

			var i = 0;
			[1,2,3].forEach(function() {
				i++;
			});

			chai.assert.equal(i, 3);

		})
	})
})