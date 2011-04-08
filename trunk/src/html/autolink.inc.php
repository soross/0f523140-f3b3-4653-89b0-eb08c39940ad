<?php

/**
 * Twitter Autolink Class
 *
 * Based on code by Matt Sanford, http://github.com/mzsanford

From http://github.com/mzsanford/twitter-text-php/blob/master/src/Twitter/Autolink.php
This file is
Copyright 2010 Mike Cochrane
 
Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at
 
http://www.apache.org/licenses/LICENSE-2.0
 
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License. 

Modified by Terence Eden for Dabr
*/
class Twitter_Autolink {
	
	/* HTML attribute to add when noFollow is true (default) */
	const NO_FOLLOW_HTML_ATTRIBUTE = " rel=\"nofollow\"";

	/* Default CSS class for auto-linked URLs */
	protected $urlClass = "item-blog-link";

	/* Default CSS class for auto-linked list URLs */
	protected $listClass = "item-blog-link";

	/* Default CSS class for auto-linked username URLs */
	protected $usernameClass = "item-blog-link";
    
    protected $hashtagClass = "tag";

	/* Default CSS class for auto-linked hashtag URLs */

	/* Default href for username links (the username without the @ will be appended) */
	//protected $usernameUrlBase = "http://twitter.com/";
	
	/* Default href for list links (the username/list without the @ will be appended) */
	//protected $listUrlBase = "http://twitter.com/";
	
	/* Default href for hashtag links (the hashtag without the # will be appended) */
	//protected $hashtagUrlBase = "http://twitter.com/search?q=%23";
	
	protected $noFollow = true;

	function __construct() {
	}

	public function autolink($tweet) {
		return $this->autoLinkUsernamesAndLists($this->autoLinkURLs($this->autoLinkHashtags($this->autoLinkEmail($tweet))));
	}

	public function autoLinkHashtags($tweet) {
		// TODO Match latin chars with accents
		/*return preg_replace('$(^|[^0-9A-Z&/]+)([#＃]+)([0-9A-Z_]*[A-Z_]+[a-z0-9_üÀ-ÖØ-öø-ÿ]*)$iu',
			'${1}<a href="' . $this->get_base() . 'hash/' . '${3}" title="#${3}" class="' . $this->urlClass . ' ' . $this->hashtagClass . '">${2}${3}</a>',
							$tweet);*/
        $t = preg_replace('$([#＃])([a-z0-9\-_\/\x{4e00}-\x{9fa5}]{1,20})([#＃])$iu',
			'<a title="${2}" class="' . $this->urlClass . ' ' . $this->hashtagClass . '">${1}${2}${3}</a>',
							$tweet);
        return $t;
	}
    
    public function autoLinkEmail($tweet) {
        $t = preg_replace('/([a-zA-Z0-9_\.]+([@|＠|#]|\[at\])[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,4})/',
                          '<a class="' . $this->urlClass . '" href="mailto:${1}">${1}</a>', $tweet);
        return $t;
    }

	public function autoLinkURLs($tweet) {
		  $URL_VALID_PRECEEDING_CHARS = "(?:[^/\"':!=]|^|\\:)";
		  $URL_VALID_DOMAIN = "(?:[\\.-]|[^\\p{P}\\s])+\\.[a-z]{2,}(?::[0-9]+)?";
		  $URL_VALID_URL_PATH_CHARS = "[a-z0-9!\\*'\\(\\);:&=\\+\\$/%#\\[\\]\\-_\\.,~@]";
		  // Valid end-of-path chracters (so /foo. does not gobble the period).
		  //	1. Allow ) for Wikipedia URLs.
		  //	2. Allow =&# for empty URL parameters and other URL-join artifacts
		  $URL_VALID_URL_PATH_ENDING_CHARS = "[a-z0-9\\)=#/]";
		  $URL_VALID_URL_QUERY_CHARS = "[a-z0-9!\\*'\\(\\);:&=\\+\\$/%#\\[\\]\\-_\\.,~]";
		  $URL_VALID_URL_QUERY_ENDING_CHARS = "[a-z0-9_&=#]";
		  $VALID_URL_PATTERN_STRING = '$(' .						//  $1 total match
			"(" . $URL_VALID_PRECEEDING_CHARS . ")" .				//  $2 Preceeding chracter
			"(" .																//  $3 URL
			  "(https?://|www\\.)" .									//  $4 Protocol or beginning
			  "(" . $URL_VALID_DOMAIN . ")" .						//  $5 Domain(s) and optional port number
			  "(/" . $URL_VALID_URL_PATH_CHARS . "*" .			//  $6 URL Path
					 $URL_VALID_URL_PATH_ENDING_CHARS . "?)?" .
			  "(\\?" . $URL_VALID_URL_QUERY_CHARS . "*" .		//  $7 Query String
					  $URL_VALID_URL_QUERY_ENDING_CHARS . ")?" .
			")" .
		  ')$i';

		return preg_replace_callback($VALID_URL_PATTERN_STRING,
									 array(get_class($this), 'replacementURLs'),
									 $tweet);
	}

	/**
	 * Callback used by autoLinkURLs
	 */
	private function replacementURLs($matches) {
		$replacement  = $matches[2];
        //Workaround for [smile]
        if (substr($matches[3], -1, 1) == "[")
        {
            $matches[3] = substr($matches[3], 0, -1);
            $append = "[";
        }
        else
            $append = "";
		if (substr($matches[3], 0, 7) == 'http://' || substr($matches[3], 0, 8) == 'https://') {
			$replacement .= '<a class="' . $this->urlClass . '" href="' . $matches[3] . '" target="_blank">' . $matches[3] . '</a>';
		} else {
			$replacement .= '<a class="' . $this->urlClass . '" href="http://' . $matches[3] . '" target="_blank">' . $matches[3] . '</a>';
		}
        $replacement .= $append;
		return $replacement;
	}

	public function autoLinkUsernamesAndLists($tweet) {
		return preg_replace_callback('$([^a-z0-9_]|^)([@|＠])([a-z0-9\-_\x{4e00}-\x{9fa5}]{1,20})(/[a-z][a-z0-9\x80-\xFF-]{0,79})?$iu',
									 array($this, 'replacementUsernameAndLists'),
									 $tweet);
	}

	/**
	 * Callback used by autoLinkUsernamesAndLists
	 */
	private function replacementUsernameAndLists($matches) {
		$replacement  = $matches[1];
		#$replacement .= $matches[2];

		if (isset($matches[4])) {
			/* Replace the list and username */
			$replacement .= '<a class="' . $this->urlClass . ' ' . $this->listClass . '" href="' . $this->get_base() .'lists/'. $matches[3] . $matches[4] . '" target="_blank">' . $matches[2] . $matches[3] . $matches[4] . '</a>';
		} else {
			/* Replace the username */
			$replacement .= '<a class="' . $this->urlClass . ' ' . $this->usernameClass . '" href="' . $this->get_base() . 'profile/' . $matches[3] . '" target="_blank">' . $matches[2] . $matches[3] . '</a>';
		}

		return $replacement;
	}
	
	private function get_base()
	{
		return BASE_URL;
	}
}
