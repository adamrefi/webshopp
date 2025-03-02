-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Már 01. 18:12
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `webshoppp`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `akcio`
--

CREATE TABLE `akcio` (
  `akcios_ar` int(11) NOT NULL,
  `akcio_eleje` date NOT NULL,
  `akcio_vege` date NOT NULL,
  `a_azonosito` int(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kategoriak`
--

CREATE TABLE `kategoriak` (
  `cs_azonosito` int(11) NOT NULL,
  `cs_nev` varchar(255) NOT NULL,
  `cs_csoport` int(11) DEFAULT NULL,
  `t_alkategoria` int(11) DEFAULT NULL,
  `fo_kategoria` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `kategoriak`
--

INSERT INTO `kategoriak` (`cs_azonosito`, `cs_nev`, `cs_csoport`, `t_alkategoria`, `fo_kategoria`) VALUES
(1, 'Felsőruházat', NULL, 4, 3),
(2, 'Alsóruházat', NULL, NULL, NULL),
(3, 'Ruha', NULL, 1, NULL),
(4, 'Póló', 1, 6, 1),
(5, 'Pulóver', 1, NULL, 1),
(6, 'Rövidujjú', 4, 1, NULL),
(7, 'Hosszúujjú', 4, 1, NULL);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kosar`
--

CREATE TABLE `kosar` (
  `azonosito` int(30) NOT NULL,
  `felhasznalo_id` int(30) NOT NULL,
  `termek_id` int(30) NOT NULL,
  `mennyiseg` int(30) NOT NULL,
  `ruhatipus_id` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `rendeles`
--

CREATE TABLE `rendeles` (
  `azonosito` int(30) NOT NULL,
  `termek` varchar(30) NOT NULL,
  `statusz` varchar(30) NOT NULL,
  `mennyiseg` int(30) NOT NULL,
  `vevo_id` int(30) NOT NULL,
  `rendeles_id` int(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `termekek`
--

CREATE TABLE `termekek` (
  `t_azonosito` int(30) NOT NULL,
  `t_nev` varchar(30) NOT NULL,
  `t_ar` int(30) NOT NULL,
  `egysegar` int(30) NOT NULL,
  `t_csoport` int(30) NOT NULL,
  `termekleiras` varchar(60) NOT NULL,
  `meret` varchar(30) NOT NULL,
  `szin` varchar(30) NOT NULL,
  `alkategoria` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `termekek`
--

INSERT INTO `termekek` (`t_azonosito`, `t_nev`, `t_ar`, `egysegar`, `t_csoport`, `termekleiras`, `meret`, `szin`, `alkategoria`) VALUES
(9, 'Póló', 1500, 2000, 4, 'Ez a polo elég jó és minőségi', 'XL', 'fehér', 6),
(10, 'Póló', 1500, 2000, 4, 'Ez a polo elég jó és minőségi', 'XL', 'fekete', 7),
(11, 'Póló', 1500, 2000, 4, 'Ez a polo elég jó és minőségi', 'XL', 'szürke', NULL),
(13, 'Pulóver', 20000, 20000, 5, 'Ez a púolver minőségi', 'XL', 'fekete', NULL),
(14, 'Pulóver', 20000, 20000, 5, 'Ez a púolver minőségi', 'XL', 'fekete', NULL),
(15, 'Pulóver', 20000, 20000, 5, 'Ez a púolver minőségi', 'XL', 'fekete', NULL);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `user`
--

CREATE TABLE `user` (
  `felhasznalonev` varchar(30) NOT NULL,
  `jelszo` varchar(30) NOT NULL,
  `email` varchar(50) NOT NULL,
  `f_azonosito` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `user`
--

INSERT INTO `user` (`felhasznalonev`, `jelszo`, `email`, `f_azonosito`) VALUES
('', 'ikrek', 'adamka.davidka.2005@gmail.com', 1),
('', '$2b$10$KOsKW.EzGGdgzbrzBHWiy.4', 'dubleczbence@gmail.com', 2),
('', '$2b$10$Vdyy4ltXxBuaJCm2v55nne4', 'bence@gmail.com', 3),
('a', '$2b$10$GGtX.5szfBr8rLZiq0NJU.3', 'aa.2005@gmail.com', 4),
('', '123', 'davemond2005@gmail.com', 5),
('', '1234', 'aaaaaaa.2005@gmail.com', 6),
('', '1234', 'aaaa.2005@gmail.com', 7),
('', '1234', 'vidka.2005@gmail.com', 8),
('', '1234', 'damka.davidka.2005@gmail.com', 9),
('', '1234', 'adadavidka.2005@gmail.com', 10),
('', '1234', 'ka.davidka.2005@gmail.com', 11),
('adam', '1234', 'ad2.2005@gmail.com', 12),
('adam', '$2b$10$Y6haSEom/WUp0Ita/gG3Fe.', 'adaa.2005@gmail.com', 13),
('adada', '$2b$10$LBo4bJxq.IRHu3fuUcXc0.E', 'adamkdavidka.2005@gmail.com', 14),
('adam', '$2b$10$H376YV8UMEVachlu1kmk6OG', 'adad2avidka.2005@gmail.com', 15),
('adam', '$2b$10$6XSI48D5aDtbJyqVgSXTtOP', 'adaa.idka.2005@gmail.com', 16),
('adam', '$2b$10$Et.GlfdCQzGfjQ48YDOUo.6', 'ada23452005@gmail.com', 17),
('Réfi Ádám', '$2b$10$JkSe3KowRHMI1jhczPx8NOt', '.davidka.2005@gmail.com', 18),
('adam', '$2b$10$NdRS.9yMW6Z7SHmKfg4OgeR', 'adammmmm@gmail.com', 19),
('webshop', '$2b$10$XrGNzw/fcNCBqUauq3DJ7ua', 'adam@gmail.com', 20),
('asdam', '$2b$10$pCUEtQi0FQnoLU46XC1H0uk', 'adaaammm@gmail.com', 21),
('adam', '$2b$10$Nstg3HhqvvBlJSqTX8m2HuH', 'adammmm@gmail.com', 22),
('adam', '$2b$10$bv8NZdt6ONTkchcL81IFwet', 'adammm@gmail.com', 23);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `usertermekek`
--

CREATE TABLE `usertermekek` (
  `id` int(11) NOT NULL,
  `kategoriaId` int(11) NOT NULL,
  `ar` int(11) NOT NULL,
  `nev` varchar(255) NOT NULL,
  `leiras` varchar(255) NOT NULL,
  `meret` varchar(255) NOT NULL,
  `imageUrl` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `vevo`
--

CREATE TABLE `vevo` (
  `v_azonosito` int(40) NOT NULL,
  `nev` varchar(40) NOT NULL,
  `telefonszam` varchar(40) NOT NULL,
  `email` varchar(40) NOT NULL,
  `szuletesi_datum` date NOT NULL,
  `irsz` int(40) NOT NULL,
  `telepules` varchar(40) NOT NULL,
  `kozterulet` varchar(40) NOT NULL,
  `hirlevel` varchar(40) NOT NULL,
  `payment_method` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `vevo`
--

INSERT INTO `vevo` (`v_azonosito`, `nev`, `telefonszam`, `email`, `szuletesi_datum`, `irsz`, `telepules`, `kozterulet`, `hirlevel`, `payment_method`) VALUES
(3, 'adam', '311434', 'adam.david.@gmail.com', '2006-04-25', 8754, 'keszthely', 'foter', 'adadda', NULL),
(4, 'adam', '311434', 'adam.david.@gmail.com', '2004-12-01', 8754, 'keszthely', 'foter', 'adadda', NULL),
(5, 'adam', '311434', 'adam.david.@gmail.com', '0000-00-00', 8754, 'keszthely', 'foter', 'adadda', NULL),
(6, 'cadadad', '1', 'adada', '0000-00-00', 4232, 'adadad', 'adadad', '', NULL),
(8, 'adam', '36306456286', 'adam.david.@gmail.com', '2234-02-02', 6666, 'keszthely', 'foter', '', NULL),
(9, 'adam', '36306456286', 'adam.david.@gmail.com', '2002-02-02', 6666, 'keszthely', 'foter', '', NULL),
(10, 'adam', '36306456286', 'adam.david.@gmail.com', '2222-02-02', 6666, 'keszthely', 'foter', '', NULL),
(11, 'adam', '36306456286', 'adam.david.@gmail.com', '2222-02-02', 6666, 'keszthely', 'foter', '', NULL),
(12, '', '', '', '0000-00-00', 0, '', '', '', NULL),
(13, '', '', '', '0000-00-00', 0, '', '', '', NULL),
(14, 'adam', '36306456286', 'adam.david.@gmail.com', '2002-02-02', 6666, 'keszthely', 'foter', '', 'bank_card'),
(15, 'adam', '36306456286', 'adam.david.@gmail.com', '2002-03-31', 6666, 'keszthely', 'foter', '', 'bank_card'),
(16, 'adam', '36306456286', 'adam.david.@gmail.com', '2002-03-31', 6666, 'keszthely', 'foter', '', 'bank_card'),
(17, 'adam', '36306456286', 'adam.david.@gmail.com', '2002-03-31', 6666, 'keszthely', 'foter', '', 'bank_card'),
(18, 'adam', '36306456286', 'adam.david.@gmail.com', '2002-02-02', 6666, 'keszthely', 'foter', '', 'bank_card'),
(19, 'adam', '36306456286', 'adam.david.@gmail.com', '2001-02-02', 2242, 'kaptafa', 'dozsa ter', '', 'bank_card'),
(20, 'adam', '36306456286', 'adam.david.@gmail.com', '2000-02-02', 2242, 'kaptafa', 'dozsa ter', '', 'bank_card'),
(21, 'adam', '36306456286', 'adam.david.@gmail.com', '1200-12-02', 2242, 'kaptafa', 'dozsa ter', '', 'bank_card'),
(22, 'adam', '36306456286', 'adam.david.@gmail.com', '2002-02-02', 2242, 'kaptafa', 'dozsa ter', '', 'bank_card'),
(23, 'toma', '3633333333', 'adam.david.@gmail.com', '2024-01-01', 8700, 'bosreostcsok', 'toma ter', '', 'bank_card'),
(24, 'mate', '3630000000', 'davud@2004gmnail.com', '2001-02-01', 8400, 'keszthely', 'foter', '', 'bank_card');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `akcio`
--
ALTER TABLE `akcio`
  ADD PRIMARY KEY (`a_azonosito`);

--
-- A tábla indexei `kategoriak`
--
ALTER TABLE `kategoriak`
  ADD PRIMARY KEY (`cs_azonosito`);

--
-- A tábla indexei `kosar`
--
ALTER TABLE `kosar`
  ADD PRIMARY KEY (`azonosito`),
  ADD KEY `felhasznalo_id` (`felhasznalo_id`),
  ADD KEY `termek_id` (`termek_id`);

--
-- A tábla indexei `rendeles`
--
ALTER TABLE `rendeles`
  ADD PRIMARY KEY (`azonosito`),
  ADD KEY `vevo_id` (`vevo_id`),
  ADD KEY `rendeles_id` (`rendeles_id`);

--
-- A tábla indexei `termekek`
--
ALTER TABLE `termekek`
  ADD PRIMARY KEY (`t_azonosito`),
  ADD KEY `fk_csoport` (`t_csoport`);

--
-- A tábla indexei `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`f_azonosito`);

--
-- A tábla indexei `usertermekek`
--
ALTER TABLE `usertermekek`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kategoriaId` (`kategoriaId`);

--
-- A tábla indexei `vevo`
--
ALTER TABLE `vevo`
  ADD PRIMARY KEY (`v_azonosito`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `akcio`
--
ALTER TABLE `akcio`
  MODIFY `a_azonosito` int(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `kategoriak`
--
ALTER TABLE `kategoriak`
  MODIFY `cs_azonosito` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT a táblához `kosar`
--
ALTER TABLE `kosar`
  MODIFY `azonosito` int(30) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `rendeles`
--
ALTER TABLE `rendeles`
  MODIFY `azonosito` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT a táblához `termekek`
--
ALTER TABLE `termekek`
  MODIFY `t_azonosito` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT a táblához `user`
--
ALTER TABLE `user`
  MODIFY `f_azonosito` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT a táblához `usertermekek`
--
ALTER TABLE `usertermekek`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `vevo`
--
ALTER TABLE `vevo`
  MODIFY `v_azonosito` int(40) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `kosar`
--
ALTER TABLE `kosar`
  ADD CONSTRAINT `kosar_ibfk_1` FOREIGN KEY (`felhasznalo_id`) REFERENCES `user` (`f_azonosito`),
  ADD CONSTRAINT `kosar_ibfk_2` FOREIGN KEY (`termek_id`) REFERENCES `termekek` (`t_csoport`);

--
-- Megkötések a táblához `rendeles`
--
ALTER TABLE `rendeles`
  ADD CONSTRAINT `rendeles_ibfk_1` FOREIGN KEY (`vevo_id`) REFERENCES `user` (`f_azonosito`),
  ADD CONSTRAINT `rendeles_ibfk_2` FOREIGN KEY (`rendeles_id`) REFERENCES `vevo` (`v_azonosito`);

--
-- Megkötések a táblához `termekek`
--
ALTER TABLE `termekek`
  ADD CONSTRAINT `termekek_ibfk_1` FOREIGN KEY (`t_csoport`) REFERENCES `kategoriak` (`cs_azonosito`);

--
-- Megkötések a táblához `usertermekek`
--
ALTER TABLE `usertermekek`
  ADD CONSTRAINT `usertermekek_ibfk_1` FOREIGN KEY (`kategoriaId`) REFERENCES `kategoriak` (`cs_azonosito`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
