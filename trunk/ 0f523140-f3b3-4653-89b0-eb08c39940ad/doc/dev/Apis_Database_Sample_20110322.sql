-- phpMyAdmin SQL Dump
-- version 3.3.9.2deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Mar 22, 2011 at 10:36 AM
-- Server version: 5.1.54
-- PHP Version: 5.3.5-1ubuntu4

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `apis`
--

-- --------------------------------------------------------

--
-- Table structure for table `accountbindings`
--

CREATE TABLE IF NOT EXISTS `accountbindings` (
  `user_id` char(36) NOT NULL,
  `user_site_id` varchar(60) NOT NULL,
  `site_id` int(11) NOT NULL,
  `secret1` varchar(64) NOT NULL,
  `secret2` varchar(64) DEFAULT NULL,
  `secret3` varchar(64) DEFAULT NULL,
  KEY `site_id` (`site_id`),
  KEY `user_site_id` (`user_site_id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `applications`
--

CREATE TABLE IF NOT EXISTS `applications` (
  `resume` int(11) NOT NULL,
  `resume_id` char(36) NOT NULL,
  `tweet_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `view_time` datetime NOT NULL,
  KEY `tweet_id` (`tweet_id`,`user_id`),
  KEY `resume_id` (`resume_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE IF NOT EXISTS `categories` (
  `cat_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `slug` varchar(200) NOT NULL,
  `cat_group` bigint(10) NOT NULL DEFAULT '0',
  `parent` bigint(20) NOT NULL,
  `count` bigint(20) NOT NULL,
  PRIMARY KEY (`cat_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `cat_relationship`
--

CREATE TABLE IF NOT EXISTS `cat_relationship` (
  `cat_id` bigint(20) NOT NULL,
  `tweet_id` char(36) NOT NULL,
  KEY `cat_id` (`cat_id`),
  KEY `tweet_id` (`tweet_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

CREATE TABLE IF NOT EXISTS `favorites` (
  `user_id` char(36) NOT NULL,
  `tweet_id` char(36) NOT NULL,
  PRIMARY KEY (`user_id`),
  KEY `tweet_id` (`tweet_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `followings`
--

CREATE TABLE IF NOT EXISTS `followings` (
  `following_id` char(36) NOT NULL,
  `search` varchar(200) NOT NULL,
  `user_id` char(36) NOT NULL,
  `deleted` tinyint(1) NOT NULL,
  `add_time` datetime NOT NULL,
  PRIMARY KEY (`following_id`),
  KEY `search` (`search`,`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `resumes`
--

CREATE TABLE IF NOT EXISTS `resumes` (
  `resume_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `available` longtext NOT NULL,
  `url` varchar(200) NOT NULL,
  PRIMARY KEY (`resume_id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE IF NOT EXISTS `roles` (
  `role_id` int(11) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(60) NOT NULL,
  `role_desc` varchar(200) NOT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `searches`
--

CREATE TABLE IF NOT EXISTS `searches` (
  `search` varchar(200) NOT NULL,
  `count` bigint(20) NOT NULL,
  PRIMARY KEY (`search`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `searchhistory`
--

CREATE TABLE IF NOT EXISTS `searchhistory` (
  `search` varchar(200) NOT NULL,
  `user_id` char(36) NOT NULL DEFAULT '',
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `history_id` char(36) NOT NULL,
  `add_time` datetime NOT NULL,
  PRIMARY KEY (`history_id`),
  KEY `search` (`search`,`deleted`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `siteinfo`
--

CREATE TABLE IF NOT EXISTS `siteinfo` (
  `site_name` varchar(60) NOT NULL,
  `site_id` int(11) NOT NULL AUTO_INCREMENT,
  `site_url` varchar(200) NOT NULL,
  PRIMARY KEY (`site_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE IF NOT EXISTS `tags` (
  `tag_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `slug` varchar(200) NOT NULL,
  `tag_group` bigint(10) NOT NULL DEFAULT '0',
  `parent` bigint(20) NOT NULL,
  `count` bigint(20) NOT NULL,
  PRIMARY KEY (`tag_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `tag_relationship`
--

CREATE TABLE IF NOT EXISTS `tag_relationship` (
  `tag_id` bigint(20) NOT NULL,
  `tweet_id` char(36) NOT NULL,
  KEY `tag_id` (`tag_id`),
  KEY `tweet_id` (`tweet_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tweets`
--

CREATE TABLE IF NOT EXISTS `tweets` (
  `site_id` int(11) NOT NULL,
  `tweet_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `content` longtext NOT NULL,
  `post_datetime` datetime NOT NULL,
  `type` int(11) NOT NULL,
  `tweet_site_id` varchar(60) NOT NULL,
  `favorite_count` bigint(20) NOT NULL,
  `application_count` bigint(20) NOT NULL,
  PRIMARY KEY (`tweet_id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `userinfo`
--

CREATE TABLE IF NOT EXISTS `userinfo` (
  `nickname` varchar(60) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `microblogs` bigint(20) NOT NULL,
  `user_id` char(36) NOT NULL,
  `role_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`),
  KEY `role_id` (`role_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
