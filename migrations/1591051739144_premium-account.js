/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
	pgm.addColumns('users', {
		hide_age: { type: 'BOOL', default: false },
		hide_distance: { type: 'BOOL', default: false },
		premium: { type: 'DATE' },
	});
};

exports.down = (pgm) => {
	pgm.dropColumns('users', ['hide_age', 'hide_distance', 'premium'], {
		ifExists: true,
	});
};
