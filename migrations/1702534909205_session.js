/* eslint-disable camelcase */

exports.shorthands = undefined;

/**
 * @param { import("node-pg-migrate/dist/types").MigrationBuilder } pgm
 */

exports.up = pgm => {
    pgm.createTable("session", {
        sid: {
            type: "varchar",
            notNull: true,
            primaryKey: true, // Define the sid column as the primary key
        },
        sess: {
            type: "jsonb",
            notNull: true,
        },
        expire: {
            type: "timestamp(6)",
            notNull: true,
        },
    });
    pgm.createIndex("session", "expire");
};

exports.down = pgm => {
    pgm.dropTable("session");
};



/*
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");

*/