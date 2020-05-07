/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
	pgm.addColumns('users', {
		description: { type: 'VARCHAR(100)' },
		lives_in: { type: 'VARCHAR(50)' },
		latitude: { type: 'VARCHAR(15)' },
		longitude: { type: 'VARCHAR(15)' },
		school: { type: 'VARCHAR(30)' },
		work: { type: 'VARCHAR(30)' },
		show_location: { type: 'BOOLEAN', default: false },
		birthday: { type: 'DATE' },
	});
};

exports.down = (pgm) => {
	pgm.dropColumns('users', [
		'description',
		'lives_in',
		'latitude',
		'longitude',
		'school',
		'work',
		'show_location',
		'birthdate',
	]);
};
