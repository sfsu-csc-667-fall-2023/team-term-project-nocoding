-- tables
-- Table: board
CREATE TABLE board (
    id int  NOT NULL,
    board_name varchar(64)  NOT NULL,
    starting_position varchar(32)  NOT NULL,
    details text  NULL,
    CONSTRAINT board_ak_1 UNIQUE (board_name) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT board_pk PRIMARY KEY (id)
);

-- Table: current_board_position
CREATE TABLE current_board_position (
    id int  NOT NULL,
    game_id int  NOT NULL,
    board_id int  NOT NULL,
    position_notation varchar(64)  NOT NULL,
    CONSTRAINT current_board_position_ak_1 UNIQUE (game_id, board_id) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT current_board_position_ak_2 UNIQUE (game_id, position_notation) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT current_board_position_pk PRIMARY KEY (id)
);

-- Table: current_piece_position
CREATE TABLE current_piece_position (
    id int  NOT NULL,
    game_id int  NOT NULL,
    piece_type_id int  NOT NULL,
    piece_id int  NOT NULL,
    position_notation varchar(64)  NOT NULL,
    CONSTRAINT current_piece_position_ak_1 UNIQUE (game_id, position_notation) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT current_piece_position_ak_2 UNIQUE (game_id, piece_id) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT current_piece_position_pk PRIMARY KEY (id)
);

-- Table: game
CREATE TABLE game (
    id int  NOT NULL,
    player_id_1 int  NOT NULL,
    player_id_2 int  NOT NULL,
    number_of_moves int  NOT NULL,
    player_id_next int  NOT NULL,
    result_id_1 int  NOT NULL,
    result_id_2 int  NOT NULL,
    player_1_points_won int  NOT NULL,
    player_2_points_won int  NOT NULL,
    CONSTRAINT game_pk PRIMARY KEY (id)
);

-- Table: move
CREATE TABLE move (
    id int  NOT NULL,
    game_id int  NOT NULL,
    player_id int  NOT NULL,
    move_in_the_game int  NOT NULL,
    piece_id int  NULL,
    piece_type_id int  NULL,
    board_id int  NULL,
    move_notation varchar(64)  NOT NULL,
    CONSTRAINT move_pk PRIMARY KEY (id)
);

-- Table: move_type
CREATE TABLE move_type (
    id int  NOT NULL,
    type_name varchar(64)  NOT NULL,
    piece_type_id int  NULL,
    board_id int  NOT NULL,
    is_piece_move bool  NOT NULL,
    is_board_move bool  NOT NULL,
    CONSTRAINT move_type_ak_1 UNIQUE (type_name, piece_type_id, board_id) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT move_type_pk PRIMARY KEY (id)
);

-- Table: piece
CREATE TABLE piece (
    id int  NOT NULL,
    piece_name varchar(64)  NOT NULL,
    starting_position varchar(32)  NOT NULL,
    board_id int  NOT NULL,
    piece_type_id int  NOT NULL,
    CONSTRAINT piece_ak_1 UNIQUE (piece_name) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT piece_ak_2 UNIQUE (starting_position) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT piece_pk PRIMARY KEY (id)
);

-- Table: piece_type
CREATE TABLE piece_type (
    id int  NOT NULL,
    type_name varchar(64)  NOT NULL,
    CONSTRAINT piece_type_ak_1 UNIQUE (type_name) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT piece_type_pk PRIMARY KEY (id)
);

-- Table: player
CREATE TABLE player (
    id int  NOT NULL,
    first_name varchar(64)  NOT NULL,
    last_name varchar(64)  NOT NULL,
    user_name varchar(64)  NOT NULL,
    password varchar(64)  NOT NULL,
    nickname varchar(64)  NOT NULL,
    email varchar(128)  NOT NULL,
    condfirmation_code varchar(128)  NOT NULL,
    confirmation_date timestamp  NULL,
    current_rating int  NOT NULL,
    CONSTRAINT player_ak_1 UNIQUE (nickname) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT player_ak_2 UNIQUE (email) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT player_ak_3 UNIQUE (user_name) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT player_pk PRIMARY KEY (id)
);

