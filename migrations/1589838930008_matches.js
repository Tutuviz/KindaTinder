/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
	pgm.createTable(
		'matches',
		{
			id: {
				type: 'UUID',
				primaryKey: true,
				default: pgm.func('uuid_generate_v4()'),
			},
			user_id: { type: 'UUID', notNull: true },
			match_id: { type: 'UUID', notNull: true },
			user_liked: { type: 'BOOLEAN', default: false },
			match_liked: { type: 'BOOLEAN', default: false },
			unmatched: { type: 'BOOLEAN', default: false },
		},
		{ ifNotExists: true },
	);
};

exports.down = (pgm) => {
	pgm.dropTable('matches', { ifExists: true, cascade: true });
};
