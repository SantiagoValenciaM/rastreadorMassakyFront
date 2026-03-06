CREATE TABLE Users (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('ADMIN','CLIENT','SUPERVISOR') NOT NULL
) CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
  
CREATE TABLE Location (
    id_user INT,
    latitude FLOAT,
    longitud FLOAT,
    PRIMARY KEY (id_user),
    FOREIGN KEY (id_user) REFERENCES Users(id_user)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE admin_supervisor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fk_id_admin INT,
    fk_id_supervisor INT,
    FOREIGN KEY (fk_id_admin) REFERENCES Users(id_user)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (fk_id_supervisor) REFERENCES Users(id_user)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE supervisor_client (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fk_id_supervisor INT,
    fk_id_client INT,
    FOREIGN KEY (fk_id_supervisor) REFERENCES Users(id_user)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (fk_id_client) REFERENCES Users(id_user)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);