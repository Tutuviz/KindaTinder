/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
	pgm.addColumns('users', {
		min_age: { type: 'SMALLINT' },
		max_age: { type: 'SMALLINT' },
	});
};

exports.down = (pgm) => {
	pgm.dropColumns('users', ['min_age', 'max_age'], { ifExists: true });
};
