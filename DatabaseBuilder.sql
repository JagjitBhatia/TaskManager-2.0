CREATE DATABASE `TaskManagerDB` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE TaskManagerDB;
CREATE TABLE `Tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `time` datetime DEFAULT NULL,
  `completed` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;