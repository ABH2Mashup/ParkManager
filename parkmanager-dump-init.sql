-- phpMyAdmin SQL Dump
-- version 4.7.9
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le :  mer. 20 nov. 2019 à 22:19
-- Version du serveur :  5.7.21
-- Version de PHP :  7.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `parkmanager`
--

-- --------------------------------------------------------

--
-- Structure de la table `parkings`
--

DROP TABLE IF EXISTS `parkings`;
CREATE TABLE IF NOT EXISTS `parkings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `zipCode` int(11) NOT NULL,
  `city` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `nbPlaces` int(11) NOT NULL,
  `nbEtages` int(11) NOT NULL,
  `dtCreated` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `parkings`
--

INSERT INTO `parkings` (`id`, `name`, `address`, `zipCode`, `city`, `country`, `type`, `nbPlaces`, `nbEtages`, `dtCreated`) VALUES
(1, 'Parking Q-Park Rouen Palais de Justice', '8 Allée Eugène Delacroix', 76000, 'Rouen', 'France', 'sous-terrain', 200, 4, 1574286027),
(2, 'Parking du Vieux Marché', 'Place du Vieux Marché', 76000, 'Rouen', 'France', 'sous-terrain', 300, 5, 1574286063),
(3, 'Parking Indigo Rouen Saint-Marc', 'Place Saint-Marc', 76000, 'Rouen', 'France', 'sous-terrain', 250, 5, 1574286093);

-- --------------------------------------------------------

--
-- Structure de la table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
CREATE TABLE IF NOT EXISTS `reservations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `parkingId` int(11) NOT NULL,
  `numPlace` int(11) DEFAULT NULL,
  `dtCreated` int(11) NOT NULL,
  `dtStart` int(11) NOT NULL,
  `dtEstime` int(11) NOT NULL,
  `dtEnd` int(11) DEFAULT NULL,
  `actif` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `reservations`
--

INSERT INTO `reservations` (`id`, `userId`, `parkingId`, `numPlace`, `dtCreated`, `dtStart`, `dtEstime`, `dtEnd`, `actif`) VALUES
(1, 1, 1, 1, 1574286580, 1574280000, 1582056000, NULL, 1),
(2, 2, 1, 2, 1574286664, 1574280000, 1582056000, NULL, 1),
(3, 3, 1, 3, 1574286682, 1574280000, 1574280060, NULL, 1);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) DEFAULT NULL,
  `dtRegister` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `email`, `lastname`, `firstname`, `password`, `role`, `dtRegister`) VALUES
(1, 'test1@test.fr', 'test1', 'test1', '5a105e8b9d40e1329780d62ea2265d8a', '', 1574285372),
(2, 'test2@test.fr', 'test2', 'test2', 'ad0234829205b9033196ba818f7a872b', '', 1574285384),
(3, 'admin@test.fr', 'admin', 'adminUpdate2', '21232f297a57a5a743894a0e4a801fc3', 'admin', 1574285412);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
