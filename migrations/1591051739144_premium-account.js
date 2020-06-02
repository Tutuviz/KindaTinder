/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
	pgm.addColumns('users', {
		premium: { type: 'DATE' },
	});
};

exports.down = (pgm) => {
	pgm.dropTables('users', ['premium'], { ifExists: true });
};
