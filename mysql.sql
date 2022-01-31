-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Czas generowania: 28 Sty 2022, 18:54
-- Wersja serwera: 10.4.22-MariaDB
-- Wersja PHP: 8.0.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Baza danych: `mysql`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `clients`
--

CREATE TABLE `clients` (
  `id_clients` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `lastName` varchar(32) NOT NULL,
  `email` varchar(64) NOT NULL,
  `password` varchar(64) NOT NULL,
  `phone_number` varchar(9) NOT NULL,
  `adress` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Zrzut danych tabeli `clients`
--

INSERT INTO `clients` (`id_clients`, `name`, `lastName`, `email`, `password`, `phone_number`, `adress`) VALUES
(1, 'Dawid', 'Pudełko', 'dawid@gmail.com', '123', '323123213', 'Rzeszów 3 maja 3'),
(10, 'Szymon', 'Zięba', 'szymon@gmail.com', '123', '321321321', 'Sędziszów ul antoniego 54'),
(26, 'Andrzej', 'Pietrzak', 'andrzej@gmail.com', '123', '123232131', 'ciekawska 13'),
(30, 'dsa', 'dadsad', 'szymon@adam.pl', '123', '323213323', 'dsd')ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `poroduct`
--

CREATE TABLE `poroduct` (
  `id_product` int(11) NOT NULL,
  `id_types` int(11) NOT NULL,
  `id_clients` int(11) NOT NULL,
  `title` varchar(64) NOT NULL,
  `description` varchar(255) NOT NULL,
  `img_src` varchar(100) NOT NULL,
  `price` decimal(30,2) NOT NULL,
  `date_publishment` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Zrzut danych tabeli `poroduct`
--

INSERT INTO `poroduct` (`id_product`, `id_types`, `id_clients`, `title`, `description`, `img_src`, `price`, `date_publishment`) VALUES
(65, 16, 1, 'dsadsadd', '<srcipt> alert(\"1\")</script>', '0840b62642de2fcdae7edb28c20577e4.jpeg', '32.00', '2022-01-18 00:00:00'),
(67, 15, 1, 'Płyta', '321312', '4686be6be55e5a79028cb1960f36087f.jpeg', '0.00', '2022-01-18 00:00:00'),
(68, 15, 10, 'Płyta', '3222', 'ae4c0c4b837ae6cbd1079687b51d44fe.jpeg', '0.00', '2022-01-21 00:00:00'),
(69, 15, 10, 'Płyta queeen', '323', '63c6497d9ee48fd244d87cb511983922.jpeg', '321321.00', '2022-01-21 00:00:00'),
(72, 18, 10, 'cos nowego', '321312312', '3c590faaf595e6291541b1e9159c1bac.jpeg', '0.00', '2022-01-21 00:00:00'),
(73, 14, 10, 'SIEMA', '321312412412', 'f457797a7c9bed9943ff6abcc13ab8d3.jpeg', '0.00', '2022-01-21 00:00:00'),
(74, 14, 10, 'asdadad', '312321.421', '056f89f18bf09947bc67e53d6092066b.jpeg', '0.00', '2022-01-21 00:00:00'),
(75, 14, 10, 'Stara baśń', '3213', '34d21dae5b3c45065ea2229c628ffe27.jpeg', '0.00', '2022-01-21 00:00:00')ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `types`
--

CREATE TABLE `types` (
  `id_types` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `img_source` varchar(255) CHARACTER SET utf8 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Zrzut danych tabeli `types`
--

INSERT INTO `types` (`id_types`, `name`, `img_source`) VALUES
(13, 'Motoryzacja', 'auto.png'),
(14, 'Praca', 'aparat.png'),
(15, 'Muzyka', 'gitara.jpg'),
(16, 'Gry', 'gra.jpg'),
(17, 'Sport', 'pilka.jpg'),
(18, 'Moda', 'moda.png')ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `workers`
--

CREATE TABLE `workers` (
  `id_workers` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `lastName` varchar(32) NOT NULL,
  `email` varchar(64) NOT NULL,
  `password` varchar(64) NOT NULL,
  `phone_number` varchar(9) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Zrzut danych tabeli `workers`
--

INSERT INTO `workers` (`id_workers`, `name`, `lastName`, `email`, `password`, `phone_number`) VALUES
(1, 'ADMIN', 'ADMIN', 'admin@test.pl', 'admin', '123123')ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id_clients`),
  ADD UNIQUE KEY `Clients_email_unique` (`email`);

--
-- Indeksy dla tabeli `poroduct`
--
ALTER TABLE `poroduct`
  ADD PRIMARY KEY (`id_product`) USING BTREE,
  ADD KEY `id_clients` (`id_clients`) USING BTREE,
  ADD KEY `id_types` (`id_types`) USING BTREE;

--
-- Indeksy dla tabeli `types`
--
ALTER TABLE `types`
  ADD PRIMARY KEY (`id_types`);

--
-- Indeksy dla tabeli `workers`
--
ALTER TABLE `workers`
  ADD PRIMARY KEY (`id_workers`),
  ADD UNIQUE KEY `Workers_email_unique` (`email`);

--
-- AUTO_INCREMENT dla zrzuconych tabel
--

--
-- AUTO_INCREMENT dla tabeli `clients`
--
ALTER TABLE `clients`
  MODIFY `id_clients` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT dla tabeli `poroduct`
--
ALTER TABLE `poroduct`
  MODIFY `id_product` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- AUTO_INCREMENT dla tabeli `types`
--
ALTER TABLE `types`
  MODIFY `id_types` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT dla tabeli `workers`
--
ALTER TABLE `workers`
  MODIFY `id_workers` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Ograniczenia dla zrzutów tabel
--

--
-- Ograniczenia dla tabeli `poroduct`
--
ALTER TABLE `poroduct`
  ADD CONSTRAINT `poroduct_ibfk_1` FOREIGN KEY (`id_clients`) REFERENCES `clients` (`id_clients`),
  ADD CONSTRAINT `poroduct_it_types` FOREIGN KEY (`id_types`) REFERENCES `types` (`id_types`);
COMMIT;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `addPost`(IN `id_clients` INT(11), IN `id_types` INT(11), IN `title` VARCHAR(64), IN `description` VARCHAR(255), IN `img_src` VARCHAR(100), IN `price` DECIMAL(13.2), IN `date_publishment` DATE)
BEGIN
	INSERT INTO poroduct (poroduct.id_clients,
                          poroduct.id_types, 			
                          poroduct.title, 
                          poroduct.description, 
                          poroduct.img_src, 
                          poroduct.price, 
            			  poroduct.date_publishment) 
    VALUES (id_clients, id_types, title, description, img_src, price, date_publishment);

END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `editPost`(IN `id` INT(13), IN `id_types` INT(13), IN `title` VARCHAR(32), IN `description` VARCHAR(32), IN `img_src` VARCHAR(100), IN `price` DECIMAL(13,2))
BEGIN
	UPDATE poroduct
    SET
                  poroduct.id_types = id_types,
                  poroduct.title = title,
                  poroduct.description = description,
                  poroduct.img_src = img_src,
                  poroduct.price = price
    WHERE poroduct.id_product = id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getClient`(IN `id` INT)
BEGIN
	SELECT * FROM clients WHERE clients.id_clients = id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getClientByEmail`(IN `email` VARCHAR(64))
BEGIN
	SELECT * FROM clients WHERE clients.email = email;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getClientProducts`(IN `id` INT)
BEGIN
	SELECT *, clients.email as email 
    FROM poroduct 
    INNER JOIN clients 
    ON poroduct.id_clients = clients.id_clients
    WHERE clients.id_clients = id
    ;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getPost`(IN `id` INT)
BEGIN
	SELECT * FROM poroduct WHERE poroduct.id_product = id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getPosts`(IN `id` INT)
BEGIN
	SELECT *, types.name as type 
    FROM poroduct 
    INNER JOIN types 
    ON poroduct.id_types = types.id_types
    WHERE types.id_types = id
    ;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getProductClient`(IN `id` INT)
BEGIN
	SELECT *,
    clients.email as email
    FROM poroduct 
    INNER JOIN clients 
    ON poroduct.id_clients = clients.id_clients;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getProductTC`(IN `id` INT)
BEGIN
	SELECT *, types.name as type, clients.email as email FROM poroduct 
    INNER JOIN types ON poroduct.id_types = types.id_types
    INNER JOIN clients ON poroduct.id_clients = clients.id_clients
    ;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getProductType`(IN `id` INT)
BEGIN
	SELECT *,
    types.name as type
    FROM poroduct 
    INNER JOIN types 
    ON poroduct.id_types = types.id_types;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getType`(IN `id` INT)
BEGIN
	SELECT * FROM types WHERE types.id_types = id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getTypes`()
BEGIN
	SELECT * FROM types;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `loginAdmin`(IN `login` VARCHAR(32), IN `pass` VARCHAR(64))
begin
  select * FROM workers WHERE workers.email = login AND workers.password = pass;
end$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `loginClient`(IN `login` VARCHAR(32), IN `pass` VARCHAR(64))
begin
  select * FROM clients WHERE clients.email = login AND clients.password = pass;
end$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `registerClients`(IN `name` VARCHAR(32), IN `lastName` VARCHAR(64), IN `email` VARCHAR(64), IN `password` VARCHAR(64), IN `phone_number` INT(9), IN `adress` VARCHAR(64))
BEGIN
	INSERT INTO clients (clients.name, clients.lastName, clients.email, clients.password, clients.phone_number, clients.adress) VALUES (name, lastName, email, password, phone_number, adress);
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `removePost`(IN `id` INT(13))
BEGIN
	DELETE FROM poroduct WHERE poroduct.id_product = id;
END$$
DELIMITER ;


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