-- Table: result
CREATE TABLE result (
    id int  NOT NULL,
    result_name int  NOT NULL,
    CONSTRAINT result_ak_1 UNIQUE (result_name) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT result_pk PRIMARY KEY (id)
);

-- foreign keys
-- Reference: current_board_position_board (table: current_board_position)
ALTER TABLE current_board_position ADD CONSTRAINT current_board_position_board
    FOREIGN KEY (board_id)
    REFERENCES board (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: current_board_position_game (table: current_board_position)
ALTER TABLE current_board_position ADD CONSTRAINT current_board_position_game
    FOREIGN KEY (game_id)
    REFERENCES game (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: current_piece_position_game (table: current_piece_position)
ALTER TABLE current_piece_position ADD CONSTRAINT current_piece_position_game
    FOREIGN KEY (game_id)
    REFERENCES game (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: current_piece_position_piece (table: current_piece_position)
ALTER TABLE current_piece_position ADD CONSTRAINT current_piece_position_piece
    FOREIGN KEY (piece_id)
    REFERENCES piece (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: current_piece_position_piece_type (table: current_piece_position)
ALTER TABLE current_piece_position ADD CONSTRAINT current_piece_position_piece_type
    FOREIGN KEY (piece_type_id)
    REFERENCES piece_type (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: game_player (table: game)
ALTER TABLE game ADD CONSTRAINT game_player
    FOREIGN KEY (player_id_next)
    REFERENCES player (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: game_player_1 (table: game)
ALTER TABLE game ADD CONSTRAINT game_player_1
    FOREIGN KEY (player_id_1)
    REFERENCES player (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: game_player_2 (table: game)
ALTER TABLE game ADD CONSTRAINT game_player_2
    FOREIGN KEY (player_id_2)
    REFERENCES player (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: game_result_1 (table: game)
ALTER TABLE game ADD CONSTRAINT game_result_1
    FOREIGN KEY (result_id_1)
    REFERENCES result (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: game_result_2 (table: game)
ALTER TABLE game ADD CONSTRAINT game_result_2
    FOREIGN KEY (result_id_2)
    REFERENCES result (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: move_board (table: move)
ALTER TABLE move ADD CONSTRAINT move_board
    FOREIGN KEY (board_id)
    REFERENCES board (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: move_game (table: move)
ALTER TABLE move ADD CONSTRAINT move_game
    FOREIGN KEY (game_id)
    REFERENCES game (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: move_piece (table: move)
ALTER TABLE move ADD CONSTRAINT move_piece
    FOREIGN KEY (piece_id)
    REFERENCES piece (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: move_piece_type (table: move)
ALTER TABLE move ADD CONSTRAINT move_piece_type
    FOREIGN KEY (piece_type_id)
    REFERENCES piece_type (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: move_player (table: move)
ALTER TABLE move ADD CONSTRAINT move_player
    FOREIGN KEY (player_id)
    REFERENCES player (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: move_type_board (table: move_type)
ALTER TABLE move_type ADD CONSTRAINT move_type_board
    FOREIGN KEY (board_id)
    REFERENCES board (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: move_type_piece_type (table: move_type)
ALTER TABLE move_type ADD CONSTRAINT move_type_piece_type
    FOREIGN KEY (piece_type_id)
    REFERENCES piece_type (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: piece_board (table: piece)
ALTER TABLE piece ADD CONSTRAINT piece_board
    FOREIGN KEY (board_id)
    REFERENCES board (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: piece_piece_type (table: piece)
ALTER TABLE piece ADD CONSTRAINT piece_piece_type
    FOREIGN KEY (piece_type_id)
    REFERENCES piece_type (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- End of file.

