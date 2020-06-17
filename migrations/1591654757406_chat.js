/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
	pgm.createTable('messages', {
		match_id: { type: 'UUID' },
		sender_id: { type: 'UUID' },
		msg: { type: 'TEXT' },
		datetime: { type: 'TIMESTAMP', default: pgm.func('NOW()') },
		delivered: { type: 'BOOL', default: false },
	});
	pgm.addConstraint('messages', 'match_id_constraint', {
		foreignKeys: {
			columns: 'match_id',
			references: 'matches(id)',
		},
	});
	pgm.addConstraint('messages', 'sender_id_constraint', {
		foreignKeys: {
			columns: 'sender_id',
			references: 'users(id)',
		},
	});
};

exports.down = (pgm) => {
	pgm.dropTable('messages', { ifExists: true, cascade: true });
};
